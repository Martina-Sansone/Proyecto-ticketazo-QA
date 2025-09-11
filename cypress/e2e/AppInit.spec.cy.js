 // cypress/e2e/00_app_init.spec.js

describe('Ticketazo - Inicialización de la aplicación', () => {
  context('Carga inicial', () => {
    it('Debería cargar la aplicación y mostrar elementos base', () => {
      // Abre la URL base
      cy.visit('https://vps-3696213-x.dattaweb.com/')

      // Verifica el título de la pestaña
      cy.title().should('include', 'Ticketazo')

      // Verifica que aparezca el logo o ícono principal (loader o header)
      cy.get('img[alt="Cargando..."], link[rel="icon"]').should('exist')
    })
  })
})
