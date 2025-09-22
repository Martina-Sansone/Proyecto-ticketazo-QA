import { API, SELECTORS, TIMEOUTS } from '../support/constants/my-tickets-constants'
describe('Check My Tickets Page', () => {

  let ticketsData

  before(() => {
    cy.fixture('my-tickets/my-tickets-data.json').then((data) => {
      ticketsData = data
    })
  })

  beforeEach(() => {
    cy.sessionLoginToTickets()
    cy.wait(TIMEOUTS.MEDIUM)
  })

  it('Ver detalles de la entrada con QR', () => {
    cy.ticketsUIOpenTicketDetail();
    cy.ticketsUIValidateModal(ticketsData.testTicket);
  });

  it('Verificar transferencia de entrada', () => {
    cy.ticketsUITransferTicket(ticketsData.transferData.email)
  })

  it('Verificar ubicación del asiento', () => {
    cy.ticketsUIOpenTicketDetail()
    cy.get(SELECTORS.MODAL.LOCATION_SPECIFIC)
      .should('be.visible')
      .and('have.text', ticketsData.testTicket.location)
  })

  it('Verificar que el título "Mis Entradas" se muestra correctamente', () => {
    cy.get(SELECTORS.TITLES.MIS_ENTRADAS)
      .should('be.visible')
      .and('have.text', 'Mis Entradas')
  })

  it('Verificar que cada tarjeta muestra el título correcto', () => {
    cy.ticketsUIValidateTitles(ticketsData.expectedTitles)
  })

  it('Verificar que las imágenes se cargan correctamente', () => {
    cy.ticketsUIValidateImages()
  })

  it('Verificar diseño responsive', () => {
    const viewports = [ticketsData.viewports.mobile, ticketsData.viewports.desktop]

    cy.get(SELECTORS.CARDS.TICKET_CARD)
      .should('have.length.greaterThan', 0)

    cy.ticketsUIValidateResponsive(viewports)
  })

  it('Verificar botón "Ver todas las entradas"', () => {
    cy.get(SELECTORS.BUTTONS.VER_ENTRADAS).eq(0).click()
    cy.url().should('not.include', 'error')
    cy.get('h1').should('be.visible')
  })

  it('Verificar si retorna los eventos con los tickets de usuario con status 200', () => {
    cy.ticketsAPIGetUserEvents()
  })
});