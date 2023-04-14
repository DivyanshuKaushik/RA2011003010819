const axios = require('axios');

require('dotenv').config();

const API = axios.create({
    baseURL: process.env.API_URI,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.API_KEY,
    }
});

module.exports = API;