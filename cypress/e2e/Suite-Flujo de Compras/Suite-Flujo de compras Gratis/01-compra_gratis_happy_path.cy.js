describe('Compra Gratis - Happy Path (con asientos)', () => {

  beforeEach(() => {
    // Login automático con mi cuenta
    cy.loginAsMartina();
  });

  it('TC_001 - Debe completar compra gratuita con butaca disponible', () => {

    // PASO 1: Visitar la página principal
    cy.visit('/');

    // PASO 2: Click en "Ver evento" para evento 4 "Esperando la Carroza"
    cy.get('[data-cy="btn-ver-evento-4"]').click();

    // PASO 3: Click en "Adquirir" 
    cy.get('button[class*="bg-primary"][class*="text-primary-foreground"]')
      .contains('Adquirir', { matchCase: false })
      .click({ force: true });

    // PASO 4: Esperar a que cargue la página de asientos
    cy.wait(2000);

    // PASO 5: Selección de sector 
    cy.log('Seleccionando sector');

    // Esperar que cargue el mapa de sectores
    cy.contains('Mapa de Sectores', { timeout: 10000 }).should('be.visible');
    cy.contains('Selecciona un sector para continuar').should('be.visible');

    // PASO 5a: Hacer clic en el sector "Con butacas"
    cy.contains('Con Butacas')
      .should('be.visible')
      .click();

    // PASO 5b: Esperar que cargue el mapa de asientos del auditorio
    cy.wait(3000);

    // PASO 5: Selección de sector 
    cy.log('Buscando sector con butacas');

    // Esperar que cargue el mapa de sectores - solo buscar "Mapa de Sectores"
    cy.contains('Mapa de Sectores', { timeout: 10000 }).should('be.visible');

    //  Elegir primer asiento disponible (naranja)
    cy.log('Buscando una butaca disponible');

    cy.get('button[class*="bg-orange-"]')
      .filter(':visible')
      .first()
      .scrollIntoView()
      .click();

    // === PASO 6: Ir al Resumen (Comprar habilitado y click) ===
    cy.contains('button', /^Comprar\s*\(\d+\)/i, { timeout: 8000 })
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    // === PASO 7: Validaciones en el Resumen ===

    // Título de la vista
    cy.contains(/resumen de compra/i, { timeout: 10000 }).should('be.visible');

    //  Nombre del evento
    cy.get('.items-start > :nth-child(2) > .font-semibold')
      .should('be.visible')
      .and('contain.text', 'Esperando la Carroza');

    // Entradas seleccionadas
    cy.get('.border-t')
      .should('be.visible')
      .contains(/F\d+\s*C\d+/i);

    //  Fila "Total ... Gratis"
    cy.get('.space-y-4 > .justify-between')
      .filter((_, el) => /total/i.test(el.textContent) && /gratis/i.test(el.textContent))
      .should('have.length.at.least', 1);
    // Mensaje "Este evento es gratuito"
    cy.contains(/este evento es gratuito/i).should('be.visible');




  });

});

