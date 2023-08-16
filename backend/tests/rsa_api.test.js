const superstest = require('supertest')
const app = require('../app')

const api = superstest(app)

describe('testing users endpoint:', () => {
  test('users are returned as json', async () => {
    await api
      .get('/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there is one user', async () => {
    const response = await api.get('/users')

    expect(response.body).toHaveLength(1)
  })

  test('the only user is test_user', async () => {
    const response = await api.get('/users')

    expect(response.body[0].username).toBe('test_user')
  })

  test('user can be added', async () => {
    const response = await api.post('/users').send({
      username: 'test_user2',
      pubKey: 'ABCDEF',
    })

    expect(response.body.id).toBe(1)
    expect(response.body.username).toBe('test_user2')
    expect(response.body.pubKey).toBe('ABCDEF')
  })
})

describe('testing messages endpoint:', () => {
  test('messages are returned as json', async () => {
    await api
      .get('/messages')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('initially there is one message', async () => {
    const response = await api.get('/messages')

    expect(response.body).toHaveLength(1)
  })

  test('a message can be added', async () => {
    const response = await api.post('/messages').send({ recipientId: 0, ciphertext: 'abcdefg'})

    expect(response.body.id).toBe(1)
    expect(response.body.recipientId).toBe(0)
    expect(response.body.ciphertext).toBe('abcdefg')
  })
})