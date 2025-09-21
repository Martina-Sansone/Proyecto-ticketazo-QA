
describe('Validar cantidad de entradas',()=>{
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
            for (let i = 0; i < 3; i++){
                cy.wrap(btn).click()
            }
        })
        cy.wait(500)
        cy.get('[data-cy="btn-restar-Campo"]').click({force:true}).then((btn)=>{
            for (let i = 0; i < 3; i++){
                cy.wrap(btn).click()
            }
        });
         cy.wait(500)
        cy.get('[data-cy="btn-sumar-Platea"]').click({force:true}).then((btn)=>{
            for (let i = 0; i < 3; i++){
                cy.wrap(btn).click()
            }
        });
                cy.wait(500)

        cy.get('[data-cy="btn-restar-Platea"]').click({force:true}).then((btn)=>{
            for (let i = 0; i < 3; i++){
                cy.wrap(btn).click()
            }
        });
                cy.wait(500)

        cy.get('[data-cy="btn-sumar-Tribuna"]').click({force:true}).then((btn)=>{
            for (let i = 0; i < 3; i++){
                cy.wrap(btn).click()
            }
        });
                cy.wait(500)

        cy.get('[data-cy="btn-restar-Tribuna"]').click({force:true}).then((btn)=>{
            for (let i = 0; i < 3; i++){
                cy.wrap(btn).click()
            }
        });
        cy.wait(500)
         cy.get('[data-cy="btn-continuar"]').should('be.disabled');

    })
})