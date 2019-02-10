App = {
    web3Provider: null,
    contracts: {},

    init: async function () {
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='/build/contracts/SupplyChain.json';

        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);

            App.fetchEvents();
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));

        switch (processId) {
            case 1:
                console.log('processId ', processId, ' process: "Fetch"');
                return await App.fetchFeature(event);
                break;

            case 2:
                console.log('processId ', processId, ' process: "Add Customer"');
                return await App.addCustomer(event);
                break;

            case 3:
                console.log('processId ', processId, ' process: "Add Backoffice"');
                return await App.addBackoffice(event);
                break;

            case 4:
                console.log('processId ', processId, ' process: "Add Developer"');
                return await App.addDeveloper(event);
                break;

            case 5:
                console.log('processId ', processId, ' process: "Add Reviewer"');
                return await App.addReviewer(event);
                break;

            case 6:
                console.log('processId ', processId, ' process: "Add Tester"');
                return await App.addTester(event);
                break;

            case 7:
                console.log('processId ', processId, ' process: "Request new Feature"');
                return await App.requestFeature(event);
                break;

            case 8:
                console.log('processId ', processId, ' process: "Send offer"');
                return await App.sendOffer(event);
                break;

            case 9:
                console.log('processId ', processId, ' process: "Start development"');
                return await App.startDevelopment(event);
                break;

            case 10:
                console.log('processId ', processId, ' process: "Start review"');
                return await App.startReview(event);
                break;

            case 11:
                console.log('processId ', processId, ' process: "Start test"');
                return await App.startTest(event);
                break;

            case 12:
                console.log('processId ', processId, ' process: "Write invoice"');
                return await App.writeInvoice(event);
                break;

            case 13:
                console.log('processId ', processId, ' process: "Send invoice"');
                return await App.sendInvoice(event);
                break;

            case 14:
                console.log('processId ', processId, ' process: "Pay"');
                return await App.pay(event);
                break;
        }
    },

    fetchFeature: function(event) {
        event.preventDefault();

        const featureId = $("#feature_id").val();


        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.fetchFeature(featureId);
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('fetchFeature',result);

            $("#fetch_topic").val(result[1]);
            $("#fetch_description").val(result[2]);
            $("#fetch_price").val(web3.fromWei(result[3], "ether"));

            switch (result[4].c[0]) {
                case 0:
                    $("#fetch_state").val("New");
                    break;

                case 1:
                    $("#fetch_state").val("Offered");
                    break;

                case 2:
                    $("#fetch_state").val("Accepted");
                    break;

                case 3:
                    $("#fetch_state").val("Developed");
                    break;

                case 4:
                    $("#fetch_state").val("Reviewed");
                    break;

                case 5:
                    $("#fetch_state").val("Tested");
                    break;

                case 6:
                    $("#fetch_state").val("Invoiced");
                    break;

                case 7:
                    $("#fetch_state").val("Payed");
                    break;
            }

            $("#fetch_customer_id").val(result[5]);
            $("#fetch_backoffice_id").val(result[6]);
            $("#fetch_developer_id").val(result[7]);
            $("#fetch_reviewer_id").val(result[8]);
            $("#fetch_tester_id").val(result[9]);


        }).catch(function(err) {
            console.log(err.message);
        });
    },

    addCustomer: function(event) {
        event.preventDefault();

        const customerId = $("#customerId").val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.addCustomer(customerId, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('addCustomer',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    addBackoffice: function(event) {
        event.preventDefault();

        const backofficeId = $("#backofficeId").val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.addBackoffice(backofficeId, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('addBackoffice',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    addDeveloper: function(event) {
        event.preventDefault();

        const developerId = $("#developerId").val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.addDeveloper(developerId, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('addDeveloper',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    addReviewer: function(event) {
        event.preventDefault();

        const reviewerId = $("#reviewerId").val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.addReviewer(reviewerId, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('addReviewer',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    addTester: function(event) {
        event.preventDefault();

        const testerId = $("#testerId").val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.addTester(testerId, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('testerId',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    requestFeature: function(event) {
        event.preventDefault();

        const topic = $("#topic").val();
        const description = $("#description").val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.requestFeature(topic, description, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('requestFeature',result);

            const featureId = result.logs[0].args.fid.c[0];
            console.log('new Feature Id', featureId);

            $("#new_feature_id").text('New Feature Id ' + featureId);

            if (confirm('Should the FeatureId be adjusted in the input fields of the workflow?')) {
                $("#feature_id").val(featureId);
                $("#offer_feature_id").val(featureId);
                $("#workflow_feature_id").val(featureId);
            }

        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sendOffer: function(event) {
        event.preventDefault();

        const featureId = $("#offer_feature_id").val();
        const price = $("#price").val();
        const productPrice = web3.toWei(price, "ether");

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.sendOffer(featureId, productPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sendOffer',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    startDevelopment: function(event) {
        event.preventDefault();

        const featureId = $("#workflow_feature_id").val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.startDevelopment(featureId, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('startDevelopment',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    startReview: function(event) {
        event.preventDefault();

        const featureId = $("#workflow_feature_id").val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.startReview(featureId, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('startReview',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    startTest: function(event) {
        event.preventDefault();

        const featureId = $("#workflow_feature_id").val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.startTest(featureId, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('startTest',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    writeInvoice: function(event) {
        event.preventDefault();

        const featureId = $("#workflow_feature_id").val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.writeInvoice(featureId, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('writeInvoice',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sendInvoice: function(event) {
        event.preventDefault();

        const featureId = $("#workflow_feature_id").val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.sendInvoice(featureId, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sendInvoice',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    pay: function(event) {
        event.preventDefault();

        const featureId = $("#workflow_feature_id").val();
        const amount = $("#amount").val();
        const walletValue = web3.toWei(amount, "ether");

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.pay(featureId, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('pay',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });

    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
