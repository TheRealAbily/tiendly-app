// Import the functions:
import { input_check } from '../../general/js/input/input-check.js';
import { input_disabled } from '../../general/js/input/input-disabled.js';
import { input_eye } from '../../general/js/input/input-eye.js';
import { input_focus } from '../../general/js/input/input-focus.js';
import { input_numbers } from '../../general/js/input/input-numbers.js';
import { fetch_register } from './fetch.js';

// Import the necessary elements:
import { repeat_animation, load_button, disable_c_menu, disable_enter, go } from '../../general/js/functions/general-functions.js'; // Functions for better optimization

// When document is loaded:
document.addEventListener('DOMContentLoaded', () => {
    // Functions:
    disable_c_menu(); // Disable the context menu
    disable_enter() // Disable press enter to login

    // Save the current page:
    localStorage.setItem('current-page', 'register');

    // General elements:
    const generalElements = document.querySelectorAll('.this');

    // Form:
    const form = document.querySelector('form');

    // Inputs:
    const nameInput = document.getElementById('name');
    const ciInput = document.getElementById('ci');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const repasswordInput = document.getElementById('repassword');
    const listInputs = [nameInput, ciInput, emailInput, passwordInput, repasswordInput];

    // Get the saved data:
    if (localStorage.getItem('data-user')) {
        Object.values(JSON.parse(localStorage.getItem('data-user'))).forEach((value, index) => {
            // Check if is CI:
            if (index === 1) { listInputs[index].value = 'V' + value; }
            else { listInputs[index].value = value; }

            listInputs[index].classList.add('hold');
            listInputs[index].closest('.input-container').querySelector('label').classList.add('change');
        })
    }

    // Line password:
    const line = document.getElementById('line');

    // Button:
    const button = document.getElementById('register-button');

    // Error:
    const textError = document.getElementById('error-text');

    // Sign up:
    const signInText = document.getElementById('sign-in-text');

    // Remove the no-touch class:
    setTimeout(() => {
        generalElements.forEach(element => { element.classList.remove('no-touch'); })
    }, 500);

    // Eye:
    input_eye(form);

    // Focus:
    input_focus(form);

    // Only numbers:
    input_numbers({container: form, specific: '#ci'});
    
    // Inputs:
    listInputs.forEach(input => {
        input.addEventListener('input', () => {
            // Add the class:
            button.classList.add('disabled');
            
            if (input_check({input: nameInput, type: 'name'}) &&
                input_check({input: ciInput, type: 'ci'}) &&
                input_check({input: emailInput, type: 'email'}) &&
                input_check({input: passwordInput, type: 'password'}) && 
                passwordInput.value.trim() === repasswordInput.value.trim()) {
                // Remove the class:
                button.classList.remove('disabled');
            }

            // Hide the error message:
            if (nameInput.value.trim() === '' &&
                ciInput.value.trim() === '' &&
                emailInput.value.trim() === '' &&
                passwordInput.value.trim() === '' &&
                repasswordInput.value.trim() === '') {
                textError.classList.remove('show');
            }

            // Remove the error message:
            textError.classList.remove('show');
        });
    });

    // Add the event:
    button.addEventListener('click', (event) => {
        // Prevent the event:
        event.preventDefault();

        // Variables:
        let nameValid = input_check({input: nameInput, type: 'name'});
        let ciValid = input_check({input: ciInput, type: 'ci'});
        let emailValid = input_check({input: emailInput, type: 'email'});
        let passValid = input_check({input: passwordInput, type: 'password'});

        // Checking:
        if (nameValid && ciValid && emailValid && passValid && 
            passwordInput.value.trim() === repasswordInput.value.trim()) {
            // Hide:
            textError.classList.remove('show');

            // Inputs:
            input_disabled({input: nameInput, status: 'disabled'});
            input_disabled({input: ciInput, status: 'disabled'});
            input_disabled({input: emailInput, status: 'disabled'});
            input_disabled({input: passwordInput, status: 'disabled'});
            input_disabled({input: repasswordInput, status: 'disabled'});

            // Button:
            load_button({button: button, mode: 'add'});
            
            // Data:
            const data = {
                name: nameInput.value.trim(),
                ci: ciInput.value.trim().replace('V', ''),
                email: emailInput.value.trim(),
                password: passwordInput.value.trim(),
                password_confirmation: repasswordInput.value.trim()
            };

            // Fetch to server:
            fetch_register(data)

            .then (result => {
                // Delay:
                setTimeout(() => {
                    // Class:
                    form.classList.remove('fade-in');
                    form.classList.add('fade-out');

                    // Block the elements:
                    generalElements.forEach(element => { element.classList.add('no-touch'); })

                    // Go verify:
                    setTimeout(() => {
                        // Token:
                        localStorage.setItem('token', result.data.token);

                        // Save the email:
                        localStorage.setItem('email', emailInput.value.trim());

                        // Save the data:
                        localStorage.setItem('data-user', JSON.stringify(data));
                            
                        // Verify:
                        window.location.href = './verify-email.html';
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
                        case 400: {
                            textError.textContent = 'El correo ya ha sido registrado';
                            repeat_animation(emailInput.closest('.input-container'), 'error');
                            break;
                        }

                        case 401: {
                            textError.textContent = 'La cédula ya ha sido registrada';
                            repeat_animation(ciInput.closest('.input-container'), 'error');
                            break;
                        }

                        default: { textError.textContent = 'Ha ocurrido un error en el servidor'; break; }
                    }

                    // Inputs:
                    input_disabled({input: nameInput, status: 'enable'});
                    input_disabled({input: ciInput, status: 'enable'});
                    input_disabled({input: emailInput, status: 'enable'});
                    input_disabled({input: passwordInput, status: 'enable'});
                    input_disabled({input: repasswordInput, status: 'enable'});

                    // Button:
                    load_button({button: button, mode: 'remove', text: 'Registrarse'});
                    }, 800);
            });
        }
        else {
            // Show:
            textError.classList.add('show');

            // Error:
            if (nameValid === false) {
                repeat_animation(nameInput.closest('.input-container'), 'error');
                textError.textContent = 'El nombre es inválido';
            }

            if (ciValid === false) {
                repeat_animation(ciInput.closest('.input-container'), 'error');
                textError.textContent = 'La cédula es inválida';
            }

            if (emailValid === false) {
                repeat_animation(emailInput.closest('.input-container'), 'error');
                textError.textContent = 'El correo es inválido';
            }

            if (passValid === false) {
                repeat_animation(passwordInput.closest('.input-container'), 'error');
                textError.textContent = 'La contraseña es inválida';
            }

            if (passwordInput.value.trim() !== repasswordInput.value.trim()) {
                repeat_animation(repasswordInput.closest('.input-container'), 'error');
                textError.textContent = 'Las contraseñas no coinciden';
            }

            // All inputs is emptys:
            if (nameInput.value.trim() === '' &&
                ciInput.value.trim() === '' &&
                emailInput.value.trim() === '' &&
                passwordInput.value.trim() === '' &&
                repasswordInput.value.trim() === '') {
                    textError.textContent = 'Debes rellenar los campos';
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

    // Set the difficult:
    function set_level (element, level) {
        element.classList.remove('bottom');
        element.classList.remove('mid');
        element.classList.remove('top');
        element.classList.remove('full');

        if (level !== '') { element.classList.add(level); }
    }

    // Set the line password:
    passwordInput.addEventListener('input', () => {
        // Variables:
        let level = 0;
        let value = passwordInput.value.trim();

        // Check the password:
        if (value.length > 8) { level += 25; }
        if (/[A-Z]/.test(value)) { level += 25; }
        if (/\d/.test(value)) { level += 25; }
        if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) { level += 25; }

        // Set the level:
        if (level >= 0) { set_level(line, ''); }
        if (level >= 25) { set_level(line, 'bottom'); }
        if (level >= 50) { set_level(line, 'mid'); }
        if (level >= 75) { set_level(line, 'top'); }
        if (level >= 100) { set_level(line, 'full'); }
    });
});
