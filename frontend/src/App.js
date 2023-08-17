import { useState, useEffect } from 'react'
import axios from 'axios'

import { createPrivateKey, decrypt, encrypt } from './utils/crypto'
import {
  isAscii,
  strToBase95,
  parseWordFromBase95,
  wordToBase95,
  privKeyToHexStr,
  hexStrToPrivKey,
} from './utils/string'

const UserCreateForm = ({ handleSubmit, username, handleUsername }) => {
  return (
    <form onSubmit={handleSubmit}>
      <h2>Create user</h2>
      <div>
        username: <input id='username-input' value={username} onChange={handleUsername} />
        <button id='create-user-button' type="submit">Create</button>
      </div>
    </form>
  )
}

const PrivKeyDisplay = ({ visible, privKey, clickHide }) => {
  return (
    <div>
      {visible && (
        <div>
          Copy and save your private key:{' '}
          <span id='privKeyOutput' style={{ fontFamily: 'monospace' }}>
            {privKeyToHexStr(privKey)}
          </span>
          <button onClick={clickHide}>Hide</button>
        </div>
      )}
    </div>
  )
}

const MessageForm = ({
  handleEncrypt,
  users,
  recipient,
  handleRecipient,
  newMessage,
  handleMessage,
  enabled,
}) => {
  return (
    <form onSubmit={handleEncrypt}>
      <h2>Send message</h2>
      <div>
        Recipient:
        <select value={recipient} onChange={handleRecipient}>
          {users.map((u) => (
            <option key={u.id}>{u.username}</option>
          ))}
        </select>
        Message: <input value={newMessage} onChange={handleMessage} />
        <button type="submit" disabled={!enabled}>
          Send
        </button>
      </div>
    </form>
  )
}

const MessageList = ({ users, messages }) => {
  if (!users.length && !messages.length) return null

  const [privKey, setPrivKey] = useState('')
  const [decrypted, setDecrypted] = useState('')
  const [decryptedVisible, setDecryptedVisible] = useState(false)

  const handleDecrypt = (cipher) => () => {
    const [p, q] = hexStrToPrivKey(privKey)
    const plaintext = cipher
      .map((c) => wordToBase95(c))
      .map((c) => decrypt(c, p, q))
      .map((p) => parseWordFromBase95(p))
      .join('')
    setDecrypted(plaintext)
    setDecryptedVisible(true)
  }

  const Decrypted = ({ visible, message }) => {
    if (!visible) return null
    else
      return (
        <div>
          Your message is:{' '}
          <span style={{ fontFamily: 'monospace' }}>{message}</span>
          <button
            onClick={() => {
              setDecrypted('')
              setDecryptedVisible(false)
            }}
          >
            Hide
          </button>
        </div>
      )
  }

  return (
    <div>
      <h2>Messages</h2>
      <div>
        Enter private key to decrypt:
        <input value={privKey} onChange={(e) => setPrivKey(e.target.value)}></input>
      </div>
      <Decrypted visible={decryptedVisible} message={decrypted} />
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
              <td>{users.find((u) => u.id === m.recipientId).username}</td>
              <td style={{ fontFamily: 'monospace' }}>
                {m.ciphertext.join(' ')}
              </td>
              <td>
                <button onClick={handleDecrypt(m.ciphertext)}>Read</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const baseURL = 'http://localhost:3001'
  // const baseURL = ''

  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [newUsername, setNewUsername] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [newPrivKey, setNewPrivKey] = useState([0, 0])
  const [privKeyvisible, setPrivKeyvisible] = useState(false)

  const [newRecipient, setNewRecipient] = useState()
  const [encryptEnabled, setEncryptEnabled] = useState(true)

  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`${baseURL}/users`).then((res) => {
      setUsers(res.data)
      if (res.data.length > 0) {
        setNewRecipient(res.data[0].username)
      }
    })
  }, [])

  useEffect(() => {
    axios.get(`${baseURL}/messages`).then((res) => {
      setMessages(res.data)
    })
  }, [])

  const handleUsername = (event) => {
    setNewUsername(event.target.value)
  }

  const createUser = (event) => {
    event.preventDefault()
    const [p, q] = createPrivateKey()

    const newUser = {
      username: newUsername,
      pubKey: (p * q).toString(),
    }

    axios.post(`${baseURL}/users`, newUser).then((res) => {
      setUsers(users.concat(res.data))
    })

    // setUsers(
    //   users.concat({
    //     id: users.length + 1,
    //     username: newUsername,
    //     pubKey: p * q,
    //   })
    // )
    setNewUsername('')
    setNewPrivKey([p, q])
    setPrivKeyvisible(true)
  }

  const hidePriveKey = (event) => {
    event.preventDefault()
    setNewPrivKey('')
    setPrivKeyvisible(false)
  }

  const handleRecipient = (event) => {
    event.preventDefault()
    setNewRecipient(event.target.value)
  }

  const handleMessage = (event) => {
    event.preventDefault()
    setNewMessage(event.target.value)
    if (!isAscii(event.target.value)) {
      setError('only ASCII allowed')
      setEncryptEnabled(false)
    } else {
      setError('')
      setEncryptEnabled(true)
    }
  }

  const handleEncrypt = (event) => {
    event.preventDefault()

    const plainblocks = strToBase95(newMessage)
    const rec = users.find((u) => u.username === newRecipient)
    const key = rec.pubKey

    const cipherblocks = plainblocks.map((m) => encrypt(m, key))

    const messageToSend = {
      recipientId: rec.id,
      ciphertext: cipherblocks.map((c) => parseWordFromBase95(c)),
    }

    axios.post(`${baseURL}/messages`, messageToSend).then((res) => {
      setMessages(messages.concat(res.data))
    })

    // setMessages(
    //   messages.concat({
    //     id: messages.length + 1,
    //     recipientId: rec.id,
    //     ciphertext: cipherblocks.map((c) => parseWordFromBase95(c)),
    //   })
    // )

    setNewMessage('')
  }

  return (
    <div>
      <h1>RSA Messaging App</h1>
      <UserCreateForm
        handleSubmit={createUser}
        username={newUsername}
        handleUsername={handleUsername}
      />
      <PrivKeyDisplay
        visible={privKeyvisible}
        privKey={newPrivKey}
        clickHide={hidePriveKey}
      />
      {/* <div>
        Copy and save your private key: {newPrivKey}
        <button onClick={() => setNewPrivKey('')}>Hide</button>
      </div> */}
      <MessageForm
        users={users}
        recipient={newRecipient}
        newMessage={newMessage}
        handleRecipient={handleRecipient}
        handleMessage={handleMessage}
        enabled={encryptEnabled}
        handleEncrypt={handleEncrypt}
      />
      <div style={{ color: 'red' }}>{error}</div>
      <MessageList users={users} messages={messages} />
    </div>
  )
}

export default App
