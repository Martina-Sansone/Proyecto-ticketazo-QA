describe('Compra Gratis - Negativo (sin butaca)', () => {

  beforeEach(() => {
    // Login automático con mi cuenta
      cy.loginAsMartina();
  });

  it(' NO permite avanzar sin seleccionar butaca', () => {
      // PASO 1: Visitar la página principal
    cy.visit('/');

    // PASO 2: Click en "Ver evento" para evento 4 "Esperando la Carroza"
    cy.get('[data-cy="btn-ver-evento-4"]').click();

    // PASO 3: Click en "Adquirir"
    cy.get('button[class*="bg-primary"][class*="text-primary-foreground"]')
      .contains('Adquirir', { matchCase: false })
      .click({ force: true });

    // PASO 4: Esperar a que cargue la página de asientos
    cy.get('body', { timeout: 15000 }).then(($body) => {
      const hasSeats =
        $body.find('button[title*="Fila"], button[class*="bg-orange-"]').length > 0;

      if (!hasSeats) {
        // Si no hay butacas, intentar seleccionar un sector sin butacas
        const $firstSector = $body
          .find('button, [role="button"], a')
          .filter((_, el) => /auditorio|campo|platea|tribuna|sector/i.test(el.textContent || ''))
          .first();

        if ($firstSector.length) {
          cy.wrap($firstSector).scrollIntoView().click();
        }
      }
    });

    // Esperar que cargue el mapa de asientos del auditorio
    cy.get('button[title*="Fila"], button[class*="bg-orange-"]', { timeout: 15000 })
      .should('exist');

    //PASO 5: Validar que no se pueda avanzar sin seleccionar butaca
    // Botón “Comprar (0)” debe estar deshabilitado
    // No debe existir ningún botón "Comprar (n)" ni "Comprar"
cy.get('button').contains(/^Comprar\s*\(\d+\)/i).should('not.exist');
cy.get('button').contains(/comprar/i).should('not.exist');
    cy.log('No se puede avanzar sin seleccionar butaca');
    });
  });

