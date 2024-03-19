const BankContract = artifacts.require("Bank");

module.exports = function(deployer) {
    deployer.deploy(BankContract)
        .then(function(instance) {
            console.log("Contract ABI:");
            console.log(JSON.stringify(instance.abi));
            console.log("Address")
            console.log(instance.address)
        })
};