// cypress/e2e/auth.cy.ts

describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should allow a valid user to log in and reach the chat page', () => {
    const userEmail = Cypress.env('TEST_USER1_EMAIL');
    const userPassword = Cypress.env('TEST_USER1_PASSWORD');

    if (!userEmail || !userPassword) {
      throw new Error('Test credentials not set in Cypress environment variables (e.g., cypress.env.json)');
    }

    cy.login(userEmail, userPassword);
  });

  it('should display an error message for invalid credentials', () => {
    const userEmail = Cypress.env('TEST_USER1_EMAIL'); // Use correct email but wrong password

    if (!userEmail) {
      throw new Error('Test user email not set in Cypress environment variables');
    }

    cy.get('input#email').type(userEmail);
    cy.get('input#password').type('wrong-password-123');
    cy.get('button[type="submit"]').contains(/login/i).click();

    cy.url().should('not.include', '/chat');
    cy.url().should('include', '/login'); // Or check it didn't change from base

    cy.contains(/invalid login credentials/i).should('be.visible');
  });
});