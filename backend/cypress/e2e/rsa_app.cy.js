describe('RSA app', function() {
  beforeEach(function () {
    cy.visit('http://localhost:3001')
  })

  it('front page can be opened', function() {
    cy.contains('RSA Messaging App')
    cy.contains('Create user')
  })

  // it('user can be created', function () {
  //   cy.get('#username-input').type('cy_user')
  //   cy.get('#create-user-button').click()
  // })

  // it('private key is displayed and can be hidden', function () {
  //   cy.get('#username-input').type('cy_user3')
  //   cy.get('#create-user-button').click()
  //   cy.contains('Copy and save')
  //   cy.contains('Hide').click()
  // })

  // it('message can be sent', function () {
  //   cy.contains('test_user')
  //   cy.contains('cy_user').click()
  //   // complete this
  // })
})