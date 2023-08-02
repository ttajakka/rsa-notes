require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(cors())

morgan.token('req-body', (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :req-body'))

app.use(express.static('build'))

app.get('/health', (req, res) => {
  res.send('ok')
})

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
