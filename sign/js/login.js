// Import the functions:
import { input_check } from '../../general/js/input/input-check.js';
import { input_disabled } from '../../general/js/input/input-disabled.js';
import { input_eye } from '../../general/js/input/input-eye.js';
import { input_focus } from '../../general/js/input/input-focus.js';
import { fetch_login } from './fetch.js';
import { change_url } from '../../general/js/functions/general-functions.js';

// Import the necessary elements:
import { repeat_animation, set_theme, load_button,
        disable_c_menu, disable_enter, go,
        globalVars, save_vars, load_vars } from '../../general/js/functions/general-functions.js'; // Functions for better optimization

// When document is loaded:
document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is logged:
    if (localStorage.getItem('token')) { go('./dashboard/html/dashboard.html'); }

    // Functions:
    disable_c_menu(); // Disable the context menu
    disable_enter() // Disable press enter to login

    // Set the theme:
    set_theme();
    
    // Save the current page:
    localStorage.setItem('current-page', 'login');

    // Erase the data:
    localStorage.removeItem('data-user');
    localStorage.removeItem('email');
    
    // General elements:
    const generalElements = document.querySelectorAll('.this');

    // Form:
    const form = document.querySelector('form');

    // Inputs:
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const listInputs = [emailInput, passwordInput];

    // Button:
    const button = document.getElementById('login-button');

    // Error:
    const textError = document.getElementById('error-text');

    // Forgot password:
    const forgotPasswordText = document.getElementById('forgot-password-text');

    // Sign up:
    const signUpText = document.getElementById('sign-up-text');

    // Remove the no-touch class:
    setTimeout(() => {
        generalElements.forEach(element => { element.classList.remove('no-touch'); })
    }, 500);

    // Eye:
    input_eye(form);

    // Focus:
    input_focus(form);

    // Inputs:
    listInputs.forEach(input => {
        input.addEventListener('input', () => {
            // Add the class:
            button.classList.add('disabled');

            if (input_check({input: emailInput, type: 'email'}) &&
                input_check({input: passwordInput, type: 'simple-password'})) {

                // Remove the class:
                button.classList.remove('disabled');
            }

            // Hide the error message:
            textError.classList.remove('show');
        });
    });

    // Add the event:
    button.addEventListener('click', (event) => {
        // Prevent the event:
        event.preventDefault();

        // Variables:
        let emailValid = input_check({input: emailInput, type: 'email'});
        let passValid = input_check({input: passwordInput, type: 'simple-password'});

        // Checking:
        if (emailValid && passValid) {
            // Hide:
            textError.classList.remove('show');

            // Inputs:
            input_disabled({input: emailInput, status: 'disabled'});
            input_disabled({input: passwordInput, status: 'disabled'});

            // Button:
            load_button({button: button, mode: 'add'});

            // Data:
            const data = {
                email: emailInput.value.trim(),
                password: passwordInput.value.trim()
            };

            // Fetch to server:
            fetch_login(data)

            .then (result => {
                // Delay:
                setTimeout(() => {
                    // Screen height:
                    document.documentElement.style.setProperty('--header-center', (window.screen.height / 2) + 'px');
                    
                    // Class:
                    document.querySelector('header').classList.add('logged');

                    // Token:
                    localStorage.setItem('token', result.data.token);
                    
                    // Class:
                    form.classList.remove('fade-in');
                    form.classList.add('fade-out');

                    // Block the elements:
                    generalElements.forEach(element => { element.classList.add('no-touch'); })

                    // Go dashboard:
                    setTimeout(() => {
                        // Top screen:
                        repeat_animation(document.querySelector('.top-screen'), 'show');

                        // Dashboard:
                        setTimeout(() => {
                            window.location.href = './dashboard/html/dashboard.html';
                        }, 1000);
                    }, 3000);
                }, 1000);
            })

            .catch(error => {
                // Delay:
                setTimeout(() => {
                    // Show:
                    textError.classList.add('show');

                    // Error:
                    switch (error.status) {
                        case 400: {
                            textError.textContent = 'Correo inexistente';
                            repeat_animation(emailInput.closest('.input-container'), 'error');
                            break;
                        }

                        case 401: {
                            textError.textContent = 'Contraseña incorrecta';
                            repeat_animation(passwordInput.closest('.input-container'), 'error');
                            break;
                        }

                        case 402: {
                            // Error:
                            textError.textContent = '';
                            
                            // Class:
                            form.classList.remove('fade-in');
                            form.classList.add('fade-out');

                            // Block the elements:
                            generalElements.forEach(element => { element.classList.add('no-touch'); })

                            // Save the email:
                            localStorage.setItem('email', emailInput.value.trim());
                            localStorage.setItem('unverify-account', 'true');

                            // Go sign up:
                            setTimeout(() => {
                                window.location.href = './sign/html/verify-email.html';
                            }, 600);
                            break;
                        }

                        case 405: {
                            textError.textContent = 'Usuario baneado';
                            repeat_animation(emailInput.closest('.input-container'), 'error');
                            repeat_animation(passwordInput.closest('.input-container'), 'error');
                            break;
                        }

                        default: { textError.textContent = 'Ha ocurrido un error en el servidor'; break; }
                    }

                    // Inputs:
                    input_disabled({input: emailInput, status: 'enable'});
                    input_disabled({input: passwordInput, status: 'enable'});

                    // Button:
                    load_button({button: button, mode: 'remove', text: 'Iniciar sesión'});
                }, 800);
            });
        }
        else {
            // Show:
            textError.classList.add('show');

            // Error:
            if (emailValid === false) {
                repeat_animation(emailInput.closest('.input-container'), 'error');
                textError.textContent = 'El correo es inválido';
            }

            if (passValid === false) {
                repeat_animation(passwordInput.closest('.input-container'), 'error');
                textError.textContent = 'La contraseña es inválida';
            }

            // All inputs is emptys:
            if (emailInput.value.trim() === '' && passwordInput.value.trim() === '') {
                textError.textContent = 'Debes rellenar los campos';
            }
        }
    });

    // Change the page:
    forgotPasswordText.addEventListener('click', () => {
        // Class:
        form.classList.remove('fade-in');
        form.classList.add('fade-out');

        // Block the elements:
        generalElements.forEach(element => { element.classList.add('no-touch'); })

        // Go forgot password:
        setTimeout(() => {
            window.location.href = './sign/html/forgot-password.html';
        }, 600);
    });

    // Change the page:
    signUpText.addEventListener('click', () => {
        // Class:
        form.classList.remove('fade-in');
        form.classList.add('fade-out');

        // Block the elements:
        generalElements.forEach(element => { element.classList.add('no-touch'); })

        // Save the vars:
        load_vars();
        globalVars.dashboardTransitionType = 'screen-white';
        save_vars();

        // Go sign up:
        setTimeout(() => {
            window.location.href = './sign/html/sign-up.html';
        }, 600);
    });
});
