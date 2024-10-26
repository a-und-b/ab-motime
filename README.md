# MoTime

MoTime is a time tracking application that integrates Timing.app data with Moco.

## Current State

The application currently supports:
- Direct SQLite database integration with Timing.app
- Aggregated view of app activities and manual tasks
- Automatic project hierarchy detection and formatting
- Smart project and task matching between Timing and Moco
- Detailed activity information including:
  - App usage statistics
  - Activity counts
  - Task descriptions and notes
  - Duration in various formats

## Features

### Data Collection
- Reads directly from Timing.app's SQLite database
- Aggregates app activities by project and date
- Includes manual tasks with their descriptions
- Maintains project hierarchy information

### Data Processing
- Converts project paths to Moco-compatible format (e.g., "CLI > Project Name" → "[CLI] Project Name")
- Aggregates multiple activities into daily summaries
- Provides both raw seconds and formatted durations
- Tracks activity counts and used applications

### User Interface
- Daily grouping of time entries
- Distinction between app activities and manual tasks
- Detailed activity information display
- Project and task selection with auto-matching
- One-click transfer to Moco

## Setup

1. Clone and install:
   ```
   git clone https://github.com/a-und-b/motime.git
   cd motime
   npm install
   ```

2. Create a `.env` file in the root directory and add your environment variables:
   ```
   PORT=3000
   MOCO_DOMAIN=your_moco_domain
   MOCO_API_KEY=your_moco_api_key
   NODE_ENV=development
   TIMING_DB_PATH="/path/to/Timing.app/SQLite.db"
   TIMING_DAYS_BACK=30
   ```

3. Start the development server:
   ```
   npm run dev
   ```

   This will start both the backend server and the frontend development server.

4. Open your browser and navigate to `http://localhost:8080` to view the application.

## Scripts

- `npm run dev`: Start both frontend and backend in development mode
- `npm run server`: Start only the backend server
- `npm run client`: Start only the frontend development server
- `npm run build`: Build the frontend for production

## Features

- View Timing entries
- Select Moco projects and tasks for each entry
- Transfer time entries from Timing to Moco
- Basic error handling and logging

## TODO

- Implement automatic task mapping
- Add time period selection 
- Improve error handling and user feedback
- Improve UI/UX
- Implement unit and integration tests
- Implement persistent storage for transferred entries
- Add filtering and sorting options for time entries
- Optimize performance for larger datasets
- Add more detailed reporting and analytics features
- Add user authentication and authorization

## License

MIT License

Copyright (c) 2024 Holger Will

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
