# MoTime

MoTime is a time tracking application that integrates Timing data with Moco.

## Current State

The application currently supports:
- Reading time entries from a local Timing JSON file
- Displaying time entries in a list view
- Fetching projects and tasks from Moco API
- Creating completed time entries in Moco based on Timing data
- Basic error handling and logging

## Current Goal

We are currently working on implementing automatic project and task mapping between Timing and Moco. Specifically:

1. For each Timing entry, we aim to automatically match the project name with the corresponding Moco project.
   - The Timing project name format is typically "PREFIX ▸ Project Name ▸ Task"
   - The Moco project name format is typically "[PREFIX] Project Name"

2. If a project match is found, we then attempt to match the task name.
   - The task name in Timing is the last part of the project name string (after the last "▸")
   - We look for an exact match (case-insensitive) in the Moco tasks for the matched project

3. When a match is found, the UI pre-selects the matched project and task in the dropdown menus.

4. Users should still be able to manually change the selected project and task if needed.

This automatic mapping aims to streamline the process of transferring time entries from Timing to Moco, reducing manual work while maintaining flexibility for user adjustments.

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/a-und-b/motime.git
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
   NODE_ENV=development
   ```

4. Place your Timing JSON file in the root directory and name it `timing.json`.

5. Start the development server:
   ```
   npm run dev
   ```

   This will start both the backend server and the frontend development server.

6. Open your browser and navigate to `http://localhost:8080` to view the application.

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

- Implement automatic project and task mapping
- Aggregate and display same-day entries with identical project and task; transfer as single entry to Moco
- Improve error handling and user feedback
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
