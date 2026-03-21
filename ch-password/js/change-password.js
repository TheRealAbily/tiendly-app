// Import the functions:
import { input_check } from '../../general/js/input/input-check.js';
import { input_disabled } from '../../general/js/input/input-disabled.js';
import { input_eye } from '../../general/js/input/input-eye.js';
import { input_focus } from '../../general/js/input/input-focus.js';
import { fetch_change_password } from '../../sign/js/fetch.js';

// Import the necessary elements:
import { start_view, apply_class, check_login, back_button, load_button,
        set_theme, repeat_animation, create_notification,
        disable_c_menu } from '../../general/js/functions/general-functions.js'; // Functions for better optimization

// When document is loaded:
document.addEventListener('DOMContentLoaded', () => {
    // Variables:
    const generalElements = document.querySelectorAll('.this'); // General elements
    const form = document.querySelector('form'); // Form
    const line = document.getElementById('line'); // Line password
    const button = document.getElementById('change-button'); // Button for change password
    const textError = document.getElementById('error-text'); // Error text
    const currentPasswordInput = document.getElementById('current-password'); // Current password input
    const passwordInput = document.getElementById('new-password'); // New password input
    const repasswordInput = document.getElementById('new-repassword'); // Repeat password input
    const listInputs = [currentPasswordInput, passwordInput, repasswordInput]; // All inputs

    // Functions:
    check_login({}); // Check if the user is logged
    set_theme(); // Set the theme
    disable_c_menu(); // Disable the context menu
    start_view({_callback: () => {
        back_button({_delay: 1000, _form: document.querySelector('form'), _form: form,
                    _globalVars: [{headerSearchCanTouch: false}]}); // Back button functionality
    }}); // Show the back button

    // Set the funcionality to view:
    setTimeout(() => {
        generalElements.forEach(element => { element.classList.remove('no-touch'); }) // Remove the "no-touch" property from elements
    }, 250);

    // Input featureds:
    input_eye(form); // Eye
    input_focus(form); // Focus
    
    // Inputs:
    listInputs.forEach(input => {
        input.addEventListener('input', () => {
            // Add the class:
            apply_class({_element: button, _class: 'disabled'});
            
            // Remove the class:
            if (input_check({input: currentPasswordInput, type: 'simple-password'}) && input_check({input: passwordInput, type: 'password'}) && 
                passwordInput.value.trim() === repasswordInput.value.trim()) {
                apply_class({_element: button, _class: 'disabled', _method: 'r'});
                apply_class({_element: button, _class: 'semi-disabled', _method: 'r'});
                apply_class({_element: button, _class: 'no-touch', _method: 'r'});
            }

            // Hide the error message:
            if (currentPasswordInput.value.trim() === '' &&
                passwordInput.value.trim() === '' &&
                repasswordInput.value.trim() === '') {
                apply_class({_element: textError, _class: 'show', _method: 'r'});
            }

            // Remove the error message:
            apply_class({_element: textError, _class: 'show', _method: 'r'});
        });
    });

    // Add the event:
    button.addEventListener('click', (event) => {
        // Prevent the event:
        event.preventDefault();

        // Variables:
        let currentValid = input_check({input: currentPasswordInput, type: 'simple-password'});
        let passValid = input_check({input: passwordInput, type: 'password'});

        // Checking:
        if (currentValid && passValid && passwordInput.value.trim() === repasswordInput.value.trim()) {
            // Hide:
            apply_class({_element: textError, _class: 'show', _method: 'r'});

            // Inputs:
            input_disabled({input: currentPasswordInput, status: 'disabled'});
            input_disabled({input: passwordInput, status: 'disabled'});
            input_disabled({input: repasswordInput, status: 'disabled'});

            // Button:
            load_button({button: button, mode: 'add'});
            
            // Data:
            const data = {
                current_password: currentPasswordInput.value.trim(),
                new_password: passwordInput.value.trim(),
                new_password_confirmation: repasswordInput.value.trim()
            };

            // Fetch to server:
            fetch_change_password(data)

            .then (result => {
                // Show the success notification:
                create_notification('success', 'La contraseña se ha cambiado exitosamente', 5000, 0);

                // Delay:
                setTimeout(() => {
                    // Restart the inputs:
                    listInputs.forEach(input => {
                        // Enable the input and restart:
                        input_disabled({input: input, status: 'enable'});
                        input.value = '';
                        input.classList.remove('hold');
                        input.type = 'password';

                        apply_class({_element: input, _class: 'hold', _method: 'r'});

                        // Apply the hide status to eye:
                        const container = input.closest('.input-container')
                        
                        // Check if exists:
                        if (container) {
                            // Apply the necessary class:
                            apply_class({_query: 'i', _class: 'show', _method: 'r', _father_element: container});
                            apply_class({_query: 'i', _class: 'hide', _father_element: container});
                        }
                    });

                    // Restart the level:
                    set_level(line, '');

                    // Apply the necessary class:
                    apply_class({_element: button, _class: 'disabled'});

                    button.innerText = 'Cambiar';
                }, 800);
            })

            .catch(error => {
                // Delay:
                setTimeout(() => {
                    // Show:
                    textError.classList.add('show');
                    
                    // Error:
                    switch (error.status) {
                        case 403: {
                            textError.textContent = 'La contraseña actual es incorrecta';
                            repeat_animation(currentPasswordInput.closest('.input-container'), 'error');
                            break;
                        }

                        case 422: {
                            textError.textContent = 'La nueva contraseña no puede ser igual a la actual';
                            repeat_animation(currentPasswordInput.closest('.input-container'), 'error');
                            break;
                        }

                        default: { textError.textContent = 'Ha ocurrido un error en el servidor'; break; }
                    }

                    // Inputs:
                    input_disabled({input: currentPasswordInput, status: 'enable'});
                    input_disabled({input: passwordInput, status: 'enable'});
                    input_disabled({input: repasswordInput, status: 'enable'});

                    // Button:
                    load_button({button: button, mode: 'remove', text: 'Cambiar'});
                }, 800);
            });
        }
        else {
            // Show:
            apply_class({_element: textError, _class: 'show'});

            if (currentValid === false) {
                repeat_animation(currentPasswordInput.closest('.input-container'), 'error');
                textError.textContent = 'La contraseña es inválida';
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
            if (currentPasswordInput.value.trim() === '' &&
                passwordInput.value.trim() === '' &&
                repasswordInput.value.trim() === '') {
                    textError.textContent = 'Debes rellenar los campos';
                }
        }
    });

    // Reset and set the difficult:
    function set_level (element, level) {
        ['bottom', 'mid', 'top', 'full'].forEach(_level => { apply_class({_element: element, _class: _level, _method: 'r'}); }); // Reset
        if (level !== '') { apply_class({_element: element, _class: level}); } // Set
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
