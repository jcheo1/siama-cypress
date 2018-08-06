describe('Inspection Suite Spec', function () {

    // Calling email and password from Cypress.json
    const email = Cypress.env('email');
    const password = Cypress.env('password');
    let assetDetailURL;
    let savedURL;
    // Get current date and time
    var currentDateTime = new Date()
    var date = (currentDateTime.getMonth() + 1) + "/" + currentDateTime.getDate() + "/" + currentDateTime.getFullYear();
    // Initialise inspectionID
    var inspectionID = `Automation Test: ${currentDateTime}`.toUpperCase();

    it('Setting up target example asset for conducting Inspection Module Test Suite', () => {

        // Log in to Auth0
        cy.loginUsingAuth0(email, password);

        // Start a server to begin routing responses to cy.route()
        cy.server()

        // Set Network Request for asset filter
        cy.route('POST', '/Asset/Filter').as('waitAssetFilter');

        // Navigate using the main navigation to the Inventory module landing screen. 
        cy.get('a > i.sm-icon-inventory').click();

        // Waiting for XHR to respond
        cy.wait('@waitAssetFilter');

        // Click Inventory in the menu panel
        cy.get('a > i.sm-icon-inventory').click();

        // Click the first Asset button we find on the Inventory list and navigate to its Asset Details screen.
        cy.get('tbody>tr').eq(0).contains('View').click();

        // Save the asset details page URL to assetDetailURL
        savedURL = cy.location().then((savedURL) => {
            assetDetailURL = savedURL;
        })

        savedURL.then(() => cy.log(`The saved URL is ${assetDetailURL}`));
    })

    context('Test starts', () => {

        // Navigate to the saved asset detail URL before each test and click inspections tab
        beforeEach('Navigate to saved asset details page and its inspection tab', () => {

            savedURL.then(() => cy.log(`The saved URL is ${assetDetailURL}`));

            // Start a server to begin routing responses to cy.route()
            cy.server();

            // Set Network Request for asset filter
            cy.route('POST', '/Asset/Filter').as('waitAssetFilter');

            // Visit the saved asset detail URL
            savedURL.then(() => cy.visit(`${assetDetailURL}`));

            // Confirm Auth0 login
            cy.get('button').click();

            // Waiting for XHR to respond
            cy.wait('@waitAssetFilter');

            // Click inspections tab
            cy.contains('Inspections').click();
        })

        // Add / edit / cancel / delete inspection details 
        context('Add / edit / cancel / delete inspection details ', () => {

            it('Cancel adding a new inspection record', () => {
                //Click to add inspeciton
                cy.contains('Add Inspection').click();

                // Input Inspection details
                // Inspection ID : Automation Test + currentDateTime and convert to uppercase
                ;
                cy.get('#inspectionId').type(inspectionID);

                // Inspection Date: current date
                cy.get('#inspectionDate').type(date);

                // Inspector: Jack Cheong
                cy.get('#name').type('Jack Cheong');

                // Start a server to begin routing responses to cy.route()
                cy.server();

                // Set Network Request for asset filter
                cy.route('POST', '/Asset/Filter').as('waitAssetFilter');

                //      Click cancel
                cy.contains('Cancel').click();

                // Waiting for XHR to respond
                cy.wait('@waitAssetFilter');

                // Click inspections tab
                cy.contains('Inspections').click();

                //  Confirm the new inspection record doesn't exist
                cy.get('body').should('not.contain', inspectionID);
            })

            // Proceed adding a new inspection record
            it('Proceed adding a new inspection record', () => {

                // Click to add inspeciton
                cy.contains('Add Inspection').click();

                // Input Inspection details
                // Inspection ID : Automation Test + currentDateTime and convert to uppercase
                cy.get('#inspectionId').type(inspectionID);

                // Inspection Date: current date
                cy.get('#inspectionDate').type(date);

                // Inspector: Jack Cheong
                cy.get('#name').type('Jack Cheong');

                // Start a server to begin routing responses to cy.route()
                cy.server();

                // Set Network Request for asset filter
                cy.route('POST', '/Asset/Filter').as('waitAssetFilter');
                cy.route('GET', '/Asset/Get').as('waitAssetGet')
                cy.route('POST', '/Inspection/Save').as('waitInspectionSave')

                //      Click Save
                cy.contains('Save & Continue').click();

                // Navigate to inspections tab in asset
                cy.wait('@waitInspectionSave').wait(2000)
            
                cy.contains('View Asset').click();
            
                cy.wait('@waitAssetFilter');
            
                cy.contains('Inspections').click();

                // Confirm added inspection record does exist
                cy.get('body').should('contain', inspectionID);
            })

            //  Edit inspection record (using newly created inspection)
            // Incomplete. Planned to edit each of the inspection details then confirm it in the Asset Details Inspections Tab
            it('Test editing inspection record details', () => {
                cy.get(`[data-cy="${inspectionID}"`).contains('Edit Inspection').click()
            })

            // The rest here is the planned script for testing the rest of the inspection module

            //  Delete the new inspection record
            //      View the added inspection record
            //      Click Delete
            //      Confirm new inspection record does not exist
            // Testing Inspection Details invalid inputs
            //      Test Inspection ID inputs (alphanumeric, special chars, alphanumeric & special chars, empty input).
            //      Test Inspection Date inputs (alphanumeric, special chars, alphanumeric & special chars, empty input, future date).
            //      Test Inspector inputs (alphanumeric, special chars, alphanumeric & special chars, empty input).
            // Add elements to inspection record
            //      Update component condition state quantities (test for negative inputs, alphanumeric and special chars).
            //      Add image to component (Successful - upload an image of type .jpeg/jpg/gif/png. upload image with size less than 20MB. Unsuccessful - upload image larger than 20MB. upload video, upload .doc or other file type).
            // Add / edit / cancel / delete inspected elements
        });



    })

});