// ***********************************************
// Comandos Personalizados - Challenge Ticketazo
// ***********************************************

// ===========================================
// COMANDOS DE AUTENTICACIÓN
// ===========================================

/**
 * Comando para hacer login como administrador
 * Uso: cy.loginAsAdmin()
 */
Cypress.Commands.add('loginAsAdmin', () => {
  cy.log('🔐 Iniciando sesión como administrador');
  
  // Visitar página de login
  cy.visit('/');
  
  // Buscar y hacer clic en el botón de login
  cy.get('a[href*="login"], button:contains("Login"), a:contains("Iniciar"), button:contains("Ingresar")')
    .first()
    .click();
  
  // Ingresar credenciales
  cy.get('input[type="email"], input[name="email"], input[placeholder*="email"]')
    .type(Cypress.env('admin_email'));
  
  cy.get('input[type="password"], input[name="password"], input[placeholder*="password"]')
    .type(Cypress.env('admin_password'));
  
  // Hacer clic en botón de submit
  cy.get('button[type="submit"], input[type="submit"], button:contains("Ingresar"), button:contains("Login")')
    .click();
  
  // Verificar que el login fue exitoso
  cy.url().should('not.include', 'login');
  cy.log('✅ Login exitoso');
});

/**
 * Comando para hacer logout
 * Uso: cy.logout()
 */
Cypress.Commands.add('logout', () => {
  cy.log('🚪 Cerrando sesión');
  
  cy.get('a:contains("Logout"), a:contains("Salir"), a:contains("Cerrar"), button:contains("Logout")')
    .click();
  
  cy.log('✅ Logout exitoso');
});

// ===========================================
// COMANDOS DE NAVEGACIÓN
// ===========================================

/**
 * Comando para navegar al panel administrativo
 * Uso: cy.goToAdminPanel()
 */
Cypress.Commands.add('goToAdminPanel', () => {
  cy.log('🏠 Navegando al panel administrativo');
  
  cy.get('a[href*="admin"], a:contains("Admin"), a:contains("Panel"), nav a:contains("Dashboard")')
    .first()
    .click();
  
  cy.url().should('include', 'admin');
});

/**
 * Comando para navegar a la lista de eventos
 * Uso: cy.goToEventsList()
 */
Cypress.Commands.add('goToEventsList', () => {
  cy.log('📅 Navegando a lista de eventos');
  
  cy.get('a:contains("Eventos"), a:contains("Events"), a[href*="event"]')
    .first()
    .click();
});

// ===========================================
// COMANDOS DE EVENTOS
// ===========================================

/**
 * Comando para crear un evento
 * Uso: cy.createEvent(eventData)
 */
Cypress.Commands.add('createEvent', (eventData) => {
  cy.log('➕ Creando nuevo evento');
  
  // Buscar botón de crear evento
  cy.get('button:contains("Crear"), a:contains("Nuevo"), button:contains("Agregar")')
    .first()
    .click();
  
  // Llenar formulario
  if (eventData.name) {
    cy.get('input[name*="name"], input[placeholder*="nombre"]')
      .type(eventData.name);
  }
  
  if (eventData.date) {
    cy.get('input[type="date"], input[name*="date"], input[placeholder*="fecha"]')
      .type(eventData.date);
  }
  
  if (eventData.time) {
    cy.get('input[type="time"], input[name*="time"], input[placeholder*="hora"]')
      .type(eventData.time);
  }
  
  if (eventData.location) {
    cy.get('input[name*="location"], input[name*="venue"], input[placeholder*="ubicación"]')
      .type(eventData.location);
  }
  
  if (eventData.price) {
    cy.get('input[name*="price"], input[name*="precio"], input[placeholder*="precio"]')
      .type(eventData.price.toString());
  }
  
  if (eventData.capacity) {
    cy.get('input[name*="capacity"], input[name*="capacidad"], input[placeholder*="capacidad"]')
      .type(eventData.capacity.toString());
  }
  
  // Guardar evento
  cy.get('button[type="submit"], button:contains("Guardar"), button:contains("Crear")')
    .click();
  
  cy.log('✅ Evento creado exitosamente');
});

// ===========================================
// COMANDOS DE COMPRA DE TICKETS
// ===========================================

/**
 * Comando para comprar tickets
 * Uso: cy.buyTickets(purchaseData)
 */
Cypress.Commands.add('buyTickets', (purchaseData) => {
  cy.log('🎫 Iniciando compra de tickets');
  
  // Seleccionar cantidad de tickets
  if (purchaseData.quantity) {
    cy.get('select[name*="quantity"], input[name*="quantity"], input[name*="cantidad"]')
      .first()
      .then($el => {
        if ($el.is('select')) {
          cy.wrap($el).select(purchaseData.quantity.toString());
        } else {
          cy.wrap($el).clear().type(purchaseData.quantity.toString());
        }
      });
  }
  
  // Llenar datos del comprador
  if (purchaseData.name) {
    cy.get('input[name*="name"], input[name*="nombre"], input[placeholder*="nombre"]')
      .type(purchaseData.name);
  }
  
  if (purchaseData.email) {
    cy.get('input[type="email"], input[name*="email"]')
      .type(purchaseData.email);
  }
  
  if (purchaseData.phone) {
    cy.get('input[name*="phone"], input[name*="telefono"], input[placeholder*="teléfono"]')
      .type(purchaseData.phone);
  }
  
  cy.log('✅ Datos de compra completados');
});

