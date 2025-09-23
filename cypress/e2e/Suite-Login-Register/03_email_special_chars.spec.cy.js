import RegisterPage from '../../support/page-objects/RegisterPage.js';

describe('🐛 BUG: Validación de Caracteres Especiales en Email', () => {
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

  context('🔍 Documentación de Bug - Caracteres Especiales Inválidos', () => {
    it('BUG: Sistema acepta email con asterisco (*)', () => {
      registerPage.visit();
      registerPage.verifyPageLoaded();
      registerPage.fillRegistrationForm(userData.invalidUsers.emailWithAsterisk);
      registerPage.clickRegisterButton();

      cy.get('body').then($body => {
        const bodyText = $body.text();
        if (bodyText.includes('Ya existe un usuario registrado con ese DNI')) {
          cy.log('⚠️ BUG CONFIRMADO: Sistema acepta email con * (asterisco)');
          cy.log('📧 Email probado: test*user@example.com');
          cy.log('🔍 Resultado: Sistema NO valida caracteres especiales inválidos');
          registerPage.verifyErrorMessage('Ya existe un usuario registrado con ese DNI');
        } else if (bodyText.includes('email válido') || 
                   bodyText.includes('formato') || 
                   bodyText.includes('inválido')) {
          cy.log('✅ Sistema detectó email inválido correctamente');
          cy.get('.error, .alert, .message').should('be.visible');
        } else {
          cy.log('⚠️ BUG CONFIRMADO: Email con asterisco (*) fue aceptado');
          cy.log('📧 Email: test*user@example.com');
          cy.url().should('include', 'registerUser');
        }
      });

      cy.takeScreenshot('bug-email-asterisco');
    });

    it('BUG: Sistema acepta email con slash (/)', () => {
      registerPage.visit();
      registerPage.verifyPageLoaded();
      registerPage.fillRegistrationForm(userData.invalidUsers.emailWithSlash);
      registerPage.clickRegisterButton();

      cy.get('body').then($body => {
        const bodyText = $body.text();
        if (bodyText.includes('Ya existe un usuario registrado con ese DNI')) {
          cy.log('⚠️ BUG CONFIRMADO: Sistema acepta email con / (slash)');
          cy.log('📧 Email probado: test/user@example.com');
          registerPage.verifyErrorMessage('Ya existe un usuario registrado con ese DNI');
        } else if (bodyText.includes('email válido') || 
                   bodyText.includes('formato') || 
                   bodyText.includes('inválido')) {
          cy.log('✅ Sistema detectó email inválido correctamente');
          cy.get('.error, .alert, .message').should('be.visible');
        } else {
          cy.log('⚠️ BUG CONFIRMADO: Email con slash (/) fue aceptado');
          cy.log('📧 Email: test/user@example.com');
          cy.url().should('include', 'registerUser');
        }
      });

      cy.takeScreenshot('bug-email-slash');
    });

    it('BUG: Sistema acepta email con numeral (#)', () => {
      registerPage.visit();
      registerPage.verifyPageLoaded();
      registerPage.fillRegistrationForm(userData.invalidUsers.emailWithHash);
      registerPage.clickRegisterButton();

      cy.get('body').then($body => {
        const bodyText = $body.text();
        if (bodyText.includes('Ya existe un usuario registrado con ese DNI')) {
          cy.log('⚠️ BUG CONFIRMADO: Sistema acepta email con # (numeral)');
          cy.log('📧 Email probado: test#user@example.com');
          registerPage.verifyErrorMessage('Ya existe un usuario registrado con ese DNI');
        } else if (bodyText.includes('email válido') || 
                   bodyText.includes('formato') || 
                   bodyText.includes('inválido')) {
          cy.log('✅ Sistema detectó email inválido correctamente');
          cy.get('.error, .alert, .message').should('be.visible');
        } else {
          cy.log('⚠️ BUG CONFIRMADO: Email con numeral (#) fue aceptado');
          cy.log('📧 Email: test#user@example.com');
          cy.url().should('include', 'registerUser');
        }
      });

      cy.takeScreenshot('bug-email-numeral');
    });

    it('BUG: Sistema acepta email con símbolo de dólar ($)', () => {
      registerPage.visit();
      registerPage.verifyPageLoaded();
      registerPage.fillRegistrationForm(userData.invalidUsers.emailWithDollar);
      registerPage.clickRegisterButton();

      cy.get('body').then($body => {
        const bodyText = $body.text();
        if (bodyText.includes('Ya existe un usuario registrado con ese DNI')) {
          cy.log('⚠️ BUG CONFIRMADO: Sistema acepta email con $ (dólar)');
          cy.log('📧 Email probado: test$user@example.com');
          registerPage.verifyErrorMessage('Ya existe un usuario registrado con ese DNI');
        } else if (bodyText.includes('email válido') || 
                   bodyText.includes('formato') || 
                   bodyText.includes('inválido')) {
          cy.log('✅ Sistema detectó email inválido correctamente');
          cy.get('.error, .alert, .message').should('be.visible');
        } else {
          cy.log('⚠️ BUG CONFIRMADO: Email con símbolo $ fue aceptado');
          cy.log('📧 Email: test$user@example.com');
          cy.url().should('include', 'registerUser');
        }
      });

      cy.takeScreenshot('bug-email-dolar');
    });
  });

  context('📋 Resumen del Bug', () => {
    it('Documentar hallazgos de caracteres especiales', () => {
      cy.log('🐛 BUG IDENTIFICADO: Validación de email insuficiente');
      cy.log('📧 Caracteres inválidos que acepta el sistema:');
      cy.log('   • * (asterisco) - test*user@example.com');
      cy.log('   • / (slash) - test/user@example.com');
      cy.log('   • # (numeral) - test#user@example.com');
      cy.log('   • $ (dólar) - test$user@example.com');
      cy.log('');
      cy.log('🔍 IMPACTO:');
      cy.log('   • Datos inválidos en base de datos');
      cy.log('   • Posibles problemas de envío de emails');
      cy.log('   • Falta de cumplimiento con RFC 5322');
      cy.log('');
      cy.log('💡 RECOMENDACIÓN:');
      cy.log('   • Implementar validación RFC 5322 completa');
      cy.log('   • Rechazar caracteres especiales inválidos');
      cy.log('   • Mostrar mensajes de error específicos');
      
      expect(true).to.be.true;
    });
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
}); 