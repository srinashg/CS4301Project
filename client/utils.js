import Toastify from 'toastify-js'

export const proxy = 'http://localhost:8000'

export const showNotif = (text) => {
    Toastify({
        text: text,
        duration: 3000,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        style: {
            background: "linear-gradient(to right, rgb(44, 130, 187),  rgb(243, 150, 255))",
        }
    }).showToast();
}

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
    }

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    };

    return config;
}
