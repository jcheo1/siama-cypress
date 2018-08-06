describe('SIAMA Assets test script', function () {
    const email = Cypress.env('email')
    const password = Cypress.env('password')
    const user = email.split('@')[0];


    //Logging in through Auth0 before each test starts
    beforeEach('Log in', () => {
        cy.loginUsingAuth0(email, password)
    })

    context('Menu', function () {

        // Checking the following menu items exist on the menu panel
        it('Confirm modules names exist in the menu panel', function () {
            cy.get('.table-of-contents > div').eq(0).should('contain', 'Dashboard')
            cy.get('.table-of-contents > div').eq(1).should('contain', 'Inventory')
            cy.get('.table-of-contents > div').eq(2).should('contain', 'Inspection')
            cy.get('.table-of-contents > div').eq(3).should('contain', 'Maintenance')
            cy.get('.table-of-contents > div').eq(4).should('contain', 'Planner')
            cy.get('.table-of-contents > div').eq(5).should('contain', 'Records')
        })
    })

    context('Dashboard', function () {

        // Extract the username from the email
        const user = email.split('@')[0];

        // Confirming the following items are listed on the Dashboard page
        it(`Dashboard should contain all widgets on the page`, function () {
            // Start a server to begin routing responses to cy.route()
            cy.server()

            // Set Network Request for asset filter
            cy.route('POST', '/Asset/Filter').as('waitAssetFilter')

            // Waiting for XHR to respond
            cy.wait('@waitAssetFilter');

            // Confirming the following widgets exist on the dashboard
            cy.contains("Overall Condition Rating")
            cy.contains("Health Distribution")
            cy.contains("Asset Map")
            cy.contains("OCR Forecast")
            cy.contains("Maintenance Budgets")
            cy.contains("Assets at Risk")
            cy.contains("Upcoming Inspections")
           

            // Confirming the username is correct
            // Experimenting with .get() functions
            cy.get('.btn-info').should('contain', user)
            cy.get('.btn-xs').should('contain', '7258')
            cy.get('.table-striped').should('contain', 'Date Due')
        })

        // root returns the highest ancestor in html
        it('Experimenting the .root() function', function () {
            cy.root().should('match', 'html')
            cy.get('#map').within(function () {
                cy.root().should('have.class', 'well')
            })
        })
    })

    context('Inventory', function () {

        // In addition to logging in through Auth0 before each script, 
        // the test should select the inventory on the menu panel before each test in the Inventory context
        beforeEach(function () {
            cy.get('a > i.sm-icon-inventory').click();
        })


        it('Verify default Inventory asset search list', function () {

            // Start a server to begin routing responses to cy.route()
            cy.server()

            // Set Network Request for asset filter
            cy.route('POST', '/Asset/Filter').as('waitAssetFilter')

            // Waiting for XHR to respond
            cy.wait('@waitAssetFilter');

            // By default the list returns the following first three items in order: 27638, 90585, 27B88
            cy.get('tbody>tr').eq(0).should('contain', '27638')
            cy.get('tbody>tr').eq(1).should('contain', '90585')
            cy.get('tbody>tr').eq(2).should('contain', '27B88')
        })

        it('Ensuring that each asset within an asset page is accessible by the user', () => {
            // Typing the following asset code in the asset filter
            cy.get('#assetName').type('27638');

            // Click search
            cy.get('button').contains('Search').click();

            // Waiting 3 seconds
            cy.wait(3 * 1000)

            // Selecting to view the asset details page of the selected asset
            cy.get('td a#27638').should('contain', 'View').click()

            cy.wait(3 * 1000)

            //Selecting to view a sub-asset details page of the asset
            cy.get('td a#27638-38').should('contain', 'View').click()

            cy.wait(3 * 1000)

            //Selecting to view a sub-asset details page of the sub-asset
            cy.get('a#27638-38-510').should('contain', 'View').click()

            //Confirming the breadcrumb listing the following phrases
            cy.get('siama-breadcrumb').children('ul').should('contain', 'Deck Wearing Surface')
            cy.get('siama-breadcrumb').children('ul').should('contain', 'Reinforced')
            cy.get('siama-breadcrumb').children('ul').should('contain', '27638')
            cy.get('siama-breadcrumb').children('ul').should('contain', 'Inventory')

            //Experienting with .closest() function
            cy.get('.nav-item').closest('ul').should('have.class', 'nav nav-tabs')
            cy.get('.sm-view-records').closest('tab').should('have.class', 'well clearfix active tab-pane')
        })
    })

    context('Maintenance', function () {

        // Before each test in the Maintenance context, go to maintenance planner
        beforeEach(function () {
            cy.get('.sm-icon-maintenance').click()
            cy.get('.glyphicon-pencil').click()
        })

        // Testing what happens when Scenario Name is saved without inputting a name
        it('Add Scenario', function () {
            
            //Confirm the page is Maintenance Planner
            cy.get('section.well').should('contain', 'Scenarios')

            //Click Add Scenario
            cy.get('.btn-primary.btn-xs.pull-right').should('contain', 'Add Scenario').click()

            //Click Save without inputting a name
            cy.get('button[type=submit]').should('contain', 'Save').click()

            // By clicking Save without inputting a name, there should be an error requiring you to input a name
            cy.get('.alert-danger').should('contain', 'Name is required')

            // Entering a proper name for the Scenario
            cy.get('#name').type('Cypress Test Name #1')

            // Click save
            cy.get('button[type=submit]').should('contain', 'Save').click()
        })

        // Unfinished. Check confluence for the full test plans for each module in SIAMA Assets
        it('Edit Scenario', function () {

            //Confirming page contains the phrase "scenarios"
            cy.get('section.well').should('contain', 'Scenarios')
        })

    })









});