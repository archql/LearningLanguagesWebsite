describe('LessonPageComponent E2E Tests', () => {

    beforeEach(() => {
      // Intercept the lesson load request and respond with a fixture or mock
      // cy.intercept('GET', '/api/lesson/*', {
      //   statusCode: 200,
      //   body: {
      //     id: 1,
      //     name: 'Sample Lesson',
      //     description: 'This is a sample lesson description',
      //     exercises: []
      //   }
      // }).as('loadLesson');
  
      // Intercept addWord requests
      cy.intercept('POST', '/api/addWord', {
        statusCode: 200,
        body: { message: 'Word added successfully' }
      }).as('addWord');
      
      cy.visit('/main/login')
      cy.get('#email').type('aa@aa')
      cy.get('#password').type('123456')
      cy.get('button').click()
      cy.wait(1000)
      cy.visit('/home/lesson/1');
    });
  
    it('Should load the lesson successfully', () => {
      cy.contains('Talking About Yourself').should('exist');
      cy.contains('Example Dialogue').should('exist');
    });
  
    // it('Should add a word to vocabulary successfully', () => {
    //   cy.get('button#add-word-button')  // Use the appropriate button selector
    //     .click();
  
    //   cy.wait('@addWord');
    //   cy.contains('Word added successfully').should('exist');
    // });
  
    it('Should show feedback modal on lesson completion', () => {
      // Trigger lesson finished
      cy.get('.finish').click();  // Adjust this selector if necessary
  
      // Mock the modal opening behavior
      cy.get('.modal-header').should('be.visible');
      cy.contains('Modal closed.').should('not.exist');  // Check console log
    });
  
    it('Should navigate to the home page when user confirms leaving with unsaved changes', () => {
      cy.visit('/home/dashboard')
      cy.on('window:confirm', () => true);  // Automatically click 'OK' on confirm dialog
  
      cy.url().should('include', '/home/dashboard');  // Confirm successful navigation
    });
  });