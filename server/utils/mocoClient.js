const axios = require('axios');
const logger = require('./logger');
require('dotenv').config();

const mocoClient = axios.create({
  baseURL: `https://${process.env.MOCO_DOMAIN}.mocoapp.com/api/v1`,
  headers: {
    'Authorization': `Token token=${process.env.MOCO_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for logging
mocoClient.interceptors.response.use(
  response => response,
  error => {
    logger.error('Moco API Error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

module.exports = mocoClient;
