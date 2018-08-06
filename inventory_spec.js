describe('Inventory Test Suite', function () {

    //Getting the testAssetID from cypress.json
    const assetCode = Cypress.env('testAssetId');
    const email = Cypress.env('email');
    const password = Cypress.env('password');
  
    // Login through Auth0 and navigate to the assetCode at the beginning of each test function
    beforeEach(`Navigating to assets ${assetCode}`, () => {
      cy.loginUsingAuth0(email, password); //Login through Auth0
      cy.get('a > i.sm-icon-inventory').click(); //Click Inventory in menu panel
      cy.get('#assetName').type(assetCode); //Type in asset code in search filter
      cy.get('button').contains('Search').click(); //Click search
      cy.wait(3 * 1000); //Wait to return results
      cy.get('td a#27636').contains('View').click(); //Click view to view assets page
      cy.wait(5 * 1000);
    })
  
    //Verifying the following headers on the specified asset details page
    it('Confirm assets page contains the following expected structure properties', () => {
      cy.get('h1').should('contain',assetCode);
      cy.contains('Asset Summary');
      cy.contains('HENNEPIN');
      cy.contains('SUSPENSION');
      cy.contains('Minneapolis');
    });
  
    //Verifying that the page contains an OCR value
    it('Asset page should have an ocr score', () => {
      cy.get('#testSummaryRiskGaugeOcr').then((riskGauge) => {
        const ocrScore = riskGauge.text();
        expect(ocrScore, 'ocr should be greater than 0 and less than 100').within(0, 100);
      });
    });
  
    //Verifying that the page contains a Risk Score
    it('Asset page should have a risk score', () => {
      cy.get('#testSummaryRiskScoreValue').then((riskScore) => {
        const _riskScore = riskScore.text();
        expect(_riskScore, 'risk score should be greater than 0').to.be.greaterThan(0);
      });
    });
  });