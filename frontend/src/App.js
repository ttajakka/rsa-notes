import { useState } from 'react'

import { createPrivateKey } from './crypto'

const UserCreateForm = ({ handleSubmit, username, handleUsername }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={username} onChange={handleUsername} />
      </div>
      <div>
        <button type="submit">Create user</button>
      </div>
    </form>
  )
}

const App = () => {
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
      RSA Messaging App
      <UserCreateForm
        handleSubmit={createUser}
        username={username}
        handleUsername={handleUsername}
      />
    </div>
  )
}

export default App
