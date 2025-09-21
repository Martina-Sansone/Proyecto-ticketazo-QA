describe('Compra Gratis - Test Negativo: Límite de 4 butacas por usuario', () => {
  
  beforeEach(() => {
    // Login automático al inicio
    cy.loginAsMartina();
  });

  it('No debe permitir seleccionar más de 4 butacas por usuario', () => {
    
    // PASO 1: Visitar la página principal
    cy.visit('/');
    
    // PASO 2: Click en "Ver evento" para evento 4
    cy.get('[data-cy="btn-ver-evento-4"]').click();
    
    // PASO 3: Click en "Adquirir"
    cy.get('button[class*="bg-primary"][class*="text-primary-foreground"]')
      .contains('Adquirir', { matchCase: false })
      .click({ force: true });
    
    // PASO 4: Esperar a que cargue la página de asientos
    cy.wait(2000);
    
    // PASO 5: Selección de sector 
    cy.log('Seleccionando sector con Butacas');
    
    // Esperar que cargue el mapa de sectores
    cy.contains('Mapa de Sectores', { timeout: 10000 }).should('be.visible');
    
    // Click en el sector
    cy.contains('Con Butacas')
      .should('be.visible')
      .click();
    
    // Esperar que cargue el mapa de asientos del auditorio
    cy.wait(3000);
    
    // === PASO 6: Seleccionar 4 butacas (límite permitido) ===
    cy.log('Esperando que carguen las butacas disponibles');
    
    // Esperar a que aparezcan las butacas naranjas disponibles
    cy.get('button[class*="bg-orange-"]', { timeout: 10000 })
      .should('have.length.at.least', 5); // Necesitamos al menos 5 para probar el límite
    
    cy.log('Seleccionando las primeras 4 butacas disponibles');
    
    // Seleccionar exactamente 4 butacas naranjas (disponibles)
    for (let i = 0; i < 4; i++) {
      cy.log(`Seleccionando butaca ${i + 1} de 4`);
      
      cy.get('button[class*="bg-orange-"]')
        .filter(':visible')
        .eq(i) // Seleccionar la butaca en posición i
        .scrollIntoView()
        .should('be.visible') // Asegurar que es visible antes de hacer clic
        .click();
      
      cy.wait(1000);
    }
    
    // === PASO 7: Verificar contador de asientos seleccionados ===
    cy.log('Verificando que el contador muestra 4 asientos seleccionados');
    cy.get('.flex-col > div.text-sm', { timeout: 5000 })
      .should('be.visible')
      .and('contain.text', '4'); // Solo verificar que contiene "4"
    
    // === PASO 8: Intentar seleccionar la 5ta butaca (debe fallar) ===
    cy.log('Intentando seleccionar la quinta butaca - debe ser bloqueado');
    
    // Verificar que aún hay butacas disponibles antes de intentar la 5ta
    cy.get('button[class*="bg-orange-"]')
      .filter(':visible')
      .should('have.length.at.least', 1);
    
    // Buscar la quinta butaca disponible e intentar seleccionarla
    cy.get('button[class*="bg-orange-"]')
      .filter(':visible')
      .first()
      .scrollIntoView()
      .should('be.visible')
      .click();
    
    // === PASO 9: Verificar que aparece el mensaje de error ===
    cy.log('Verificando que aparece el mensaje de error');
    
    // Opción 1: Buscar por el selector específico del párrafo rojo
    cy.get('p[class*="text-red-600"]', { timeout: 8000 })
      .should('be.visible')
      .and('contain.text', 'No puedes seleccionar más de 4 asientos por persona');
    
    // Opción 2: Búsqueda alternativa por contenido de texto
    cy.contains('No puedes seleccionar más de 4 asientos por persona', { timeout: 5000 })
      .should('be.visible');
    
    // === PASO 10: Verificar que el contador SIGUE en 4 ===
    // El contador NO debe cambiar después del intento fallido
    cy.get('.flex-col > div.text-sm')
      .should('be.visible')
      .and('contain.text', '4'); // Debe seguir siendo 4
    
  
    
    cy.log('Test completado exitosamente:');
    cy.log('Se permitió seleccionar exactamente 4 butacas');
    cy.log('Se bloqueó correctamente la quinta selección');
    cy.log('Apareció el mensaje de error apropiado');
  
  });
  
  
});