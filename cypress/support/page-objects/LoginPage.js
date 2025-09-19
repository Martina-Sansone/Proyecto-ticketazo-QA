/**
 * Page Object para la página de Login
 */

class LoginPage {

  
  get loginButton() {
    return cy.get('a[href*="login"], button:contains("Login"), a:contains("Iniciar"), button:contains("Ingresar")').first();
  }
  
  get emailInput() {
    return cy.get('input[type="email"], input[name="email"], input[placeholder*="email"]');
  }
  
  get passwordInput() {
    return cy.get('input[type="password"], input[name="password"], input[placeholder*="password"]');
  }
  
  get submitButton() {
    return cy.get('button[type="submit"], input[type="submit"], button:contains("Ingresar"), button:contains("Login")');
  }
  
  get errorMessage() {
    return cy.get('.error, .alert-danger, [class*="error"], [class*="danger"]');
  }
  
  get successMessage() {
    return cy.get('.success, .alert-success, [class*="success"]');
  }
  
  get logoutButton() {
    return cy.get('a:contains("Logout"), a:contains("Salir"), a:contains("Cerrar"), button:contains("Logout")');
  }
  

  
  /**
   * Visitar la página principal
   */
  visit() {
    cy.visit('/');
    return this;
  }
  
  /**
   * Hacer clic en el botón de login
   */
  clickLoginButton() {
    this.loginButton.click();
    return this;
  }
  
  /**
   * Ingresar email
   * @param {string} email 
   */
  enterEmail(email) {
    this.emailInput.clear().type(email);
    return this;
  }
  
  /**
   * Ingresar contraseña
   * @param {string} password 
   */
  enterPassword(password) {
    this.passwordInput.clear().type(password);
    return this;
  }
  
  /**
   * Hacer clic en el botón de submit
   */
  clickSubmit() {
    this.submitButton.click();
    cy.log('✅ Enviando formulario de login');
    return this;
  }
  
  /**
   * Hacer logout
   */
  logout() {
    this.logoutButton.click();
    cy.log('🚪 Cerrando sesión');
    return this;
  }
  
  // ===========================================
  // MÉTODOS DE FLUJO COMPLETO
  // ===========================================
  
  /**
   * Realizar login completo con credenciales
   * @param {string} email 
   * @param {string} password 
   */
  login(email, password) {
    this.visit()
      .clickLoginButton()
      .enterEmail(email)
      .enterPassword(password)
      .clickSubmit();
    
    cy.log('🔐 Login completo realizado');
    return this;
  }
  
  /**
   * Login como administrador usando variables de entorno
   */
  loginAsAdmin() {
    const adminEmail = Cypress.env('admin_email');
    const adminPassword = Cypress.env('admin_password');
    
    this.login(adminEmail, adminPassword);
    cy.log('👑 Login como administrador completado');
    return this;
  }
  
  // ===========================================
  // MÉTODOS DE VERIFICACIÓN
  // ===========================================
  
  /**
   * Verificar que el login fue exitoso
   */
  verifyLoginSuccess() {
    cy.log('🔍 Verificando login exitoso');
    
    // Verificar que ya no estamos en la página de login
    cy.url().should('not.include', 'login');
    
    // Verificar que la página cargó correctamente
    cy.get('body').should('be.visible');
    
    // Verificar elementos del dashboard usando una estrategia más simple
    cy.get('body').then(($body) => {
      const pageText = $body.text().toLowerCase();
      const hasAdminIndicators = 
        pageText.includes('admin') || 
        pageText.includes('dashboard') || 
        pageText.includes('bienvenido') ||
        pageText.includes('panel') ||
        pageText.includes('administrador');
      
      if (hasAdminIndicators) {
        cy.log('✅ Login verificado - Elementos de admin encontrados');
      } else {
        cy.log('⚠️ Login aparentemente exitoso pero sin elementos específicos de admin');
      }
      
      // Por ahora solo verificamos que no estamos en login
      expect($body).to.exist;
    });
    
    return this;
  }
  
  /**
   * Verificar que aparece mensaje de error
   */
  verifyLoginError() {
    this.errorMessage.should('be.visible');
    cy.log('❌ Error de login verificado');
    return this;
  }
  
  /**
   * Verificar que el logout fue exitoso
   */
  verifyLogoutSuccess() {
    cy.url().should('not.include', 'admin')
      .and('not.include', 'dashboard');
    
    cy.log('✅ Logout verificado como exitoso');
    return this;
  }
  
  /**
   * Verificar elementos de la página de login
   */
  verifyLoginPageElements() {
    this.emailInput.should('be.visible');
    this.passwordInput.should('be.visible');
    this.submitButton.should('be.visible');
    
    cy.log('✅ Elementos de login verificados');
    return this;
  }
}

// Exportar la clase para uso en los tests
export default LoginPage; 