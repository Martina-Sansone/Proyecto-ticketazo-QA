describe('Selección de Asientos - Test Negativo: Butacas Ocupadas', () => {
  
  beforeEach(() => {
    // Login automático al inicio
    cy.loginAsMartina();
  });

  it('TC_004 - Verificar que las butacas ocupadas (grises) no sean seleccionables', () => {
    
    // PASO 1: Visitar la página principal
    cy.visit('/');
    
    // PASO 2: Click en "Ver evento" para evento con butacas ocupadas
    cy.get('[data-cy="btn-ver-evento-4"]').click();
    
    // PASO 3: Click en "Adquirir"
    cy.get('button[class*="bg-primary"][class*="text-primary-foreground"]')
      .contains('Adquirir', { matchCase: false })
      .click({ force: true });
    
    // PASO 4: Esperar a que cargue la página de asientos
    cy.wait(2000);
    
    // PASO 5: Selección de sector que contenga butacas ocupadas
    cy.log('Seleccionando sector con butacas ocupadas');
    
    // Esperar que cargue el mapa de sectores
    cy.contains('Mapa de Sectores', { timeout: 10000 }).should('be.visible');
    
    // Click en el sector "Con Butacas"
 cy.contains('Con Butacas')
      .should('be.visible')
      .click();
    
    // Esperar que cargue el mapa de asientos del auditorio
    cy.wait(3000);
    
    //  PASO 6: Identificar butacas de color gris en el mapa 
    cy.log('Identificando butacas ocupadas (grises)');
    
    // Verificar que existen butacas grises y naranjas en el mapa
    cy.get('button[class*="bg-gray-500"]', { timeout: 10000 })
      .should('exist')
      .and('have.length.at.least', 1);
    
    cy.get('button[class*="bg-orange-"]')
      .should('exist')
      .and('have.length.at.least', 1);
    
    // PASO 7: Intentar hacer clic en una butaca gris (ocupada) 
    cy.log('Intentando hacer clic en butaca ocupada - debe estar deshabilitada');
    
    // Obtener la primera butaca gris usando el selector correcto
    cy.get('button[class*="bg-gray-500"]')
      .first()
      .as('butacaOcupada');
    
    // Verificar que la butaca tiene la clase de cursor no permitido
    cy.get('@butacaOcupada')
      .should('be.visible')
      .and('have.class', 'cursor-not-allowed'); // Verificar clase CSS
    
    // Intentar hacer clic
    cy.get('@butacaOcupada')
      .click({ force: true }); // Intentar clic aunque tenga cursor-not-allowed
    
    
    // PASO 8: Verificar el estado visual de la butaca gris 
    cy.log('Verificando estado visual de butaca ocupada');
    
    // La butaca debe mantener su apariencia gris/deshabilitada
    cy.get('@butacaOcupada')
      .should('have.class', 'bg-gray-500')
      .and('have.class', 'cursor-not-allowed');
    
    // Verificar que también tiene hover:bg-gray-500 (no cambia de color)
    cy.get('@butacaOcupada')
      .should('have.class', 'hover:bg-gray-500');
    
    // PASO 10: Intentar hacer clic en diferentes butacas grises 
    cy.log('Probando múltiples butacas grises');
    
    // Intentar con hasta 3 butacas grises diferentes
    cy.get('button[class*="bg-gray-500"]')
      .should('have.length.at.least', 1)
      .each(($button, index) => {
        if (index < 3) { // Solo probar las primeras 3
          cy.wrap($button)
            .should('have.class', 'cursor-not-allowed')
            .click({ force: true }); // Intentar clic forzado
          
        
        }
      });
    
    cy.log('Test completado exitosamente:');
    cy.log('Las butacas grises están correctamente deshabilitadas');
    cy.log('No se pueden seleccionar butacas ocupadas');
    cy.log('El estado visual se mantiene (gris/deshabilitado)');
  });
  
});