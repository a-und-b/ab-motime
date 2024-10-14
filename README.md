# MoTime

MoTime is a time tracking application that integrates Timing data with Moco.

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/motime.git
   cd motime
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```
   PORT=3000
   MOCO_DOMAIN=your_moco_domain
   MOCO_API_KEY=your_moco_api_key
   MONGODB_URI=your_mongodb_uri
   NODE_ENV=development
   ```

4. Start the development server:
   ```
   npm run dev
   ```

   This will start both the backend server and the frontend development server.

5. Open your browser and navigate to `http://localhost:8080` to view the application.

## Scripts

- `npm run dev`: Start both frontend and backend in development mode
- `npm run server`: Start only the backend server
- `npm run client`: Start only the frontend development server
- `npm run build`: Build the frontend for production

## TODO

- Implementierung einer Datenbank zur persistenten Speicherung von Daten
- Verbesserung der Benutzerauthentifizierung und -verwaltung
- Automatische Zuordnung von Projekten und Tasks zwischen Timing und Moco
- Implementierung von Fehlerbehandlung und Benutzerbenachrichtigungen
- Optimierung der Leistung für größere Datensätze
- Implementierung von Unit- und Integrationstests

## Contributing

[Your contribution guidelines]

## License

[Your chosen license, e.g. MIT]
