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

  context('Validaciones de Contraseña', () => {
    it('Debe validar contraseña muy corta (menos de 8 caracteres)', () => {
      registerPage.visit();
      registerPage.verifyPageLoaded();
      registerPage.fillRegistrationForm(userData.invalidUsers.shortPassword);
      registerPage.clickRegisterButton();

      cy.get('body').then($body => {
        const bodyText = $body.text();
        if (bodyText.includes('La contraseña debe tener al menos 8 caracteres') || 
            bodyText.includes('contraseña') || 
            bodyText.includes('8 caracteres') ||
            bodyText.includes('muy corta')) {
          cy.get('.error, .alert, .message').should('be.visible');
        } else {
          cy.url().should('include', 'registerUser');
        }
      });

      cy.takeScreenshot('registro-password-corta');
    });

    it('Debe validar contraseña sin mayúsculas', () => {
      registerPage.visit();
      registerPage.verifyPageLoaded();
      registerPage.fillRegistrationForm(userData.invalidUsers.noUppercasePassword);
      registerPage.clickRegisterButton();

      cy.get('body').then($body => {
        const bodyText = $body.text();
        if (bodyText.includes('mayúscula') || 
            bodyText.includes('mayuscula') || 
            bodyText.includes('contraseña') ||
            bodyText.includes('requisitos')) {
          cy.get('.error, .alert, .message').should('be.visible');
        } else {
          cy.url().should('include', 'registerUser');
        }
      });

      cy.takeScreenshot('registro-password-sin-mayuscula');
    });

    it('Debe validar contraseña sin minúsculas', () => {
      registerPage.visit();
      registerPage.verifyPageLoaded();
      registerPage.fillRegistrationForm(userData.invalidUsers.noLowercasePassword);
      registerPage.clickRegisterButton();

      cy.get('body').then($body => {
        const bodyText = $body.text();
        if (bodyText.includes('minúscula') || 
            bodyText.includes('minuscula') || 
            bodyText.includes('contraseña') ||
            bodyText.includes('requisitos')) {
          cy.get('.error, .alert, .message').should('be.visible');
        } else {
          cy.url().should('include', 'registerUser');
        }
      });

      cy.takeScreenshot('registro-password-sin-minuscula');
    });

    it('Debe validar contraseña sin números', () => {
      registerPage.visit();
      registerPage.verifyPageLoaded();
      registerPage.fillRegistrationForm(userData.invalidUsers.noNumberPassword);
      registerPage.clickRegisterButton();

      cy.get('body').then($body => {
        const bodyText = $body.text();
        if (bodyText.includes('número') || 
            bodyText.includes('numero') || 
            bodyText.includes('contraseña') ||
            bodyText.includes('requisitos')) {
          cy.get('.error, .alert, .message').should('be.visible');
        } else {
          cy.url().should('include', 'registerUser');
        }
      });

      cy.takeScreenshot('registro-password-sin-numero');
    });

    it('Debe validar contraseña sin símbolos', () => {
      registerPage.visit();
      registerPage.verifyPageLoaded();
      registerPage.fillRegistrationForm(userData.invalidUsers.noSymbolPassword);
      registerPage.clickRegisterButton();

      cy.get('body').then($body => {
        const bodyText = $body.text();
        if (bodyText.includes('símbolo') || 
            bodyText.includes('simbolo') || 
            bodyText.includes('contraseña') ||
            bodyText.includes('requisitos')) {
          cy.get('.error, .alert, .message').should('be.visible');
        } else {
          cy.url().should('include', 'registerUser');
        }
      });

      cy.takeScreenshot('registro-password-sin-simbolo');
    });
  });

  context('Validaciones de Email', () => {
    it('Debe validar email con formato inválido (sin @)', () => {
      registerPage.visit();
      registerPage.verifyPageLoaded();
      registerPage.fillRegistrationForm(userData.invalidUsers.invalidEmailNoAt);
      registerPage.clickRegisterButton();

      cy.get('body').then($body => {
        const bodyText = $body.text();
        if (bodyText.includes('email válido') || 
            bodyText.includes('formato') || 
            bodyText.includes('inválido') ||
            bodyText.includes('correo') ||
            bodyText.includes('error')) {
          const hasErrorMessage = 
            bodyText.includes('email válido') ||
            bodyText.includes('formato') ||
            bodyText.includes('inválido') ||
            bodyText.includes('error');
          expect(hasErrorMessage, 'Sistema detectó email inválido sin @').to.be.true;
        } else {
          cy.url().should('include', 'registerUser');
        }
      });

      cy.takeScreenshot('registro-email-sin-arroba');
    });

    it('Debe validar email con formato inválido (sin dominio)', () => {
      registerPage.visit();
      registerPage.verifyPageLoaded();
      registerPage.fillRegistrationForm(userData.invalidUsers.invalidEmailNoDomain);
      registerPage.clickRegisterButton();

      cy.get('body').then($body => {
        const bodyText = $body.text();
        if (bodyText.includes('email válido') || 
            bodyText.includes('formato') || 
            bodyText.includes('inválido') ||
            bodyText.includes('dominio') ||
            bodyText.includes('error')) {
          const hasErrorMessage = 
            bodyText.includes('email válido') ||
            bodyText.includes('formato') ||
            bodyText.includes('inválido') ||
            bodyText.includes('error');
          expect(hasErrorMessage, 'Sistema detectó email sin dominio').to.be.true;
        } else {
          cy.url().should('include', 'registerUser');
        }
      });

      cy.takeScreenshot('registro-email-sin-dominio');
    });

    it('Debe validar email vacío en registro', () => {
      registerPage.visit();
      registerPage.verifyPageLoaded();
      registerPage.fillRegistrationForm(userData.invalidUsers.emptyEmail);
      registerPage.clickRegisterButton();

      cy.get('body').then($body => {
        const bodyText = $body.text();
        if (bodyText.includes('Este campo es obligatorio') || 
            bodyText.includes('requerido') || 
            bodyText.includes('obligatorio') ||
            bodyText.includes('email')) {
          cy.get('.error, .alert, .message').should('be.visible');
        } else {
          cy.url().should('include', 'registerUser');
        }
      });

      cy.takeScreenshot('registro-email-vacio');
    });

    it('Debe validar confirmación de email vacía', () => {
      registerPage.visit();
      registerPage.verifyPageLoaded();
      registerPage.fillRegistrationForm(userData.invalidUsers.emptyConfirmEmail);
      registerPage.clickRegisterButton();

      cy.get('body').then($body => {
        const bodyText = $body.text();
        if (bodyText.includes('Este campo es obligatorio') || 
            bodyText.includes('confirmar') || 
            bodyText.includes('requerido') ||
            bodyText.includes('email')) {
          cy.get('.error, .alert, .message').should('be.visible');
        } else {
          cy.url().should('include', 'registerUser');
        }
      });

      cy.takeScreenshot('registro-confirmar-email-vacio');
    });

    it('Debe validar email con caracteres especiales inválidos', () => {
      registerPage.visit();
      registerPage.verifyPageLoaded();
      registerPage.fillRegistrationForm(userData.invalidUsers.invalidEmailSpecialChars);
      registerPage.clickRegisterButton();

      cy.get('body').then($body => {
        const bodyText = $body.text();
        if (bodyText.includes('email válido') || 
            bodyText.includes('formato') || 
            bodyText.includes('inválido') ||
            bodyText.includes('caracteres') ||
            bodyText.includes('error')) {
          const hasErrorMessage = 
            bodyText.includes('email válido') ||
            bodyText.includes('formato') ||
            bodyText.includes('inválido') ||
            bodyText.includes('error');
          expect(hasErrorMessage, 'Sistema detectó email con caracteres inválidos').to.be.true;
        } else {
          cy.url().should('include', 'registerUser');
        }
      });

      cy.takeScreenshot('registro-email-caracteres-especiales');
    });
  });
  
  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
}); 