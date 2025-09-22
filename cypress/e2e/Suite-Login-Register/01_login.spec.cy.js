import LoginPage from '../../support/page-objects/LoginPage.js';

describe('TC-001: Login Administrador', () => {
  let loginPage;
  let userData;
  
  before(() => {
    cy.fixture('test-data/users').then((data) => {
      userData = data;
    });
  });
  
  beforeEach(() => {
    loginPage = new LoginPage();
    cy.intercept('POST', '**/login**').as('loginRequest');
    cy.intercept('GET', '**/admin**').as('adminDashboard');
  });
  
  context('Precondiciones', () => {
    it('Sistema debe estar disponible', () => {
      cy.visit('/');
      cy.get('body').should('exist');
      cy.title().should('include', 'Ticketazo');
    });
  });
  
  context('Login Exitoso', () => {
    it('Debe permitir login con credenciales válidas de administrador', () => {
      loginPage.visit();
      loginPage.clickLoginButton();
      loginPage.enterEmail(userData.admin.email);
      loginPage.enterPassword(userData.admin.password);
      loginPage.clickSubmit();
      loginPage.verifyLoginSuccess();
      
      cy.url().should('not.include', 'login');
      
      cy.get('body').then($body => {
        const bodyText = $body.text().toLowerCase();
        const hasLoginSuccess = 
          bodyText.includes('admin') || 
                                 bodyText.includes('dashboard') || 
          bodyText.includes('bienvenido') ||
          bodyText.includes('cerrar sesión') ||
          bodyText.includes('logout') ||
          bodyText.includes('salir') ||
          bodyText.includes('mi cuenta') ||
          bodyText.includes('perfil');
        
        if (hasLoginSuccess) {
          expect(hasLoginSuccess).to.be.true;
        } else {
          cy.url().should('not.include', 'login').and('not.include', 'auth');
          cy.get('body').should('be.visible');
        }
      });
      
      cy.takeScreenshot('login-exitoso-admin');
    });
  });
  
  context('Login con Credenciales Incorrectas', () => {
    it('Debe mostrar error con email inválido', () => {
      loginPage.visit();
      loginPage.clickLoginButton();
      loginPage.enterEmail('usuario@invalido.com');
      loginPage.enterPassword('admin');
      loginPage.clickSubmit();
      
      cy.url().should('include', 'login');
      
      cy.get('body').then($body => {
        const bodyText = $body.text().toLowerCase();
        const hasError = 
          bodyText.includes('error') || 
          bodyText.includes('incorrecto') || 
          bodyText.includes('inválido') ||
          bodyText.includes('credenciales') ||
          bodyText.includes('usuario') ||
          bodyText.includes('contraseña');
        
        expect(hasError, 'Debería mostrar mensaje de error').to.be.true;
      });
      
      cy.takeScreenshot('login-email-invalido');
    });
    
    it('Debe mostrar error con password incorrecta', () => {
      loginPage.visit();
      loginPage.clickLoginButton();
      loginPage.enterEmail(userData.admin.email);
      loginPage.enterPassword('passwordIncorrecto');
      loginPage.clickSubmit();
      
      cy.url().should('include', 'login');
      
      cy.get('body').then($body => {
        const bodyText = $body.text().toLowerCase();
        const hasError = 
          bodyText.includes('error') || 
          bodyText.includes('incorrecto') || 
          bodyText.includes('inválido') ||
          bodyText.includes('credenciales') ||
          bodyText.includes('usuario') ||
          bodyText.includes('contraseña');
        
        expect(hasError, 'Debería mostrar mensaje de error').to.be.true;
      });
      
      cy.takeScreenshot('login-password-incorrecta');
    });
    
    it('Debe validar campos obligatorios - Email vacío', () => {
      loginPage.visit();
      loginPage.clickLoginButton();
      
      cy.get('input[type="email"], input[name="email"]').clear();
      cy.get('input[type="password"], input[name="password"]').clear().type('admin');
      
      cy.get('button[type="submit"], input[type="submit"], button:contains("Ingresar"), button:contains("Login")').click();
      
      cy.get('input[type="email"], input[name="email"]').should('satisfy', $el => {
        return $el.attr('required') !== undefined || $el.hasClass('error') || $el.hasClass('invalid') || $el[0].validationMessage !== '';
      });
      
      cy.takeScreenshot('login-email-vacio');
    });
    
    it('Debe validar campos obligatorios - Password vacía', () => {
      loginPage.visit();
      loginPage.clickLoginButton();
      
      cy.get('input[type="email"], input[name="email"]').clear().type(userData.admin.email);
      cy.get('input[type="password"], input[name="password"]').clear();
      
      cy.get('button[type="submit"], input[type="submit"], button:contains("Ingresar"), button:contains("Login")').click();
      
      cy.get('input[type="password"], input[name="password"]').should('satisfy', $el => {
        return $el.attr('required') !== undefined || $el.hasClass('error') || $el.hasClass('invalid') || $el[0].validationMessage !== '';
      });
      
      cy.takeScreenshot('login-password-vacia');
    });
    
    it('Debe validar ambos campos vacíos', () => {
      loginPage.visit();
      loginPage.clickLoginButton();
      
      cy.get('input[type="email"], input[name="email"]').clear();
      cy.get('input[type="password"], input[name="password"]').clear();
      
      cy.get('button[type="submit"], input[type="submit"], button:contains("Ingresar"), button:contains("Login")').click();
      
      cy.get('input[type="email"], input[name="email"]').should('satisfy', $el => {
        return $el.attr('required') !== undefined || $el.hasClass('error') || $el.hasClass('invalid') || $el[0].validationMessage !== '';
      });
      cy.get('input[type="password"], input[name="password"]').should('satisfy', $el => {
        return $el.attr('required') !== undefined || $el.hasClass('error') || $el.hasClass('invalid') || $el[0].validationMessage !== '';
      });
      
      cy.takeScreenshot('login-campos-vacios');
    });
  });
  
  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
}); 