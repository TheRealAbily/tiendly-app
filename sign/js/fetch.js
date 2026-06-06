// Import the necessary elements:
import { url, check_login } from '../../general/js/functions/general-functions.js'; // Functions for better optimization

// Fetch to server for login:
export function fetch_login (data) {
    return fetch (url + 'api/auth/loginAll', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })

    .then (response => {
        if (!response.ok) { throw response; }
        else { return response.json(); }
    })
}

// Fetch to server for register:
export function fetch_register (data) {
    return fetch (url + 'api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })

    .then (response => {
        if (!response.ok) { throw response; }
        else { return response.json(); }
    })
}

// Fetch to server for verify code:
export function fetch_verify_code (data) {
    return fetch(url + 'api/auth/verify-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })

    .then (response => {
        if (!response.ok) { throw response; }
        else { return response.json(); }
    })
}

// Fetch to server for resend code:
export function fetch_resend_code (data) {
    return fetch (url + 'api/auth/resend-verification-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ email: data.email })
    })

    .then (response => {
        if (!response.ok) { throw response; }
        else { return response.json(); }
    })
}

// Fetch to server for recovery password:
export function fetch_forgot_password (data) {
    return fetch (url + 'api/auth/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ email: data.email })
    })

    .then (response => {
        if (!response.ok) { throw response; }
        else { return response.json(); }
    })
}

// Fetch to server for reset password:
export function fetch_reset_password (data) {
    return fetch (url + 'api/auth/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })

    .then (response => {
        if (!response.ok) { throw response; }
        else { return response.json(); }
    })
}

// Fetch to server for change password:
export function fetch_change_password (data) {
    return fetch (url + 'api/auth/change-password', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(data)
    })

    .then (response => {
        if (!response.ok) {
            if (response?.status === 401 || response?.code === 401 || localStorage.getItem('token') === '') { check_login({_exit: true}); }
            else { throw new Error('No se ha podido obtener la información del Dashboard'); }
        }
        return response.json();
    })
}
