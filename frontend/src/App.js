import { useState } from 'react'

import { createPrivateKey } from './crypto'

const UserCreateForm = ({ handleSubmit, username, handleUsername }) => {
  return (
    <form onSubmit={handleSubmit}>
      <h2>Create user</h2>
      <div>
        name: <input value={username} onChange={handleUsername} />
      </div>
      <div>
        <button type="submit">Create</button>
      </div>
    </form>
  )
}

const MessageForm = () => {
  return (
    <form>
      <h2>Send message</h2>
      <div>
        recipient: <input />
        message: <input />
      </div>
    </form>
  )
}

const MessageList = ({ messages }) => {
  return (
    <div>
      <h2>Messages</h2>
      <table>
        <thead>
          <tr>
            <th>recipient</th>
            <th>ciphertext</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((m) => (
            <tr key={m.id}>
              <td>{m.recipient}</td>
              <td>{m.ciphertext}</td>
              <td>
                <button>decrypt</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const messages = [
    { id: '1', recipient: 'Silja', ciphertext: '838CD292' },
    { id: '2', recipient: 'Jesse', ciphertext: '9ABC393F' },
  ]

  const [username, setUsername] = useState('')

  const handleUsername = (event) => {
    setUsername(event.target.value)
  }

  const createUser = (event) => {
    event.preventDefault()
    createPrivateKey()
    console.log('creating new user:', username)
  }

  return (
    <div>
      <h1>RSA Messaging App</h1>
      <UserCreateForm
        handleSubmit={createUser}
        username={username}
        handleUsername={handleUsername}
      />
      <MessageForm />
      <MessageList messages={messages} />
    </div>
  )
}

export default App
