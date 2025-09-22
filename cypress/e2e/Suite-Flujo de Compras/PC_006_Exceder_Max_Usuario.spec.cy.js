
describe('Validar cantidad de entradas maxima',()=>{
    beforeEach(()=>{
        cy.loginAsAdmin();
    })
    it('Validar cantidad de entrada', ()=>{
        cy.visit("https://vps-3696213-x.dattaweb.com");
                cy.get('[data-cy="btn-ver-evento-6"]').click()
         cy.get('button[class*="bg-primary"][class*="text-primary-foreground"]')
        .contains('Adquirir', { matchCase: false })
        .click({ force: true });
        cy.get('[data-cy="btn-sumar-Campo"]').then((btn)=>{
            for (let i = 0; i <4 ; i++){
                cy.wrap(btn).click()
            }
        })
        cy.wait(500)
         cy.get('[data-cy="maximo-entradas"]').should("be.visible")
         cy.get('[data-cy="btn-sumar-Campo"]').should("be.disabled")
         cy.get('[data-cy="btn-sumar-Platea"]').should("be.disabled")
         cy.get('[data-cy="btn-sumar-Tribuna"]').should("be.disabled")

    })
})