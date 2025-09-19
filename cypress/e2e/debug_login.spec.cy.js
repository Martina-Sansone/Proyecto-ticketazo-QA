/**
 * Test de debugging para identificar elementos de la página
 */

describe('DEBUG: Login Paso a Paso', () => {
  
  it('Cargar página principal', () => {
    cy.visit('/');
    cy.get('body').should('be.visible');
    cy.title().should('include', 'Ticketazo');
  });
  
  it('Paso 2: Buscar botón de login', () => {
    cy.visit('/');
    
    // Intentar varios selectores posibles para el botón de login
    const loginSelectors = [
      'a[href*="login"]',
      'button:contains("Login")',
      'a:contains("Iniciar")',
      'a:contains("Ingresar")',
      'button:contains("Ingresar")',
      '.login',
      '#login',
      '[data-testid="login"]'
    ];
    
    let foundLogin = false;
    
    loginSelectors.forEach(selector => {
      cy.get('body').then($body => {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Encontrado selector de login: ${selector}`);
          foundLogin = true;
        }
      });
    });
    
    // También vamos a ver qué hay en la página
    cy.get('body').then($body => {
      const pageText = $body.text();
      cy.log('📄 Texto de la página:');
      cy.log(pageText.substring(0, 500)); // Primeros 500 caracteres
    });
  });
  
  it('Paso 3: Ver estructura HTML', () => {
    cy.visit('/');
    
    // Ver los enlaces principales
    cy.get('a').then($links => {
      cy.log(`🔗 Enlaces encontrados: ${$links.length}`);
      $links.each((index, link) => {
        const href = Cypress.$(link).attr('href');
        const text = Cypress.$(link).text().trim();
        if (text) {
          cy.log(`Link ${index + 1}: "${text}" -> ${href}`);
        }
      });
    });
    
    // Ver los botones principales
    cy.get('button').then($buttons => {
      cy.log(`🔘 Botones encontrados: ${$buttons.length}`);
      $buttons.each((index, button) => {
        const text = Cypress.$(button).text().trim();
        if (text) {
          cy.log(`Botón ${index + 1}: "${text}"`);
        }
      });
    });
  });
  
}); 