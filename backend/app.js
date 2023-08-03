const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

app.use(cors())

morgan.token('req-body', (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :req-body'))

app.use(express.static('build'))

app.get('/health', (req, res) => {
  res.send('ok')
})

module.exports = app