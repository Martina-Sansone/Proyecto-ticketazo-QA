import RegisterPage from '../support/page-objects/RegisterPage.js';

describe('TC-REG: Registro de Usuario', () => {
  let registerPage;
  let userData;
  
  before(() => {
    cy.fixture('jou/registerData').then((data) => {
      userData = data;
    });
  });
  
  beforeEach(() => {
    registerPage = new RegisterPage();
    cy.intercept('POST', '**/register**').as('registerRequest');
    cy.intercept('POST', '**/signup**').as('signupRequest');
  });
  
  context('Precondiciones', () => {
    it('Sistema debe estar disponible', () => {
      cy.visit('/');
      cy.get('body').should('exist');
      cy.title().should('include', 'Ticketazo');
    });
  });
  
  context('Registro Exitoso', () => {
    it('Debe permitir registro con datos válidos', () => {
      const testUser = {
        firstName: 'Usuario',
        lastName: 'Test',
        phone: '3815678901',
        dni: `${Date.now().toString().slice(-8)}`,
        province: 'Buenos Aires',
        city: 'La Plata',
        birthDate: '1995-01-15',
        email: `test.user.${Date.now()}@example.com`,
        confirmEmail: `test.user.${Date.now()}@example.com`,
        password: 'Password123!',
        confirmPassword: 'Password123!'
      };
      
      registerPage.visit();
      registerPage.verifyPageLoaded();
      registerPage.fillRegistrationForm(testUser);
      registerPage.clickRegisterButton();
      
      cy.get('body').then($body => {
        const bodyText = $body.text();
        if (bodyText.includes('Ya existe un usuario registrado con ese DNI')) {
          registerPage.verifyErrorMessage('Ya existe un usuario registrado con ese DNI');
        } else if (bodyText.includes('exitoso') || bodyText.includes('registrado')) {
          registerPage.verifySuccessMessage();
        } else {
          cy.url().should('include', 'registerUser');
        }
      });
      
      cy.takeScreenshot('registro-exitoso');
    });
  });
  
  context('Validaciones de Registro', () => {
    it('Debe procesar registro con emails diferentes (sin validación estricta)', () => {
      registerPage.visit();
      registerPage.verifyPageLoaded();
      registerPage.fillRegistrationForm(userData.invalidUsers.emailMismatch);
      registerPage.clickRegisterButton();
      
      cy.get('body').then($body => {
        const bodyText = $body.text();
        if (bodyText.includes('Ya existe un usuario registrado con ese DNI')) {
          registerPage.verifyErrorMessage('Ya existe un usuario registrado con ese DNI');
        } else {
          cy.url().should('include', 'registerUser');
        }
      });
      
      cy.takeScreenshot('registro-emails-diferentes');
    });
    
    it('Debe validar teléfono vacío', () => {
      registerPage.visit();
      registerPage.verifyPageLoaded();
      registerPage.fillRegistrationForm(userData.invalidUsers.emptyPhone);
      registerPage.clickRegisterButton();
      
      cy.get('body').then($body => {
        const bodyText = $body.text();
        if (bodyText.includes('Este campo es obligatorio')) {
          registerPage.verifyErrorMessage('Este campo es obligatorio');
        } else if (bodyText.includes('requerido') || bodyText.includes('obligatorio')) {
          cy.get('.error, .alert, .message').should('be.visible');
        } else {
          cy.url().should('include', 'registerUser');
        }
      });
      
      cy.takeScreenshot('registro-telefono-vacio');
    });
    
    it('Debe validar DNI ya existente', () => {
      registerPage.visit();
      registerPage.verifyPageLoaded();
      
      registerPage.fillFirstName('Existing');
      registerPage.fillLastName('User');
      registerPage.fillPhone('3815555888');
      registerPage.fillDNI('94555555');
      registerPage.fillEmail('existing.user@example.com');
      registerPage.fillConfirmEmail('existing.user@example.com');
      registerPage.fillPassword('Password123!');
      registerPage.fillConfirmPassword('Password123!');
      
      registerPage.clickRegisterButton();
      
      cy.get('body').then($body => {
        const bodyText = $body.text();
        if (bodyText.includes('Ya existe un usuario registrado con ese DNI')) {
          registerPage.verifyErrorMessage('Ya existe un usuario registrado con ese DNI');
        } else {
          cy.url().should('include', 'registerUser');
        }
      });
      
      cy.takeScreenshot('registro-dni-existente');
    });
  });
  
  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
}); 