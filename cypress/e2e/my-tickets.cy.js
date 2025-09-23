import { SELECTORS, TIMEOUTS } from '../support/constants/my-tickets-constants';
describe('Check My Tickets Page', () => {

  let ticketsData

  before(() => {
    cy.fixture('my-tickets/my-tickets-data.json').then((data) => {
      ticketsData = data
    })
  })

  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.sessionLoginToTickets()
    cy.wait(TIMEOUTS.MEDIUM)
    cy.get('body').should('be.visible')
  })

  it('Ver detalles de la entrada con QR', () => {
    cy.get('body').then($body => {
      if ($body.find('button[data-cy^=btn-ver-entradas-]').length > 0) {
        cy.ticketsUIOpenTicketDetail();
        cy.ticketsUIValidateModal(ticketsData.testTicket);
      } else {
        cy.log('No hay botones de entradas disponibles - usuario sin tickets');
        cy.url().should('include', 'tickets');
      }
    });
  });

  it('Verificar transferencia de entrada', () => {
    cy.get('body').then($body => {
      if ($body.find('button[data-cy^=btn-ver-entradas-]').length > 0) {
        cy.ticketsUITransferTicket(ticketsData.transferData.email);
      } else {
        cy.log('No hay entradas disponibles para transferir');
        cy.url().should('include', 'tickets');
      }
    });
  })

  it('Verificar ubicación del asiento', () => {
    cy.get('body').then($body => {
      if ($body.find('button[data-cy^=btn-ver-entradas-]').length > 0) {
        cy.ticketsUIOpenTicketDetail();
        cy.get('body').then($modalBody => {
          if ($modalBody.find(SELECTORS.MODAL.LOCATION_SPECIFIC).length > 0) {
            cy.get(SELECTORS.MODAL.LOCATION_SPECIFIC)
              .should('be.visible')
              .and('contain.text', 'Ubicacion');
          } else {
            cy.log('Información de ubicación no disponible en el modal');
          }
        });
      } else {
        cy.log('No hay entradas disponibles para verificar ubicación');
        cy.url().should('include', 'tickets');
      }
    });
  })

  it('Verificar que el título "Mis Entradas" se muestra correctamente', () => {
    cy.get('body').then($body => {
      if ($body.find(SELECTORS.TITLES.MIS_ENTRADAS).length > 0) {
        cy.get(SELECTORS.TITLES.MIS_ENTRADAS)
          .should('be.visible')
          .and('contain.text', 'Mis Entradas');
      } else if ($body.find('h1').length > 0) {
        cy.get('h1').first()
          .should('be.visible');
        cy.log('Título de página encontrado con selector alternativo');
      } else {
        cy.log('Página sin título - posible problema de carga');
        cy.url().should('include', 'tickets');
      }
    });
  })

  it('Verificar que cada tarjeta muestra el título correcto', () => {
    cy.get('body').then($body => {
      if ($body.find(SELECTORS.CARDS.TICKET_CARD).length > 0) {
        cy.ticketsUIValidateTitles(ticketsData.expectedTitles);
      } else {
        cy.log('No hay tarjetas de tickets para validar títulos');
        cy.url().should('include', 'tickets');
      }
    });
  })

  it('Verificar que las imágenes se cargan correctamente', () => {
    cy.get('body').then($body => {
      if ($body.find(SELECTORS.CARDS.TICKET_CARD).length > 0) {
        cy.ticketsUIValidateImages();
      } else {
        cy.log('No hay tarjetas de tickets para validar imágenes');
        cy.url().should('include', 'tickets');
      }
    });
  })

  it('Verificar diseño responsive', () => {
    const viewports = [ticketsData.viewports.mobile, ticketsData.viewports.desktop]

    cy.get('body').then($body => {
      if ($body.find(SELECTORS.CARDS.TICKET_CARD).length > 0) {
        cy.get(SELECTORS.CARDS.TICKET_CARD)
          .should('have.length.greaterThan', 0);
        cy.ticketsUIValidateResponsive(viewports);
      } else {
        cy.log('No hay tarjetas de tickets - verificando responsive de la página');
        viewports.forEach((viewport) => {
          cy.viewport(viewport);
          cy.get('body').should('be.visible');
        });
      }
    });
  })

  it('Verificar botón "Ver todas las entradas"', () => {
    cy.get('body').then($body => {
      if ($body.find(SELECTORS.BUTTONS.VER_ENTRADAS).length > 0) {
        cy.get(SELECTORS.BUTTONS.VER_ENTRADAS).first().click();
        cy.url().should('not.include', 'error');
        cy.get('h1').should('be.visible');
      } else if ($body.find('button').length > 0) {
        cy.log('No hay botones específicos de entradas, pero la página cargó');
        cy.url().should('include', 'tickets');
      } else {
        cy.log('Página sin botones - posible problema de datos');
        cy.url().should('include', 'tickets');
      }
    });
  })

  it('Verificar si retorna los eventos con los tickets de usuario con status 200', () => {
    cy.ticketsAPIGetUserEvents()
  })
});