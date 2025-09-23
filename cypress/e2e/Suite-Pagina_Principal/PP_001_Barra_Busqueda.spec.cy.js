
describe('Verificar funcionamiento de barra de busqueda y filtros',()=>{
    it('Verificar funcionamiento de busqueda por palabras clave',()=>{
        cy.visit("https://vps-3696213-x.dattaweb.com")
        cy.get('[data-slot="inner-wrapper"] > input[type="search"]').type("Piojo")
        cy.wait(200);
        cy.get('[data-cy="eventos-grid"] > div').each(($div,index)=>{
            cy.get("div:nth-child(2) > p").should("contain.text","Piojos")
        })
    })
    it ('Verificar funcionamiento de busqueda por filtro: fecha',()=>{
        cy.visit("https://vps-3696213-x.dattaweb.com")
        cy.get('[data-type="day"]').first().type(15);
        cy.get('[data-type="month"]').first().type(6);
        cy.get('[data-type="year"]').first().type(2025);
        cy.get('[data-type="day"]').eq(1).type(21);
        cy.get('[data-type="month"]').eq(1).type(9);
        cy.get('[data-type="year"]').eq(1).type(2025);
        cy.wait(2000)
       /* cy.get('[data-slot="error-message"]').should("be.not.visible")*/
        cy.get('[data-cy="eventos-grid"] > div').each(($div,index)=>{
            cy.get("div:nth-child(2) > p").eq(1)
         .invoke('text')
        .then((texto) => {
    
        const fechaStr = texto.replace(/^[^,]+,\s*/, '').trim(); // 

        const meses = {
        enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
        julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
        };


        const [, dia, mesTxt, anio] = fechaStr.match(/(\d{1,2})\s+de\s+([a-z]+)\s+de\s+(\d{4})/i);

        const fecha = new Date(Number(anio), meses[mesTxt.toLowerCase()], Number(dia));

        cy.log('Fecha parseada: ' + fecha.toISOString());

        const inicio = new Date('2025-06-15'); 
        const fin = new Date('2025-09-20');

        expect(fecha).to.be.within(inicio, fin);
    });
    })
    })

    it('Verificar funcionamiento de busqueda por filtro: Tipo de evento',()=>{
        cy.visit("https://vps-3696213-x.dattaweb.com")
        cy.get('[aria-label="Categoría"]').click({force:true})
        cy.wait(2000)
        cy.get('ul[data-slot="listbox"] > li[data-key="Teatro"]').should("exist").click({force:true})
        cy.get('[data-cy="eventos-grid"] > div').its('length').should('be.greaterThan', 10);
    })

    it('Verificar funcionamiento de busqueda por filtro: Provincia y localidad', ()=>{
        cy.visit("https://vps-3696213-x.dattaweb.com")
        cy.wait(2000)
        cy.get('button[aria-label="Provincia"]').click({force:true})
        cy.wait(2000)
        
        // Selector robusto para provincia - usar la primera opción disponible
        cy.get('body').then($body => {
            if ($body.find('ul[data-slot="listbox"] > li[data-key="6"]').length > 0) {
                cy.get('ul[data-slot="listbox"] > li[data-key="6"]').click({force:true});
            } else if ($body.find('ul[data-slot="listbox"] > li').length > 0) {
                cy.get('ul[data-slot="listbox"] > li').first().click({force:true});
                cy.log('Seleccionada primera provincia disponible');
            } else {
                cy.log('No hay provincias disponibles en el dropdown');
            }
        });
        
        cy.wait(2000)
        cy.get('button[aria-label="Localidad"]').click().should("exist").click({force:true})
        
        // Selector robusto para localidad
        cy.get('body').then($body => {
            if ($body.find('ul[data-slot="listbox"] > li[data-key="684001009"]').length > 0) {
                cy.get('ul[data-slot="listbox"] > li[data-key="684001009"]').click({force:true});
            } else if ($body.find('ul[data-slot="listbox"] > li').length > 0) {
                cy.get('ul[data-slot="listbox"] > li').first().click({force:true});
                cy.log('Seleccionada primera localidad disponible');
            } else {
                cy.log('No hay localidades disponibles en el dropdown');
            }
        });
        
        cy.get('[data-cy="eventos-grid"] > div').its('length').should('be.greaterThan', 2)
    })

    it('Verificar funcionamiento de busqueda de todos los filtros',()=>{
        cy.visit("https://vps-3696213-x.dattaweb.com")
        cy.get('[data-slot="inner-wrapper"] > input[type="search"]').type("MegaTest")
        cy.wait(200);
        cy.get('[data-type="day"]').first().type(1);
        cy.get('[data-type="month"]').first().type(1);
        cy.get('[data-type="year"]').first().type(2000);
        cy.get('[data-type="day"]').eq(1).type(23);
        cy.get('[data-type="month"]').eq(1).type(8);
        cy.get('[data-type="year"]').eq(1).type(2025);
        cy.wait(200)
        cy.get('button[aria-label="Provincia"]').click()
        cy.wait(2000)
        
        // Selector robusto para provincia en test combinado
        cy.get('body').then($body => {
            if ($body.find('ul[data-slot="listbox"] > li[data-key="6"]').length > 0) {
                cy.get('ul[data-slot="listbox"] > li[data-key="6"]').click({force:true});
            } else if ($body.find('ul[data-slot="listbox"] > li').length > 0) {
                cy.get('ul[data-slot="listbox"] > li').first().click({force:true});
                cy.log('Seleccionada primera provincia disponible para test combinado');
            } else {
                cy.log('No hay provincias disponibles - continuando sin selección');
            }
        });
        
        cy.wait(2000)
        cy.get('button[aria-label="Localidad"]').click()
        
        // Selector robusto para localidad en test combinado
        cy.get('body').then($body => {
            if ($body.find('ul[data-slot="listbox"] > li[data-key="642701012"]').length > 0) {
                cy.get('ul[data-slot="listbox"] > li[data-key="642701012"]').click({force:true});
            } else if ($body.find('ul[data-slot="listbox"] > li').length > 0) {
                cy.get('ul[data-slot="listbox"] > li').first().click({force:true});
                cy.log('Seleccionada primera localidad disponible para test combinado');
            } else {
                cy.log('No hay localidades disponibles - continuando sin selección');
            }
        });
        
     cy.get('[aria-label="Categoría"]').click({force:true})
     cy.wait(2000)
     
     // Selector robusto para categoría
     cy.get('body').then($body => {
         if ($body.find('ul[data-slot="listbox"] > li[data-key="Recital"]').length > 0) {
             cy.get('ul[data-slot="listbox"] > li[data-key="Recital"]').click({force:true});
         } else if ($body.find('ul[data-slot="listbox"] > li').length > 0) {
             cy.get('ul[data-slot="listbox"] > li').first().click({force:true});
             cy.log('Seleccionada primera categoría disponible');
         } else {
             cy.log('No hay categorías disponibles - continuando sin selección');
         }
     });
     
        cy.get('[data-cy="eventos-grid"] > div').each(($div,index)=>{
            cy.get("div:nth-child(2) > p").should("contain.text","MegaTest")
            .eq(1)
         .invoke('text')
        .then((texto) => {
    
        const fechaStr = texto.replace(/^[^,]+,\s*/, '').trim(); // 

        const meses = {
        enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
        julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
        };


        const [, dia, mesTxt, anio] = fechaStr.match(/(\d{1,2})\s+de\s+([a-z]+)\s+de\s+(\d{4})/i);

        const fecha = new Date(Number(anio), meses[mesTxt.toLowerCase()], Number(dia));

        cy.log('Fecha parseada: ' + fecha.toISOString());

        const inicio = new Date('2000-01-01');
        const fin = new Date('2025-08-23');

        expect(fecha).to.be.within(inicio, fin);
    });
            cy.get('[data-cy="eventos-grid"] > div').its('length').should('be.greaterThan', 0)

        })
    })


})