#!/bin/bash

# Check if database file is provided as argument
if [ $# -ne 1 ]; then
    echo "Usage: $0 <database_file>"
    exit 1
fi

DB_FILE=$1
OUTPUT_FILE="data/database_structure.sql"

# Check if database file exists
if [ ! -f "$DB_FILE" ]; then
    echo "Error: Database file '$DB_FILE' not found"
    exit 1
fi

# Clear output file if it exists
> "$OUTPUT_FILE"

# Function to write section headers
write_header() {
    echo -e "\n-- =====================" >> "$OUTPUT_FILE"
    echo "-- $1" >> "$OUTPUT_FILE"
    echo -e "-- =====================\n" >> "$OUTPUT_FILE"
}

# Extract table schemas
write_header "TABLE SCHEMAS"
sqlite3 "$DB_FILE" ".schema --indent" >> "$OUTPUT_FILE"

# Extract table list with row counts
write_header "TABLE ROW COUNTS"
for table in $(sqlite3 "$DB_FILE" "SELECT name FROM sqlite_master WHERE type='table';"); do
    count=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM \"$table\";")
    echo "Table: $table, Rows: $count" >> "$OUTPUT_FILE"
done
# Extract indexes
write_header "INDEXES"
sqlite3 "$DB_FILE" "SELECT sql || ';' FROM sqlite_master WHERE type='index' AND sql IS NOT NULL;" >> "$OUTPUT_FILE"

# Extract triggers
write_header "TRIGGERS"
sqlite3 "$DB_FILE" "SELECT sql || ';' FROM sqlite_master WHERE type='trigger' AND sql IS NOT NULL;" >> "$OUTPUT_FILE"

# Extract views
write_header "VIEWS"
sqlite3 "$DB_FILE" "SELECT sql || ';' FROM sqlite_master WHERE type='view' AND sql IS NOT NULL;" >> "$OUTPUT_FILE"

# Extract foreign key relationships
write_header "FOREIGN KEY RELATIONSHIPS"
sqlite3 "$DB_FILE" "SELECT m.name || ': ' || GROUP_CONCAT(SUBSTR(sql, INSTR(sql, 'FOREIGN KEY'))) 
FROM sqlite_master m 
WHERE sql LIKE '%FOREIGN KEY%' 
GROUP BY m.name;" >> "$OUTPUT_FILE"

echo "Database structure has been extracted to $OUTPUT_FILE"