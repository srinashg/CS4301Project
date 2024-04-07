import Web3 from "web3";
import config from "./configuration.json";
import $ from 'jquery';
import {
    showNotif,
    getAuthHeader,
    proxy
} from "./utils";
import axios from 'axios';
require("dotenv").config();

const web3 = new Web3("http://localhost:7545");
const contract = new web3.eth.Contract(config.ABI_DEFINITION, process.env.CONTRACT_ADDRESS)

let account = null;
let fakeBank;
const getAccount = async () => {
    try {
        accountList = await web3.eth.getAccounts()
        if (!localStorage.getItem('token')) {
            window.location.href = '/';
        }

        account = accountList[localStorage.getItem('address')];
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

// Add record to BC
const addTransaction = async (sender, receiver, senderEmail, receiverEmail, amount) => {
    try {
        const receipt = await contract.methods.addTransaction(receiver, amount, senderEmail, receiverEmail).send(
            {
                from: sender,
                gas: 6721975
            }
        );
        console.log(receipt);
    } catch (error) {
        throw new Error(error);
    }
};


const transfer = async () => {
    try {
        let email = $('#transfer_user_input').val();
        let amount = $("#transfer_amount_input").val();
        amount = web3.utils.toWei(amount, "ether");

        const response = await axios.get(
            `${proxy}/transaction?email=${email}`,
            getAuthHeader()
        );

        if (amount <= 0 || amount === null) {
            showNotif('please input transfer amount');
            return;
        }

        const recipientAddress = response.data.recipient_address;
        const recipientEmail = response.data.recipient_email;
        const recipient = (await web3.eth.getAccounts())[recipientAddress]

        await web3.eth.sendTransaction({
            to: recipient,
            from: account,
            value: amount
        })

        const userEmail = localStorage.getItem('email');
        await addTransaction(account, recipient, userEmail, recipientEmail, amount);

        getAccount();
        showNotif("Fund transaction complete")
    }
    catch (err) {
        if (err.response) {
            showNotif(err.response.data.message);
        }
        console.error(err);
    }
};
$("#transfer_btn").on('click', () => {
    transfer();
})


const deposit = async () => {
    try {
        let amount = $("#transaction_amount_input").val();
        amount = web3.utils.toWei(amount, "ether");
        await web3.eth.sendTransaction({
            to: account,
            from: fakeBank,
            value: amount
        })

        const userEmail = localStorage.getItem('email');
        await addTransaction(fakeBank, account, 'depositrecords@chase.com', userEmail, amount);
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
        
        const userEmail = localStorage.getItem('email');
        await addTransaction(account, fakeBank, userEmail, 'depositrecords@chase.com', amount);

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