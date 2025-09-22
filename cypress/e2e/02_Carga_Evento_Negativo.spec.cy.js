describe('Carga de Evento - Casos Negativos Completos', () => {
  const loginPath = '/auth/login';
  const EMAIL = 'poboitrobrepou-9637@yopmail.com';
  const PASSWORD = 'Mar2019$';

  beforeEach(() => {
    cy.visit(loginPath);
    cy.get('[data-cy="input-email"]').type(EMAIL);
    cy.get('[data-cy="input-password"]').type(PASSWORD, { log: false });
    cy.get('[data-cy="btn-login"]').click();
    cy.location('pathname', { timeout: 10000 }).should('not.include', loginPath);
  });
// CASO NEGATIVO 1: Título vacío
it('Caso negativo 1: título vacío', () => {
  cy.contains('a', 'Cargar Evento').click();
  cy.get('[data-cy="titulo-form"]').should('contain.text', 'Cargar Función');
  cy.get('button[aria-label="Calendario"]').click({ force: true });
  cy.get('div[role="dialog"]').contains('span', '23').click({ force: true });
  cy.get('svg[data-slot="selectorIcon"]').eq(0).click({ force: true });
  cy.contains('span', 'ATP').click({ force: true });
  cy.get('svg[data-slot="selectorIcon"]').eq(1).click({ force: true });
  cy.get('li[data-cy="option-genero-Teatro"]').click({ force: true });
  cy.get('div[data-cy="input-horario"]').within(() => {
    cy.get('div[data-type="hour"]').first().clear().type('18', { force: true });
    cy.get('div[data-type="minute"]').first().clear().type('30', { force: true });
  });

  cy.get('div[data-cy="input-duracion"]').within(() => {
    cy.get('div[data-type="hour"]').first().clear().type('2', { force: true });
    cy.get('div[data-type="minute"]').first().clear().type('00', { force: true });
  });

  cy.get('button[data-cy="select-lugar-evento"]').click({ force: true });
  cy.contains('li span', 'Otro', { timeout: 5000 }).click({ force: true });
  cy.get('[data-cy="input-nombre-lugar"]').type('Rock');
  cy.get('[data-cy="input-calle-lugar"]').type('Laguna');
  cy.get('[data-cy="input-altura-lugar"]').type('123');
  cy.get('[data-cy="input-codigo-postal-lugar"]').type('547');
  cy.get('input[aria-label="Provincia"]').click({ force: true }).type('Buenos Aires', { force: true });
  cy.contains('li', 'Buenos Aires', { timeout: 5000 }).click({ force: true });
  cy.get('input[aria-label="Localidad"]').click({ force: true }).type('Azul', { force: true });
  cy.contains('li', 'Azul', { timeout: 5000 }).click({ force: true });
  cy.get('[data-cy="input-info"]').type('Test_2');
  cy.contains('button', 'Siguiente').click({ force: true });
  cy.get('div[data-slot="error-message"]')
    .should('be.visible')
    .and('contain.text', 'El título no puede estar vacío.');
});
 // CASO NEGATIVO 2: Lugar del evento vacío
it('Caso negativo 2: lugar del evento vacío', () => {
  cy.contains('a', 'Cargar Evento').click();
  cy.get('[data-cy="titulo-form"]').should('contain.text', 'Cargar Función');

  cy.get('[data-cy="input-titulo"]').type('Evento sin Lugar');

  cy.get('button[aria-label="Calendario"]').click({ force: true });
  cy.get('div[role="dialog"]').contains('span', '23').click({ force: true });
  cy.get('svg[data-slot="selectorIcon"]').eq(0).click({ force: true });
  cy.contains('span', 'ATP').click({ force: true });
  cy.get('svg[data-slot="selectorIcon"]').eq(1).click({ force: true });
  cy.get('li[data-cy="option-genero-Teatro"]').click({ force: true });

  cy.get('div[data-cy="input-horario"]').within(() => {
    cy.get('div[data-type="hour"]').first().clear().type('18', { force: true });
    cy.get('div[data-type="minute"]').first().clear().type('30', { force: true });
  });

  cy.get('div[data-cy="input-duracion"]').within(() => {
    cy.get('div[data-type="hour"]').first().clear().type('2', { force: true });
    cy.get('div[data-type="minute"]').first().clear().type('00', { force: true });
  });

  cy.get('[data-cy="input-info"]').type('Test_LugarVacio');
  cy.contains('button', 'Siguiente').click({ force: true });
  cy.get('div[data-slot="error-message"]')
    .should('be.visible')
    .and('contain.text', 'Debe seleccionar un lugar para el evento.');
});
// CASO NEGATIVO 3: Tipo de entrada no seleccionado
it('Caso negativo 3: tipo de entrada no seleccionado', () => {
  cy.contains('a', 'Cargar Evento').click();
  cy.get('[data-cy="titulo-form"]').should('contain.text', 'Cargar Función');

  cy.get('[data-cy="input-titulo"]').type('Evento sin Entrada');

  cy.get('button[aria-label="Calendario"]').click({ force: true });
  cy.get('div[role="dialog"]').contains('span', '23').click({ force: true });
  cy.get('svg[data-slot="selectorIcon"]').eq(0).click({ force: true });
  cy.contains('span', 'ATP').click({ force: true });
  cy.get('svg[data-slot="selectorIcon"]').eq(1).click({ force: true });
  cy.get('li[data-cy="option-genero-Teatro"]').click({ force: true });

  cy.get('div[data-cy="input-horario"]').within(() => {
    cy.get('div[data-type="hour"]').first().clear().type('18', { force: true });
    cy.get('div[data-type="minute"]').first().clear().type('30', { force: true });
  });

  cy.get('div[data-cy="input-duracion"]').within(() => {
    cy.get('div[data-type="hour"]').first().clear().type('2', { force: true });
    cy.get('div[data-type="minute"]').first().clear().type('00', { force: true });
  });

  cy.get('button[data-cy="select-lugar-evento"]').click({ force: true });
  cy.contains('li span', 'Otro', { timeout: 5000 }).click({ force: true });
  cy.get('[data-cy="input-nombre-lugar"]').type('Rock');
  cy.get('[data-cy="input-calle-lugar"]').type('Laguna');
  cy.get('[data-cy="input-altura-lugar"]').type('123');
  cy.get('[data-cy="input-codigo-postal-lugar"]').type('547');
  cy.get('input[aria-label="Provincia"]').click({ force: true }).type('Buenos Aires', { force: true });
  cy.contains('li', 'Buenos Aires', { timeout: 5000 }).click({ force: true });
  cy.get('input[aria-label="Localidad"]').click({ force: true }).type('Azul', { force: true });
  cy.contains('li', 'Azul', { timeout: 5000 }).click({ force: true });
  cy.get('[data-cy="input-info"]').type('Test_EntradaVacia');
  cy.contains('button', 'Siguiente').click({ force: true });
  cy.get('input[aria-label="Activar Preventa"]').check({ force: true });
  cy.get('button[data-slot="trigger"]').first().click({ force: true });
  cy.get('body').type('{esc}');
  cy.get('input[aria-label="Capacidad"]').first().type('43', { force: true });
  cy.get('input[aria-label="Precio Entrada"]').first().type('1500', { force: true });
  cy.get('input[aria-label="Precio Preventa"]').first().type('1200', { force: true });
  cy.get('input[aria-label="Cantidad Preventa"]').first().type('50', { force: true });
  cy.get('button[data-slot="selector-button"]').first().click({ force: true });
  cy.get('div[role="dialog"]').contains('span', '20').click({ force: true });
  cy.contains('button', 'Siguiente').click({ force: true });
  cy.get('div[data-slot="error-message"]')
    .should('be.visible')
    .and('contain.text', 'Debe seleccionar un nombre para la entrada #1');
});
});

