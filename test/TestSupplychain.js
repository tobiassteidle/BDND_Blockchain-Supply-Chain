// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')

contract('SupplyChain', function(accounts) {

    console.log("ganache-cli accounts used here...");
    console.log("Contract Owner: accounts[0] ", accounts[0]);
    console.log("Customer: accounts[1] ", accounts[1]);
    console.log("Backoffice: accounts[2] ", accounts[2]);
    console.log("Developer: accounts[3] ", accounts[3]);
    console.log("Reviewer: accounts[4] ", accounts[4]);
    console.log("Tester: accounts[5] ", accounts[5]);

    const unassignedID = 0x0;
    const customerID = accounts[1];
    const backofficeID = accounts[2];
    const developerID = accounts[3];
    const reviewerID = accounts[4];
    const testerID = accounts[5];

    describe('SupplyChain: Sell a new Software Feature', function() {

        const topic = "Develope a Supply Chain";
        const description = "Implement a Smart Contract an meet specifications";
        const price = 5;

        const state_New = 0;
        const state_Offered = 1;
        const state_Accepted = 2;
        const state_Developed = 3;
        const state_Reviewed = 4;
        const state_Tested = 5;
        const state_Invoiced = 6;
        const state_Payed = 7;

        var currentFeatureID = 0;

        before(async function() {

            const supplyChain = await SupplyChain.deployed();

            supplyChain.addCustomer(customerID);
            supplyChain.addBackoffice(backofficeID);
            supplyChain.addDeveloper(developerID);
            supplyChain.addReviewer(reviewerID);
            supplyChain.addTester(testerID);
        });


        it("requestFeature() - customer creates a new feature request", async() => {
            const supplyChain = await SupplyChain.deployed();

            var eventEmitted = false;
            var event = supplyChain.New();
            await event.watch((err, res) => {
                eventEmitted = true;

                currentFeatureID = res.args.fid;
            });

            // create a new feature request
            await supplyChain.requestFeature(topic, description, {from: customerID});

            assert.equal(currentFeatureID, 1, 'Error: Invalid Feature ID from Event');

            const featureInformation = await supplyChain.fetchFeature.call(currentFeatureID);
            assert.equal(featureInformation[0], 1, 'Error: Invalid Feature ID');
            assert.equal(featureInformation[1], topic, 'Error: Invalid Topic');
            assert.equal(featureInformation[2], description, 'Error: Invalid Description');
            assert.equal(featureInformation[3], 0, 'Error: Invalid Price');
            assert.equal(featureInformation[4], state_New, 'Error: Invalid State');
            assert.equal(featureInformation[5], customerID, 'Error: Invalid CustomerId');
            assert.equal(featureInformation[6], unassignedID, 'Error: Invalid BackofficeId');
            assert.equal(featureInformation[7], unassignedID, 'Error: Invalid DeveloperId');
            assert.equal(featureInformation[8], unassignedID, 'Error: Invalid ReviewerId');
            assert.equal(featureInformation[9], unassignedID, 'Error: Invalid TesterId');
            assert.equal(eventEmitted, true, 'Invalid event emitted')
        });

        it("sendOffer() - backoffice set price and send offer to customer", async() => {
            const supplyChain = await SupplyChain.deployed();

            var eventEmitted = false;
            var event = supplyChain.Offered();
            await event.watch((err, res) => {
                eventEmitted = true;
            });

            await supplyChain.sendOffer(currentFeatureID, price, {from: backofficeID});

            const featureInformation = await supplyChain.fetchFeature.call(currentFeatureID);
            assert.equal(featureInformation[0], 1, 'Error: Invalid Feature ID');
            assert.equal(featureInformation[1], topic, 'Error: Invalid Topic');
            assert.equal(featureInformation[2], description, 'Error: Invalid Description');
            assert.equal(featureInformation[3], price, 'Error: Invalid Price');
            assert.equal(featureInformation[4], state_Offered, 'Error: Invalid State');
            assert.equal(featureInformation[5], customerID, 'Error: Invalid CustomerId');
            assert.equal(featureInformation[6], backofficeID, 'Error: Invalid BackofficeId');
            assert.equal(featureInformation[7], unassignedID, 'Error: Invalid DeveloperId');
            assert.equal(featureInformation[8], unassignedID, 'Error: Invalid ReviewerId');
            assert.equal(featureInformation[9], unassignedID, 'Error: Invalid TesterId');
            assert.equal(eventEmitted, true, 'Invalid event emitted')
        });

        it("startDevelopment() - customer accept offer and development of the feature will be started", async() => {
            const supplyChain = await SupplyChain.deployed();

            var eventEmitted = false;
            var event = supplyChain.Accepted();
            await event.watch((err, res) => {
                eventEmitted = true;
            });

            await supplyChain.startDevelopment(currentFeatureID, {from: customerID});

            const featureInformation = await supplyChain.fetchFeature.call(currentFeatureID);
            assert.equal(featureInformation[0], 1, 'Error: Invalid Feature ID');
            assert.equal(featureInformation[1], topic, 'Error: Invalid Topic');
            assert.equal(featureInformation[2], description, 'Error: Invalid Description');
            assert.equal(featureInformation[3], price, 'Error: Invalid Price');
            assert.equal(featureInformation[4], state_Accepted, 'Error: Invalid State');
            assert.equal(featureInformation[5], customerID, 'Error: Invalid CustomerId');
            assert.equal(featureInformation[6], backofficeID, 'Error: Invalid BackofficeId');
            assert.equal(featureInformation[7], unassignedID, 'Error: Invalid DeveloperId');
            assert.equal(featureInformation[8], unassignedID, 'Error: Invalid ReviewerId');
            assert.equal(featureInformation[9], unassignedID, 'Error: Invalid TesterId');
            assert.equal(eventEmitted, true, 'Invalid event emitted')
        });

        it("startReview() - feature is implemented and ready for review", async() => {
            const supplyChain = await SupplyChain.deployed();

            var eventEmitted = false;
            var event = supplyChain.Developed();
            await event.watch((err, res) => {
                eventEmitted = true;
            });

            await supplyChain.startReview(currentFeatureID, {from: developerID});

            const featureInformation = await supplyChain.fetchFeature.call(currentFeatureID);
            assert.equal(featureInformation[0], 1, 'Error: Invalid Feature ID');
            assert.equal(featureInformation[1], topic, 'Error: Invalid Topic');
            assert.equal(featureInformation[2], description, 'Error: Invalid Description');
            assert.equal(featureInformation[3], price, 'Error: Invalid Price');
            assert.equal(featureInformation[4], state_Developed, 'Error: Invalid State');
            assert.equal(featureInformation[5], customerID, 'Error: Invalid CustomerId');
            assert.equal(featureInformation[6], backofficeID, 'Error: Invalid BackofficeId');
            assert.equal(featureInformation[7], developerID, 'Error: Invalid DeveloperId');
            assert.equal(featureInformation[8], unassignedID, 'Error: Invalid ReviewerId');
            assert.equal(featureInformation[9], unassignedID, 'Error: Invalid TesterId');
            assert.equal(eventEmitted, true, 'Invalid event emitted')
        });

        it("startTest() - feature is implemented, reviewed and ready for test", async() => {
            const supplyChain = await SupplyChain.deployed();

            var eventEmitted = false;
            var event = supplyChain.Reviewed();
            await event.watch((err, res) => {
                eventEmitted = true;
            });

            await supplyChain.startTest(currentFeatureID, {from: reviewerID});

            const featureInformation = await supplyChain.fetchFeature.call(currentFeatureID);
            assert.equal(featureInformation[0], 1, 'Error: Invalid Feature ID');
            assert.equal(featureInformation[1], topic, 'Error: Invalid Topic');
            assert.equal(featureInformation[2], description, 'Error: Invalid Description');
            assert.equal(featureInformation[3], price, 'Error: Invalid Price');
            assert.equal(featureInformation[4], state_Reviewed, 'Error: Invalid State');
            assert.equal(featureInformation[5], customerID, 'Error: Invalid CustomerId');
            assert.equal(featureInformation[6], backofficeID, 'Error: Invalid BackofficeId');
            assert.equal(featureInformation[7], developerID, 'Error: Invalid DeveloperId');
            assert.equal(featureInformation[8], reviewerID, 'Error: Invalid ReviewerId');
            assert.equal(featureInformation[9], unassignedID, 'Error: Invalid TesterId');
            assert.equal(eventEmitted, true, 'Invalid event emitted')
        });

        it("writeInvoice() - feature is implemented, reviewed and tested - lets write an invoice", async() => {
            const supplyChain = await SupplyChain.deployed();

            var eventEmitted = false;
            var event = supplyChain.Tested();
            await event.watch((err, res) => {
                eventEmitted = true;
            });

            await supplyChain.writeInvoice(currentFeatureID, {from: testerID});

            const featureInformation = await supplyChain.fetchFeature.call(currentFeatureID);
            assert.equal(featureInformation[0], 1, 'Error: Invalid Feature ID');
            assert.equal(featureInformation[1], topic, 'Error: Invalid Topic');
            assert.equal(featureInformation[2], description, 'Error: Invalid Description');
            assert.equal(featureInformation[3], price, 'Error: Invalid Price');
            assert.equal(featureInformation[4], state_Tested, 'Error: Invalid State');
            assert.equal(featureInformation[5], customerID, 'Error: Invalid CustomerId');
            assert.equal(featureInformation[6], backofficeID, 'Error: Invalid BackofficeId');
            assert.equal(featureInformation[7], developerID, 'Error: Invalid DeveloperId');
            assert.equal(featureInformation[8], reviewerID, 'Error: Invalid ReviewerId');
            assert.equal(featureInformation[9], testerID, 'Error: Invalid TesterId');
            assert.equal(eventEmitted, true, 'Invalid event emitted')
        });

        it("sendInvoice() - send invoice to customer", async() => {
            const supplyChain = await SupplyChain.deployed();

            var eventEmitted = false;
            var event = supplyChain.Invoiced();
            await event.watch((err, res) => {
                eventEmitted = true;
            });

            await supplyChain.sendInvoice(currentFeatureID, {from: backofficeID});

            const featureInformation = await supplyChain.fetchFeature.call(currentFeatureID);
            assert.equal(featureInformation[0], 1, 'Error: Invalid Feature ID');
            assert.equal(featureInformation[1], topic, 'Error: Invalid Topic');
            assert.equal(featureInformation[2], description, 'Error: Invalid Description');
            assert.equal(featureInformation[3], price, 'Error: Invalid Price');
            assert.equal(featureInformation[4], state_Invoiced, 'Error: Invalid State');
            assert.equal(featureInformation[5], customerID, 'Error: Invalid CustomerId');
            assert.equal(featureInformation[6], backofficeID, 'Error: Invalid BackofficeId');
            assert.equal(featureInformation[7], developerID, 'Error: Invalid DeveloperId');
            assert.equal(featureInformation[8], reviewerID, 'Error: Invalid ReviewerId');
            assert.equal(featureInformation[9], testerID, 'Error: Invalid TesterId');
            assert.equal(eventEmitted, true, 'Invalid event emitted')
        });

        it("pay() - customer pays invoice", async() => {
            const supplyChain = await SupplyChain.deployed();

            var eventEmitted = false;
            var event = supplyChain.Payed();
            await event.watch((err, res) => {
                eventEmitted = true;
            });

            await supplyChain.pay(currentFeatureID, {from: customerID, value: price, gasPrice:0});

            const featureInformation = await supplyChain.fetchFeature.call(currentFeatureID);
            assert.equal(featureInformation[0], 1, 'Error: Invalid Feature ID');
            assert.equal(featureInformation[1], topic, 'Error: Invalid Topic');
            assert.equal(featureInformation[2], description, 'Error: Invalid Description');
            assert.equal(featureInformation[3], price, 'Error: Invalid Price');
            assert.equal(featureInformation[4], state_Payed, 'Error: Invalid State');
            assert.equal(featureInformation[5], customerID, 'Error: Invalid CustomerId');
            assert.equal(featureInformation[6], backofficeID, 'Error: Invalid BackofficeId');
            assert.equal(featureInformation[7], developerID, 'Error: Invalid DeveloperId');
            assert.equal(featureInformation[8], reviewerID, 'Error: Invalid ReviewerId');
            assert.equal(featureInformation[9], testerID, 'Error: Invalid TesterId');
            assert.equal(eventEmitted, true, 'Invalid event emitted')
        });

    });

});
