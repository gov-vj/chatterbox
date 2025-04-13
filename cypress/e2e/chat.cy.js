describe('Chat Functionality', () => {
    beforeEach(() => {
        const userEmail = Cypress.env('TEST_USER1_EMAIL');
        const userPassword = Cypress.env('TEST_USER1_PASSWORD');
        if (!userEmail || !userPassword) {
            throw new Error('Test credentials not set in Cypress env vars');
        }
        cy.login(userEmail, userPassword);
        cy.visit('/chat');
        cy.get('input[placeholder="Type a message..."]').should('be.visible');
    });

    it('should allow user to send a message and see it in the list', () => {
        const messageText = `Test message sent at ${new Date().toLocaleTimeString()}`;

        cy.get('input[placeholder="Type a message..."]')
            .should('be.visible')
            .type(messageText)
            .should('have.value', messageText);

        cy.get('button[type="submit"]')
            .contains(/send/i)
            .should('be.visible')
            .and('not.be.disabled')
            .click();

        cy.get('input[placeholder="Type a message..."]').should('have.value', '');
        cy.wait(5000);
        cy.get('[data-testid="message-list-container"] [data-testid="message-item"]', { timeout: 10000 })
            .last()
            .find('[data-testid="message-bubble"]')
            .should('contain.text', messageText);

        cy.get('[data-testid="message-list-container"] [data-testid="message-item"]')
            .last()
            .should('have.class', 'justify-end');
    });
});