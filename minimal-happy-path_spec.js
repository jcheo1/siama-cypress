describe('Minimal Happy Path Test Suite', function () {

    const email = Cypress.env('email');
    const password = Cypress.env('password');

    it('ensure connectivity with Works and AI by ensuring OCR in Inventory Asset Detail is within a valid range', function () {

        // Redirect to Auth0, login successfully and redirect back to the Dashboard.
        cy.loginUsingAuth0(email, password);

        // Start a server to begin routing responses to cy.route()
        cy.server()

        // Set Network Request for asset filter
        cy.route('POST', '/Asset/Filter').as('waitAssetFilter')

        // Navigate using the main navigation to the Inventory module landing screen. 
        cy.get('a > i.sm-icon-inventory').click();

        // Waiting for XHR to respond
        cy.wait('@waitAssetFilter');

        // Click the first Asset button we find on the Inventory list and navigate to its Asset Details screen.
        cy.get('tbody>tr').eq(0).contains('View').click();

        // Waiting for XHR to respond
        cy.wait('@waitAssetFilter');

        // Due to a bug in the system, the page is calling Asset Filter twice, remove this statement once SASS-1079 is fixed
        cy.wait('@waitAssetFilter');

        // Capture the value within the OCR risk gauge widget which has been sourced from AI via Works and ensure it falls within a valid computed range.  
        cy.get('#testSummaryRiskGaugeOcr').then((riskGauge) => {
            const ocrScore = riskGauge.text();
            cy.log(`OCR Value is ${ocrScore}`)
            expect(ocrScore, 'OCR should be greater than 0 and less than 100').to.be.at.least(0).and.most(100);
        });
    });
});