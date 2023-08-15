/* global BigInt */

import { useState } from 'react'

import { createPrivateKey, decrypt, encrypt } from './utils/crypto'
import {
  isAscii,
  strToBase95,
  parseWordFromBase95,
  wordToBase95,
} from './utils/string'

const UserCreateForm = ({ handleSubmit, username, handleUsername }) => {
  return (
    <form onSubmit={handleSubmit}>
      <h2>Create user</h2>
      <div>
        name: <input value={username} onChange={handleUsername} />
        <button type="submit">Create</button>
      </div>
    </form>
  )
}

const PrivKeyDisplay = ({ visible, privKey, clickHide }) => {
  return (
    <div>
      {visible && (
        <div>
          Copy and save your private key: {privKey[0].toString()},{' '}
          {privKey[1].toString()}
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
          Encrypt
        </button>
      </div>
    </form>
  )
}

const MessageList = ({ users, messages }) => {
  const [privKeyP, setP] = useState('')
  const [privKeyQ, setQ] = useState('')
  const [decrypted, setDecrypted] = useState('')
  const [decryptedVisible, setDecryptedVisible] = useState(false)

  const handleDecrypt = (cipher) => () => {
    const plaintext = cipher
      .map((c) => wordToBase95(c))
      .map((c) => decrypt(c, privKeyP, privKeyQ)) // crypto.decrypt converts p and q to BigInts
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
            hide
          </button>
        </div>
      )
  }

  return (
    <div>
      <h2>Messages</h2>
      <div>
        Enter private key to decrypt:
        <input value={privKeyP} onChange={(e) => setP(e.target.value)}></input>
        <input value={privKeyQ} onChange={(e) => setQ(e.target.value)}></input>
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
                <button onClick={handleDecrypt(m.ciphertext)}>decrypt</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const initialUsers = [
    {
      id: 1,
      username: 'ukkis',
      privKey: [BigInt(15732772019), BigInt(10270832711)],
      pubKey: BigInt(15732772019) * BigInt(10270832711),
    },
    {
      id: 2,
      username: 'jeesus',
      privKey: [5130180611, 10383561653],
      pubKey: BigInt(5130180611) * BigInt(10383561653),
    },
  ]

  // const initialMessages = [
  //   { id: 1, recipientId: 1, ciphertext: ['838CD292'] },
  //   { id: 2, recipientId: 2, ciphertext: ['9ABC393F'] },
  // ]

  const [users, setUsers] = useState(initialUsers)
  const [messages, setMessages] = useState([])
  const [newUsername, setNewUsername] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [newPrivKey, setNewPrivKey] = useState([0, 0])
  const [privKeyvisible, setPrivKeyvisible] = useState(false)

  const [newRecipient, setNewRecipient] = useState(users[0].username)
  const [encryptEnabled, setEncryptEnabled] = useState(true)

  const [error, setError] = useState('')

  const handleUsername = (event) => {
    setNewUsername(event.target.value)
  }

  const createUser = (event) => {
    event.preventDefault()
    const [p, q] = createPrivateKey()
    setUsers(
      users.concat({
        id: users.length + 1,
        username: newUsername,
        pubKey: p * q,
      })
    )
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

    setMessages(
      messages.concat({
        id: messages.length + 1,
        recipientId: rec.id,
        ciphertext: cipherblocks.map((c) => parseWordFromBase95(c)),
      })
    )

    setNewMessage('')

    // const decrypted = cipherblocks.map((c) =>
    //   decrypt(c, rec.privKey[0], rec.privKey[1])
    // )
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
