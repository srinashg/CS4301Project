import Web3 from "web3";
import config from "./configuration.json";
import $ from 'jquery';
require("dotenv").config();

const web3 = new Web3("http://localhost:7545");
const contract = new web3.eth.Contract(config.ABI_DEFINITION, process.env.CONTRACT_ADDRESS)

let account;
const getAccount = async () => {
    // account = await web3.eth.personal.newAccount("password");
    // await web3.eth.personal.unlockAccount(account, "password", 1000000);

    try {
        account = (await web3.eth.getAccounts())[0];
        $("#act_address").text(account);
        let balance = await contract.methods.getBalance().call({
            from: account
        })
        balance = web3.utils.fromWei(balance, "ether")
        $("#balance").text(`ETH ${balance}`)
    }
    catch (err) {
        console.error(err)
    }
}
getAccount();


const deposit = async () => {
    try {
        let amount = $("#transaction_amount_input").val();
        amount = web3.utils.toWei(amount, "ether");
        await contract.methods.deposit(amount).send({
            from: account
        });
        getAccount();
    }
    catch (err) {
        console.error(err)
    }
};
$("#deposit_btn").on('click', () => {
    deposit();
})

const withdraw = async () => {
    try {
        let amount = $("#transaction_amount_input").val();
        amount = web3.utils.toWei(amount, "ether");
        await contract.methods.withdraw(amount).send({
            from: account
        });
        getAccount();
    }
    catch (err) {
        console.error(err)
    }
};
$("#withdraw_btn").on('click', () => {
    withdraw();
})