/**
 * TC-001: Login Administrador Exitoso
 * Verificar que el administrador puede acceder al sistema con credenciales válidas
 */

import LoginPage from '../support/page-objects/LoginPage.js';

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
        const hasAdminElements = bodyText.includes('admin') || 
                                 bodyText.includes('dashboard') || 
                                 bodyText.includes('bienvenido');
        expect(hasAdminElements, 'Should show admin dashboard elements').to.be.true;
      });
      
      cy.takeScreenshot('login-exitoso-admin');
    });
    

  });
  

  

  

  
  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
}); 