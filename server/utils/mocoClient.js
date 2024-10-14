const axios = require('axios');
require('dotenv').config();

const mocoClient = axios.create({
  baseURL: `https://${process.env.MOCO_DOMAIN}.mocoapp.com/api/v1`,
  headers: {
    'Authorization': `Token token=${process.env.MOCO_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

module.exports = mocoClient;
