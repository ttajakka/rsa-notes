require('dotenv').config()

/* eslint-disable no-undef */
const PORT = process.env.PORT || 3001
const MONGO_URL = process.env.MONGO_URL

module.exports = {
  PORT, MONGO_URL
}