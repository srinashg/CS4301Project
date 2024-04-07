import $ from 'jquery';
import Toastify from 'toastify-js'
import axios from 'axios'
import { 
    proxy,
    showNotif 
} from './utils.js'

require("dotenv").config();

if (localStorage.getItem('token')) {
    window.location.href = '/transaction.html';
}

const login = async () => {
    const email = $('#email').val();
    const password = $('#password').val();

    try {
        const response = await axios.get(
            `${proxy}/user?email=${email}&password=${password}`
        );

        const data = response.data;
        localStorage.setItem('first_name', data.first_name);
        localStorage.setItem('last_name', data.last_name);
        localStorage.setItem('address', data.address);
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('email', data.email);

        showNotif("Signed in successfully");
        setTimeout(() => {
                window.location.href = '/transaction.html';
            }, 3000
        );
    } catch (err) {
        if (err.response.status === 401) {
            showNotif("Invalid credentials");
        }
    }
}
$('#login-btn').on('click', () => {
    login();
})

const signup = async () => {
    const email = $('#email').val();
    const password = $('#password').val();
    const first_name = $('#first-name').val();
    const last_name = $('#last-name').val();

    const data = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password
    };
    
    try {
        const response = await axios.post(
            `${proxy}/user`,
            data
        );
        
        if (response.status == 201) {
            showNotif('Account created');
            setTimeout(() => {
                    window.location.href = "/";
                }, 3000
            );
        }
    } catch (err) {
        showNotif(err)
    }
}
$('#signup-btn').on('click', () => {
    signup();
})
