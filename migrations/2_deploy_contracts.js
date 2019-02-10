// migrating the appropriate contracts
var CustomerRole = artifacts.require("./CustomerRole.sol");
var BackofficeRole = artifacts.require("./BackofficeRole.sol");
var DeveloperRole = artifacts.require("./DeveloperRole.sol");
var ReviewerRole = artifacts.require("./ReviewerRole.sol");
var TesterRole = artifacts.require("./TesterRole.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(CustomerRole);
  deployer.deploy(BackofficeRole);
  deployer.deploy(DeveloperRole);
  deployer.deploy(ReviewerRole);
  deployer.deploy(TesterRole);
  deployer.deploy(SupplyChain);
};
