// Import the functions:
import { input_check } from '../../general/js/input/input-check.js';
import { input_disabled } from '../../general/js/input/input-disabled.js';
import { input_focus } from '../../general/js/input/input-focus.js';
import { fetch_forgot_password } from './fetch.js';

// Import the necessary elements:
import { repeat_animation, load_button, disable_c_menu, disable_enter, go } from '../../general/js/functions/general-functions.js'; // Functions for better optimization

// When document is loaded:
document.addEventListener('DOMContentLoaded', () => {
    // Functions:
    disable_c_menu(); // Disable the context menu
    disable_enter() // Disable press enter to login

    // Erase the data:
    localStorage.removeItem('data-user');
    
    // General elements:
    const generalElements = document.querySelectorAll('.this');

    // Form:
    const form = document.querySelector('form');

    // Inputs:
    const emailInput = document.getElementById('email');

    // Button:
    const button = document.getElementById('recovery-button');

    // Error:
    const textError = document.getElementById('error-text');

    // Sign up:
    const signInText = document.getElementById('sign-in-text');

    // Remove the no-touch class:
    setTimeout(() => {
        generalElements.forEach(element => { element.classList.remove('no-touch'); })
    }, 500);

    // Focus:
    input_focus(form);

    // Inputs:
    emailInput.addEventListener('input', () => {
        // Add the class:
        button.classList.add('disabled');

        if (input_check({input: emailInput, type: 'email'})) {

            // Remove the class:
            button.classList.remove('disabled');
        }

        // Hide the error message:
        if (emailInput.value.trim() === '') {
            textError.classList.remove('show');
        }

        // Remove the error message:
        textError.classList.remove('show');
    });

    // Add the event:
    button.addEventListener('click', (event) => {
        // Prevent the event:
        event.preventDefault();

        // Variables:
        let emailValid = input_check({input: emailInput, type: 'email'});

        // Checking:
        if (emailValid) {
            // Hide:
            textError.classList.remove('show');

            // Inputs:
            input_disabled({input: emailInput, status: 'disabled'});

            // Button:
            load_button({button: button, mode: 'add'});

            // Data:
            const data = {
                email: emailInput.value.trim(),
            };

            // Fetch to server:
            fetch_forgot_password(data)

            .then (result => {
                // Delay:
                setTimeout(() => {
                    // Class:
                    form.classList.remove('fade-in');
                    form.classList.add('fade-out');

                    // Block the elements:
                    generalElements.forEach(element => { element.classList.add('no-touch'); })

                    // Go recovery:
                    setTimeout(() => {
                        // Save the email:
                        localStorage.setItem('email', emailInput.value.trim());
                        
                        // Verify:
                        window.location.href = './recovery-password.html';
                    }, 600);
                }, 1000);
            })

            .catch(error => {
                // Delay:
                setTimeout(() => {
                    // Show:
                    textError.classList.add('show');

                    // Error:
                    switch (error.status) {
                        case 404: {
                            textError.textContent = 'Correo inexistente';
                            repeat_animation(emailInput.closest('.input-container'), 'error');
                            break;
                        }

                        default: { textError.textContent = 'Ha ocurrido un error en el servidor'; break; }
                    }

                    // Inputs:
                    input_disabled({input: emailInput, status: 'enable'});

                    // Button:
                    load_button({button: button, mode: 'remove', text: 'Recuperar'});
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

            // All inputs is emptys:
            if (emailInput.value.trim() === '') {
                textError.textContent = 'Debes rellenar el campo';
            }
        }
    });

    // Change the page:
    signInText.addEventListener('click', () => {
        // Class:
        form.classList.remove('fade-in');
        form.classList.add('fade-out');

        // Block the elements:
        generalElements.forEach(element => { element.classList.add('no-touch'); })

        // Go sign in:
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 600);
    });
});
