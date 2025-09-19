const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // URL base del sistema bajo prueba
    baseUrl: 'https://vps-3696213-x.dattaweb.com',
    
    // Configuración de viewports
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Timeouts optimizados para aplicaciones reales
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    
    // Configuración de videos y screenshots
    video: true,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    
    // Configuración de reportes
    reporter: 'spec',
    reporterOptions: {
      mochaFile: 'cypress/reports/test-results.xml'
    },
    
    // Configuración de archivos de prueba
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    
    // Variables de entorno
    env: {
      // Credenciales de administrador
      admin_email: 'admin@admin.com',
      admin_password: 'admin',
      
      // Datos de Mercado Pago para pruebas
      mp_user: 'TESTUSER2010833032',
      mp_password: 'B422F0BB#c839#4bbe#',
      mp_security_code: '293542',
      
      // URLs específicas (si las necesitamos)
      login_url: '/login',
      admin_url: '/admin',
      events_url: '/events'
    },
    
    setupNodeEvents(on, config) {
      // Configuración de eventos de Node.js
      
      // Plugin para generar reportes HTML
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });
      
      // Configuración para diferentes entornos
      if (config.env.environment === 'production') {
        config.baseUrl = 'https://ticketazo.com.ar';
      }
      
      return config;
    },
  },
  
  // Configuración para componentes (si los usamos más adelante)
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
});
