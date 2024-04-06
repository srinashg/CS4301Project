import Web3 from "web3";
import config from "./configuration.json";
import $ from 'jquery';
import { showNotif } from "./utils";
import axios from 'axios';
require("dotenv").config();

const web3 = new Web3("http://localhost:7545");
const contract = new web3.eth.Contract(config.ABI_DEFINITION, process.env.CONTRACT_ADDRESS)

let account = null;
let fakeBank;
const getAccount = async () => {
    try {
        accountList = await web3.eth.getAccounts()
        if (localStorage.getItem('token')) {
            showNotif("Signed in successfully");
        }
        else {
            window.location.href = '/';
        }
        account = accountList[0];
        fakeBank = accountList[accountList.length - 1]

        $("#act_address").text(account);
        let balance = await web3.eth.getBalance(account)
        balance = web3.utils.fromWei(balance, "ether").toString()
        $("#balance").text(`${balance.split('.')[0]} . ${balance.split('.')[1]}`);

        const first_name = localStorage.getItem('first_name');
        const last_name = localStorage.getItem('last_name');

        $('#user-name-nav').text(`${first_name} ${last_name}`);
    }
    catch (err) {
        console.error(err)
    }
}
getAccount();

const addTransaction = (sender, receiver, amount) => {
    contract.methods.addTransaction(receiver, amount).send(
        {
            from: sender,
            gas: 6721975
        }
    )
    .on('receipt', function(receipt) {
        console.log(receipt)
    });
};


const transfer = async () => {
    try {
        let amount = $("#transfer_amount_input").val();
        amount = web3.utils.toWei(amount, "ether");
        await web3.eth.sendTransaction({
            to: (await web3.eth.getAccounts())[1],
            from: account,
            value: amount
        })
        addTransaction(account, (await web3.eth.getAccounts())[1], amount);
        getAccount();
        showNotif("Fund transaction complete")
    }
    catch (err) {
        console.error(err)
    }
};
$("#transfer_btn").on('click', () => {
    transfer();
})


const deposit = async() => {
    try {
        let amount = $("#transaction_amount_input").val();
        amount = web3.utils.toWei(amount, "ether");
        await web3.eth.sendTransaction({
            to: account,
            from: fakeBank,
            value: amount
        })
        addTransaction(fakeBank, account, amount);
        getAccount();
        showNotif("Fund deposit complete")
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
        await web3.eth.sendTransaction({
            to: fakeBank,
            from: account,
            value: amount
        })
        addTransaction(account, fakeBank, amount);
        getAccount();
        showNotif("Fund withdraw complete")
    }
    catch (err) {
        console.error(err)
    }
};
$("#withdraw_btn").on('click', () => {
    withdraw();
})

const logout = () => {
    localStorage.clear();
    showNotif("Logout successful");
    setTimeout(() => {
        window.location.href = "/";
    }, 3000
    );
}
$('#logout-btn').on('click', () => {
    logout();
})