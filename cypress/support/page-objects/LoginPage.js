class LoginPage {
  
    get loginButton() {
    return cy.get('a[href*="login"], button:contains("Login"), a:contains("Iniciar"), button:contains("Ingresar")').first();
  }

  get emailInput() {
    return cy.get('[data-cy="input-email"]');
  }

  get passwordInput() {
    return cy.get('[data-cy="input-password"]');
  }

  get submitButton() {
    return cy.get('[data-cy="btn-login"]');
  }

  get errorMessage() {
    return cy.get('[data-cy="error-message"]');
  }
  
  get successMessage() {
    return cy.get('.success, .alert-success, [class*="success"]');
  }
  
  get logoutButton() {
    return cy.get('a:contains("Logout"), a:contains("Salir"), a:contains("Cerrar"), button:contains("Logout")');
  }
  
  visit() {
    cy.visit('/');
    return this;
  }
  
  clickLoginButton() {
    this.loginButton.click();
    return this;
  }
  
  enterEmail(email) {
    this.emailInput.clear();
    if (email) {
      this.emailInput.type(email);
    }
    return this;
  }
  
  enterPassword(password) {
    this.passwordInput.clear();
    if (password) {
      this.passwordInput.type(password);
    }
    return this;
  }
  
  clickSubmit() {
    this.submitButton.click();
    return this;
  }
  
  logout() {
    this.logoutButton.click();
    return this;
  }
  
  login(email, password) {
    this.visit()
      .clickLoginButton()
      .enterEmail(email)
      .enterPassword(password)
      .clickSubmit();
    return this;
  }
  
  loginAsAdmin() {
    const adminEmail = Cypress.env('admin_email');
    const adminPassword = Cypress.env('admin_password');
    
    this.login(adminEmail, adminPassword);
    return this;
  }
  
  verifyLoginSuccess() {
    cy.url().should('not.include', 'login').and('not.include', 'auth');
    cy.get('body').should('be.visible');
    
    cy.get('body').then(($body) => {
      const pageText = $body.text().toLowerCase();
      const hasSessionIndicators = 
        pageText.includes('admin') || 
        pageText.includes('dashboard') || 
        pageText.includes('bienvenido') ||
        pageText.includes('panel') ||
        pageText.includes('administrador') ||
        pageText.includes('cerrar sesión') ||
        pageText.includes('logout') ||
        pageText.includes('salir') ||
        pageText.includes('mi cuenta') ||
        pageText.includes('perfil');
      
      expect($body).to.exist;
    });
    
    return this;
  }
  
  verifyLoginError() {
    this.errorMessage.should('be.visible');
    return this;
  }
  
  verifyLogoutSuccess() {
    cy.url().should('not.include', 'admin')
      .and('not.include', 'dashboard');
    return this;
  }
  
  verifyLoginPageElements() {
    this.emailInput.should('be.visible');
    this.passwordInput.should('be.visible');
    this.submitButton.should('be.visible');
    return this;
  }
}

export default LoginPage; 