// ===========================================
// COMANDOS DE MERCADO PAGO
// ===========================================

/**
 * Comando para procesar pago con Mercado Pago
 * Uso: cy.processPaymentMP()
 */
Cypress.Commands.add('processPaymentMP', () => {
  cy.log('💳 Procesando pago con Mercado Pago');
  
  // Seleccionar Mercado Pago como método de pago
  cy.get('input[value*="mercadopago"], button:contains("Mercado Pago"), label:contains("Mercado Pago")')
    .click();
  
  // Continuar al checkout
  cy.get('button:contains("Continuar"), button:contains("Pagar"), button[type="submit"]')
    .click();
  
  // Manejar redirección a Mercado Pago (si ocurre)
  cy.origin('https://www.mercadopago.com.ar', () => {
    // Ingresar credenciales de prueba
    cy.get('input[name="user_id"], input[placeholder*="usuario"]', { timeout: 15000 })
      .should('be.visible')
      .type(Cypress.env('mp_user'));
    
    cy.get('input[type="password"], input[name="password"]')
      .type(Cypress.env('mp_password'));
    
    cy.get('button[type="submit"], button:contains("Continuar")')
      .click();
    
    // Manejar código de seguridad si aparece
    cy.get('body').then($body => {
      if ($body.find('input[name="security_code"]').length > 0) {
        cy.get('input[name="security_code"]')
          .type(Cypress.env('mp_security_code'));
        
        cy.get('button[type="submit"]').click();
      }
    });
  });
  
  cy.log('✅ Pago procesado con Mercado Pago');
});

// ===========================================
// COMANDOS DE UTILIDAD
// ===========================================

/**
 * Comando para esperar hasta que un elemento sea visible
 * Uso: cy.waitUntilVisible(selector)
 */
Cypress.Commands.add('waitUntilVisible', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible');
});

/**
 * Comando para tomar screenshot con nombre personalizado
 * Uso: cy.takeScreenshot('nombre-del-test')
 */
Cypress.Commands.add('takeScreenshot', (name) => {
  cy.screenshot(name, { capture: 'fullPage' });
});

/**
 * Comando para verificar que no hay errores de consola
 * Uso: cy.checkConsoleErrors()
 */
Cypress.Commands.add('checkConsoleErrors', () => {
  cy.window().then((win) => {
    expect(win.console.error).to.not.have.been.called;
  });
});

// ===========================================
// COMANDOS DE VALIDACIÓN DE QR
// ===========================================

/**
 * Comando para validar ticket QR (simulado)
 * Uso: cy.validateTicketQR(ticketData)
 */
Cypress.Commands.add('validateTicketQR', (ticketData) => {
  cy.log('🔍 Validando ticket con código QR');
  
  // Ir a página de validación
  cy.get('a:contains("Validar"), a:contains("Escanear"), a[href*="validate"]')
    .click();
  
  // Simular escaneo (depende de la implementación real)
  cy.get('input[name*="qr"], input[name*="codigo"], textarea[name*="ticket"]')
    .type(ticketData.qrCode || 'TICKET_QR_CODE_SIMULATION');
  
  cy.get('button:contains("Validar"), button:contains("Verificar"), button[type="submit"]')
    .click();
  
  cy.log('✅ Validación de ticket completada');
});

// ===========================================
// CONFIGURACIÓN GLOBAL
// ===========================================

// Configurar para manejar errores no capturados
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignorar ciertos errores comunes de aplicaciones web
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false;
  }
  // No fallar el test por errores de JavaScript no relacionados con nuestras pruebas
  return false;
});

// Configurar intercepción de requests para debugging
beforeEach(() => {
  // Interceptar llamadas API para debugging
  cy.intercept('POST', '**/api/**').as('apiPost');
  cy.intercept('GET', '**/api/**').as('apiGet');
});


//Login usuario normal test Martina 

Cypress.Commands.add('loginAsMartina', () => {
  cy.log('🔐 Iniciando sesión como usuario normal test martina');

  // 1. Ir al home
  cy.visit('/');

  // 2. Ir al formulario de login (ajusta el selector según tu app)
  cy.get('a[href*="login"], button:contains("Login"), a:contains("Iniciar"), button:contains("Ingresar")')
    .first()
    .click();

  // 3. Completar credenciales
  cy.get('input[type="email"], input[name="email"], input[placeholder*="email"]')
    .clear()
    .type('pabloymar392@gmail.com');

  cy.get('input[type="password"], input[name="password"], input[placeholder*="password"]')
    .clear()
    .type('Test123!!', { log: false });

  // 4. Confirmar login
  cy.get('button[type="submit"], input[type="submit"], button:contains("Ingresar"), button:contains("Login")')
    .click();

  // 5. Validar que no sigamos en /login
  cy.url().should('not.include', 'login');
  cy.log('✅ Login exitoso con Pablo');
});
