const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

const User = require('./models/user')
const Message = require('./models/message')
const mongoose = require('mongoose')
// const url = process.env.MONGODB_URI // eslint-disable-line no-undef
const config = require('./utils/config')
const url = config.MONGODB_URI

console.log(`connecting to ${url}`)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log(`error connecting to MongoDB: ${error.message}`)
  })

// const users = [
//   {
//     id: 0,
//     username: 'test_user',
//     pubKey: (BigInt(15732772019) * BigInt(10270832711)).toString(),
//   },
// ]

// new User({
//   username: 'test_user',
//   pubKey: (BigInt(15732772019) * BigInt(10270832711)).toString()
// }).save()

// const messages = [{ id: 0, recipientId: 0, ciphertext: ['838CD292'] }]

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

app.get('/users', (req, res) => {
  // res.json(users)
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

  // users.push(newUser)
  user.save().then(savedUser => {
    res.json(savedUser)
  })

  // res.json(newUser)
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
