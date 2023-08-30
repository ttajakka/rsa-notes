const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')

const User = require('./mongo/models/user')
const Message = require('./mongo/models/message')
const config = require('./utils/config')
const mongo_url = config.MONGO_URL

console.log(`connecting to MongoDB: ${mongo_url}`)
mongoose.connect(mongo_url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log(`error connecting to MongoDB: ${error.message}`)
  })

app.use(cors())
app.use(express.json())

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'test') {
  morgan.token('req-body', (req) => {
    return JSON.stringify(req.body)
  })
  app.use(
    morgan(
      ':method :url :status :req[content-length] - :response-time ms :req-body'
    )
  )
}

app.use(express.static('build'))

app.get('/health', (req, res) => {
  res.send('ok')
})

app.get('/hello', (req, res) => {
  res.send('hello!')
})

app.get('/users', (req, res) => {
  User.find({}).then((users) => {
    res.json(users)
  })
})

app.post('/users', (req, res) => {
  const body = req.body

  const user = new User({
    username: body.username,
    pubKey: body.pubKey,
  })

  user.save().then(savedUser => {
    res.json(savedUser)
  })
})

app.get('/messages', (req, res) => {
  Message.find({}).then((messages) => {
    res.json(messages)
  })
})

app.post('/messages', (req, res) => {
  const body = req.body

  const message = new Message({
    recipientId: body.recipientId,
    ciphertext: body.ciphertext,
  })

  message.save().then(savedMessage => {
    res.json(savedMessage)
  })
})

module.exports = app
