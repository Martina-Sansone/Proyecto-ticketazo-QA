describe('editar perfil', () => {
  beforeEach(() => {
    // Configurar viewport para desktop para evitar problemas responsive
    cy.viewport(1280, 720);
    cy.visit('https://ticketazo.com.ar/');
    
    // Usar selector más específico y robusto para el botón de login
    cy.get('a[href*="login"], button:contains("Login"), a:contains("Iniciar"), button:contains("Ingresar")')
      .first()
      .click({ force: true });
    
    cy.get('[data-cy="input-email"]').type('admin@admin.com');
    cy.get('[data-cy="input-password"]').type('admin');
    cy.get('[data-cy="btn-login"]').click();
    
    // Esperar a que el login se complete
    cy.wait(3000);
  })

  it('cambiar nombre', () => {
    // Usar force: true para elementos que pueden estar ocultos por responsive design
    cy.get('[class="w-6 h-6 text-default-600"]').click({ force: true });
    cy.get(':nth-child(4) > .pb-4').click({ force: true });
    cy.get('[aria-label="Nombre"]').eq(0).clear().type('daniela')
    cy.get('[data-cy="btn-save-profile"]').click();
  })

  it('cambiar usuario', () => {
    cy.get('[class="w-6 h-6 text-default-600"]').click({ force: true });
    cy.get(':nth-child(4) > .pb-4').click({ force: true });
    cy.get('[placeholder="Ej: juanperez123"]').clear().type('daniela26')
    cy.get('[data-cy="btn-save-profile"]').click();
  })

  it('cambiar telefono', () => {
    cy.get('[class="w-6 h-6 text-default-600"]').click({ force: true });
    cy.get(':nth-child(4) > .pb-4').click({ force: true });
    cy.get('[placeholder="Ej:11 1234-5678"]').clear().type('3511011267')
    cy.get('[data-cy="btn-save-profile"]').click();
  })

  it('No deberia permitir letras en el campo de telefono', () => {
    cy.get('[class="w-6 h-6 text-default-600"]').click({ force: true });
    cy.get(':nth-child(4) > .pb-4').click({ force: true });
    cy.get('[placeholder="Ej:11 1234-5678"]').clear().type('daniela26');
    cy.get('[data-cy="btn-save-profile"]').click();
    cy.contains('¡Perfil actualizado con éxito!').should('be.visible');
  })
})