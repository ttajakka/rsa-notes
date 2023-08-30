/* eslint-disable no-undef */
db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'rsa_db',
    },
  ],
})

db.createCollection('users')
db.createCollection('messages')
