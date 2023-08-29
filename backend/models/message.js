const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  recipientId: String,
  ciphertext: [String]
})

messageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Message', messageSchema)