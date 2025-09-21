describe('editar perfil', () => {
  beforeEach(() => {
    cy.visit('https://ticketazo.com.ar/');
    cy.get('.justify-end > .text-sm').click();
    cy.get('[data-cy="input-email"]').type('admin@admin.com');
    cy.get('[data-cy="input-password"]').type('admin');
    cy.get('[data-cy="btn-login"]').click();
  })

  it('cambiar nombre', () => {
    cy.get('[class="w-6 h-6 text-default-600"]').click();
    cy.get(':nth-child(4) > .pb-4').click();
    cy.get('[aria-label="Nombre"]').eq(0).clear().type('daniela')
    cy.get('[data-cy="btn-save-profile"]').click();
  })

  it('cambiar usuario', () => {
    cy.get('[class="w-6 h-6 text-default-600"]').click();
    cy.get(':nth-child(4) > .pb-4').click();
    cy.get('[placeholder="Ej: juanperez123"]').clear().type('daniela26')
    cy.get('[data-cy="btn-save-profile"]').click();
  })

  it('cambiar telefono', () => {
    cy.get('[class="w-6 h-6 text-default-600"]').click();
    cy.get(':nth-child(4) > .pb-4').click();
    cy.get('[placeholder="Ej:11 1234-5678"]').clear().type('3511011267')
    cy.get('[data-cy="btn-save-profile"]').click();
  })

  it('No deberia permitir letras en el campo de telefono', () => {
    cy.get('[class="w-6 h-6 text-default-600"]').click();
    cy.get(':nth-child(4) > .pb-4').click();
    cy.get('[placeholder="Ej:11 1234-5678"]').clear().type('daniela26');
    cy.get('[data-cy="btn-save-profile"]').click();
    cy.contains('¡Perfil actualizado con éxito!').should('be.visible');

  })

  })