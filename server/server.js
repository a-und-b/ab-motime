const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Import routes
const apiRoutes = require('./routes/api');

// Use routes
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
