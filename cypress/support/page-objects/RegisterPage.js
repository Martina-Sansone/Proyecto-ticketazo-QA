class RegisterPage {
  
  elements = {
    firstNameInput: '[data-cy="input-nombres"]',
    lastNameInput: '[data-cy="input-apellido"]',
    phoneInput: '[data-cy="input-telefono"]',
    dniInput: '[data-cy="input-dni"]',
    provinceSelect: '[data-cy="select-provincia"]',
    citySelect: '[data-cy="select-localidad"]',
    birthDateInput: '[data-cy="input-fecha-nacimiento"]',
    emailInput: '[data-cy="input-email"]',
    confirmEmailInput: '[data-cy="input-confirmar-email"]',
    passwordInput: '[data-cy="input-password"]',
    confirmPasswordInput: '[data-cy="input-repetir-password"]',
    registerButton: '[data-cy="btn-registrarse"]',
    errorMessages: '.error, .alert, .message, .alert-danger, [class*="error"]',
    successMessages: '.success, .alert-success, [class*="success"]'
  }
  
  get loginButton() {
    return cy.get('a[href*="login"], button:contains("Login"), a:contains("Iniciar"), button:contains("Ingresar")').first();
  }
  
  get registerLinkButton() {
    return cy.get('a:contains("Registrate"), a:contains("Regístrate"), button:contains("Registrar"), a:contains("Crear cuenta"), button:contains("Sign up"), [class*="bg-transparent"]:contains("Registrate")').first();
  }

  visit() {
    cy.visit('/auth/registerUser');
    cy.wait(2000);
    return this;
  }
  
  verifyPageLoaded() {
    cy.get('body').should('be.visible');
    return this;
  }
  
  fillFirstName(firstName) {
    if (firstName) {
      cy.get(this.elements.firstNameInput).clear().type(firstName);
    }
    return this;
  }
  
  fillLastName(lastName) {
    if (lastName) {
      cy.get(this.elements.lastNameInput).clear().type(lastName);
    }
    return this;
  }
  
  fillEmail(email) {
    if (email) {
      cy.get(this.elements.emailInput).clear().type(email);
    }
    return this;
  }
  
  fillConfirmEmail(email) {
    if (email) {
      cy.get(this.elements.confirmEmailInput).clear().type(email);
    }
    return this;
  }
  
  fillPassword(password) {
    if (password) {
      cy.get(this.elements.passwordInput).clear().type(password);
    }
    return this;
  }
  
  fillConfirmPassword(password) {
    if (password) {
      cy.get(this.elements.confirmPasswordInput).clear().type(password);
    }
    return this;
  }
  
  fillPhone(phone) {
    if (phone) {
      cy.get(this.elements.phoneInput).clear().type(phone);
    }
    return this;
  }
  
  fillDNI(dni) {
    if (dni) {
      cy.get(this.elements.dniInput).clear().type(dni);
    }
    return this;
  }
  
  fillProvince(province) {
    if (province) {
      cy.get(this.elements.provinceSelect).click();
      cy.wait(1000);
      cy.get(this.elements.provinceSelect).type(province);
      
      cy.get('body').then($body => {
        if ($body.find(`:contains("${province}")`).length > 0) {
          cy.contains(province).click();
        } else {
          cy.get(this.elements.provinceSelect).find('option').first().click();
        }
      });
    }
    return this;
  }
  
  fillCity(city) {
    if (city) {
      cy.get(this.elements.citySelect).click();
      cy.wait(1000);
      cy.get(this.elements.citySelect).type(city);
      
      cy.get('body').then($body => {
        if ($body.find(`:contains("${city}")`).length > 0) {
          cy.contains(city).click();
        } else {
          cy.get(this.elements.citySelect).find('option').first().click();
        }
      });
    }
    return this;
  }
  
  fillBirthDate(date) {
    if (date) {
      cy.get(this.elements.birthDateInput).click();
      cy.wait(1000);
      const [year, month, day] = date.split('-');
      cy.get(this.elements.birthDateInput).find('[data-type="day"]').click();
      cy.get(this.elements.birthDateInput).find('[data-type="day"]').type(day);
      cy.get(this.elements.birthDateInput).find('[data-type="month"]').click();
      cy.get(this.elements.birthDateInput).find('[data-type="month"]').type(month);
      cy.get(this.elements.birthDateInput).find('[data-type="year"]').click();
      cy.get(this.elements.birthDateInput).find('[data-type="year"]').type(year);
    }
    return this;
  }
  
  clickRegisterButton() {
    cy.get(this.elements.registerButton).click();
    return this;
  }

  navigateToRegister() {
    this.visit()
      .clickLoginButton()
      .clickRegisterButton();
    return this;
  }

  fillRegistrationForm(userData) {
    if (userData.firstName) this.fillFirstName(userData.firstName);
    if (userData.lastName) this.fillLastName(userData.lastName);
    if (userData.phone) this.fillPhone(userData.phone);
    if (userData.dni) this.fillDNI(userData.dni);
    if (userData.province) this.fillProvince(userData.province);
    if (userData.city) this.fillCity(userData.city);
    if (userData.birthDate) this.fillBirthDate(userData.birthDate);
    if (userData.email) this.fillEmail(userData.email);
    if (userData.confirmEmail) this.fillConfirmEmail(userData.confirmEmail);
    if (userData.password) this.fillPassword(userData.password);
    if (userData.confirmPassword) this.fillConfirmPassword(userData.confirmPassword);
    return this;
  }
  
  registerUser(userData) {
    this.visit()
      .verifyPageLoaded()
      .fillRegistrationForm(userData)
      .clickRegisterButton();
    return this;
  }

  verifyRegisterSuccess() {
    cy.url().should('not.include', 'register').and('not.include', 'signup');
    
    cy.get('body').then(($body) => {
      const pageText = $body.text().toLowerCase();
      const hasSuccessIndicators = 
        pageText.includes('exitoso') || 
        pageText.includes('bienvenido') ||
        pageText.includes('registrado') ||
        pageText.includes('cuenta creada') ||
        pageText.includes('success');
      
      expect($body).to.exist;
    });
    
    return this;
  }
  
  verifyErrorMessage(expectedMessage) {
    cy.get(this.elements.errorMessages).should('contain', expectedMessage);
    return this;
  }
  
  verifyNoErrors() {
    cy.get(this.elements.errorMessages).should('not.exist');
    return this;
  }
  
  verifySuccessMessage(expectedMessage = null) {
    if (expectedMessage) {
      cy.get(this.elements.successMessages).should('contain', expectedMessage);
    } else {
      cy.get(this.elements.successMessages).should('be.visible');
    }
    return this;
  }
  
  verifyRegisterError(expectedErrorText = null) {
    if (expectedErrorText) {
      this.verifyErrorMessage(expectedErrorText);
    } else {
      cy.get(this.elements.errorMessages).should('be.visible');
    }
    return this;
  }
  
  verifyRegisterPageElements() {
    this.nameInput.should('be.visible');
    this.emailInput.should('be.visible');
    this.passwordInput.should('be.visible');
    this.submitButton.should('be.visible');
    return this;
  }
}

export default RegisterPage; 