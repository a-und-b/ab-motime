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

- Implementation of a database for persistent data storage
- Improvement of user authentication and management
- Automatic mapping of projects and tasks between Timing and Moco
- Implementation of error handling and user notifications
- Performance optimization for larger datasets
- Implementation of unit and integration tests

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
