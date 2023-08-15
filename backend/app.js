const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

const users = [
  {
    id: 0,
    username: 'test_user',
    pubKey: (BigInt(15732772019) * BigInt(10270832711)).toString(),
  },
]

const messages = [
  { id: 0, recipientId: 0, ciphertext: ['838CD292'] },
]

app.use(cors())

morgan.token('req-body', (req) => {
  return JSON.stringify(req.body)
})
app.use(
  morgan(
    ':method :url :status :req[content-length] - :response-time ms :req-body'
  )
)

app.use(express.static('build'))

app.get('/health', (req, res) => {
  res.send('ok')
})

app.get('/users', (req, res) => {
  res.json(users)
})

app.post('/users', (req, res) => {
  const body = req.body

  const newUser = {
    id: users.length,
    username: body.username,
    pubKey: body.pubKey,
  }

  users.push(newUser)

  res.json(newUser)
})

app.get('/messages', (req, res) => {
  res.json(messages)
})

module.exports = app
9
