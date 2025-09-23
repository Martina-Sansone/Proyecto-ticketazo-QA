export const BASE_URL = 'https://vps-3696213-x.dattaweb.com';

export const URL_MY_TICKETS = `${BASE_URL}/tickets/list`;

export const API = {
  USER_EVENTS: '/api/backend/events/dataEvent',
  UPLOADS: '/api/uploads'
}

export const TEST_IDS = {
  USER_ID: 12,
  EVENT_ID: 4,
  TICKET_ID: 2564
}

export const TIMEOUTS = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 15000
}

export const SELECTORS = {
  TITLES: {
    MIS_ENTRADAS: 'h1[data-cy=titulo-mis-entradas]'
  },
  CARDS: {
    TICKET_CARD: 'div[data-cy^=ticket-card-]',
    TICKET_TITLE: 'p[data-cy=ticket-titulo]',
    TICKET_IMAGE: 'img[data-cy=ticket-imagen]'
  },
  BUTTONS: {
    VER_ENTRADAS: 'button[data-cy^=btn-ver-entradas-]',
    VER_ENTRADAS_4: 'button[data-cy=btn-ver-entradas-4]',
    VER_TICKET_2564: 'button[data-cy=btn-ver-ticket-2564]'
  },
  MODAL: {
    TICKET_DETALLE: 'section[data-cy=modal-ticket-detalle]',
    TITLE: 'section[data-cy=modal-ticket-detalle] h1',
    IMAGE: 'section[data-cy=modal-ticket-detalle] img',
    LOCATION: 'section[data-cy=modal-ticket-detalle] p',
    LOCATION_SPECIFIC: '.jsx-5f8db642f9d65369.text-lg.opacity-90.font-bold'
  },
  TRANSFER: {
    TRANSFER_BUTTON: 'button:contains("Transferir Entrada")',
    EMAIL_INPUT: 'div input[id=email]',
    CONFIRM_BUTTON: 'section[role=dialog] footer button:contains("Transferir")'
  }
};