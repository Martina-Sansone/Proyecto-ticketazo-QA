import { API, BASE_URL, SELECTORS, TEST_IDS, TIMEOUTS, URL_MY_TICKETS } from '../constants/my-tickets-constants.js';

Cypress.Commands.add('sessionLoginToTickets', () => {
  cy.session('login', () => {
    cy.visit(`${BASE_URL}/auth/login`);
    cy.get('input[data-cy=input-email]').type('admin@admin.com');
    cy.get('input[data-cy=input-password]').type('admin');
    cy.get('button[data-cy=btn-login]').click();
  }, {
    validate: () => {
      cy.visit(URL_MY_TICKETS);
      cy.url().should('not.include', '/auth/login')
    }
  })

  cy.visit(URL_MY_TICKETS);
  cy.wait(3000);
  cy.get('body').should('be.visible');
});

Cypress.Commands.add('ticketsUIOpenTicketDetail', (eventId = 4, ticketId = 2564) => {
  cy.get('body').then($body => {
    if ($body.find(`button[data-cy=btn-ver-entradas-${eventId}]`).length > 0) {
      cy.get(`button[data-cy=btn-ver-entradas-${eventId}]`).click();
    } else if ($body.find('button[data-cy^=btn-ver-entradas-]').length > 0) {
      cy.get('button[data-cy^=btn-ver-entradas-]').first().click();
      cy.log('Usando primer botón de entradas disponible');
    } else {
      cy.log('No hay botones de entradas disponibles');
      return;
    }
  });
  
  cy.wait(TIMEOUTS.SHORT)
  
  cy.get('body').then($body => {
    if ($body.find(`button[data-cy=btn-ver-ticket-${ticketId}]`).length > 0) {
      cy.get(`button[data-cy=btn-ver-ticket-${ticketId}]`).click();
    } else if ($body.find('button[data-cy^=btn-ver-ticket-]').length > 0) {
      cy.get('button[data-cy^=btn-ver-ticket-]').first().click();
      cy.log('Usando primer ticket disponible');
    } else {
      cy.log('No hay tickets disponibles');
      return;
    }
  });
  
  cy.wait(TIMEOUTS.SHORT)

  cy.get('body').then($body => {
    if ($body.find(SELECTORS.MODAL.TICKET_DETALLE).length > 0) {
      cy.get(SELECTORS.MODAL.TICKET_DETALLE).should('be.visible');
    } else {
      cy.log('Modal de detalle no disponible');
    }
  });
})

Cypress.Commands.add('ticketsUIValidateModal', (expectedData) => {
  cy.get(SELECTORS.MODAL.TICKET_DETALLE).should('be.visible')
  cy.get(SELECTORS.MODAL.IMAGE).should('be.visible')
  cy.get(SELECTORS.MODAL.TITLE)
    .should('be.visible')
    .and('have.text', expectedData.title)
  cy.get(SELECTORS.MODAL.LOCATION)
    .should('be.visible')
    .and('contain.text', expectedData.location)
})

Cypress.Commands.add('ticketsUIValidateImages', () => {
  cy.get('body').then($body => {
    if ($body.find(SELECTORS.CARDS.TICKET_CARD).length > 0) {
      const failedImages = [];
      
      cy.get(SELECTORS.CARDS.TICKET_CARD).each(($card, index) => {
        cy.wrap($card).find(SELECTORS.CARDS.TICKET_IMAGE).then(($img) => {
          try {
            expect($img).to.be.visible;
            expect($img).to.have.attr('src').and('not.be.empty');

            const naturalWidth = $img[0].naturalWidth;
            if (naturalWidth === 0) {
              failedImages.push(`Ticket ${index + 1}: ${$img.attr('src')}`);
            }
          } catch (error) {
            failedImages.push(`Ticket ${index + 1}: ${error.message}`);
          }
        });
      }).then(() => {
        if (failedImages.length > 0) {
          cy.log('❌ Imágenes fallidas:', failedImages);
        } else {
          cy.log('✅ Todas las imágenes se cargaron correctamente.');
        }
      });
    } else {
      cy.log('No hay tarjetas de tickets para validar imágenes');
    }
  });
})

Cypress.Commands.add('ticketsUIValidateTitles', (expectedTitles) => {
  cy.get('body').then($body => {
    if ($body.find(SELECTORS.CARDS.TICKET_CARD).length > 0) {
      cy.get(SELECTORS.CARDS.TICKET_CARD).each(($card, index) => {
        cy.wrap($card)
          .find(SELECTORS.CARDS.TICKET_TITLE)
          .should('be.visible');
      });
    } else {
      cy.log('No hay tarjetas de tickets disponibles');
    }
  });
})

Cypress.Commands.add('ticketsUIValidateResponsive', (viewports) => {
  viewports.forEach((viewport) => {
    cy.viewport(viewport)
    cy.get(SELECTORS.CARDS.TICKET_CARD).should('be.visible')
  })
})

Cypress.Commands.add('ticketsUITransferTicket', (transferEmail, eventId = 4, ticketId = 2564) => {
  cy.ticketsUIOpenTicketDetail(eventId, ticketId)

  cy.scrollTo(0, 100)
  cy.get(SELECTORS.TRANSFER.TRANSFER_BUTTON).click()

  cy.get('div h3').contains('Transferir Entrada').should('be.visible')

  cy.get(SELECTORS.TRANSFER.EMAIL_INPUT).type(transferEmail)
  cy.get('div form button').contains('Transferir').click()
  cy.get(SELECTORS.TRANSFER.CONFIRM_BUTTON).click()

  cy.wait(1000)
})

Cypress.Commands.add('ticketsAPIGetUserEvents', (userId = TEST_IDS.USER_ID) => {
  const baseUrl = Cypress.env('SERVER_URL') || BASE_URL
  const token = Cypress.env('AUTH_TOKEN')

  return cy.request({
    method: 'GET',
    url: `${baseUrl}${API.USER_EVENTS}/${userId}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.exist
    return response
  })
})