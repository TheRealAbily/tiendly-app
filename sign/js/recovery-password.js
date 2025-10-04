// Import the functions:
import { input_check } from '../../general/js/input/input-check.js';
import { input_disabled } from '../../general/js/input/input-disabled.js';
import { input_eye } from '../../general/js/input/input-eye.js';
import { input_focus } from '../../general/js/input/input-focus.js';
import { fetch_reset_password, fetch_resend_code } from './fetch.js';

// Import the necessary elements:
import { repeat_animation, load_button, disable_c_menu, disable_enter, go } from '../../general/js/functions/general-functions.js'; // Functions for better optimization

// When document is loaded:
document.addEventListener('DOMContentLoaded', () => {
    // Functions:
    disable_c_menu(); // Disable the context menu
    disable_enter() // Disable press enter to login

    // Check if exists the email:
    if (!localStorage.getItem('email')) { go('./forgot-password.html'); }

    // General elements:
    const generalElements = document.querySelectorAll('.this');

    // Form:
    const form = document.querySelector('form');

    // Container:
    const containerCode = document.querySelector('.code-container-inset');

    // Input:
    const codeInput = document.getElementById('code');
    const newPasswordInput = document.getElementById('new-password');
    const newRepasswordInput = document.getElementById('new-repassword');
    const listInputs = [codeInput, newPasswordInput, newRepasswordInput];

    // Labels for code:
    const labelCodes = document.querySelectorAll('.code-input');

    // Line password:
    const line = document.getElementById('line');

    // Button:
    const button = document.getElementById('verify-button');

    // Error:
    const textError = document.getElementById('error-text');

    // Resend code:
    const resendCodeText = document.getElementById('resend-code-text');

    // Forgot password:
    const forgotPasswordText = document.getElementById('forgot-password-text');

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
            
            if (input_check({input: codeInput, type: 'code'}) &&
                input_check({input: newPasswordInput, type: 'password'}) &&
                newPasswordInput.value.trim() === newRepasswordInput.value.trim()) {
                // Remove the class:
                button.classList.remove('disabled');
            }

            // Hide the error message:
            if (codeInput.value.trim() === '' &&
                newPasswordInput.value.trim() === '' &&
                newRepasswordInput.value.trim() === '') {
                textError.classList.remove('show');
            }

            // Remove the error message:
            textError.classList.remove('show');
        });
    });

    // Focus:
    let isFocus = false;

    // Blur event:
    codeInput.addEventListener('blur', () => {
        isFocus = false;

        // Remove the class:
        labelCodes.forEach(input => { input.classList.remove('focus'); });
    });

    // Focus event:
    codeInput.addEventListener('focus', () => {
        isFocus = true;

        // Add the class:
        labelCodes.forEach((input, index) => {
            if (codeInput.value.length - 1 === index) { input.classList.add('focus'); }
        });

        // Firts number:
        if (codeInput.value.length === 0) { labelCodes[0].classList.add('focus'); }
    });

    // Paste the code:
    codeInput.addEventListener('paste', (event) => {
        // Content to show:
        let content = event.clipboardData.getData('text')
        if (content.length > 6) { content = content.substring(0, 6); }
        
        // Copy:
        labelCodes.forEach((input, index) => {
            // Remove the error class:
            input.classList.remove('error');
            
            // Insert:
            input.value = content[index];
        });
    });

    // Add the event to show the code:
    codeInput.addEventListener('input', () => {
        // Limit:
        if (codeInput.value.length === 7) { codeInput.value = codeInput.value.substring(0, 6); }

        // Hide:
        textError.classList.remove('show');

        labelCodes.forEach((input, index) => {
            // Remove the error class:
            input.classList.remove('error');

            // Insert:
            if (codeInput.value.length === index + 1) { input.value = codeInput.value[index]; }

            // Delete:
            if (codeInput.value.length < index + 1) { input.value = ''; }
        });

        // Is focus:
        if (isFocus) {
            labelCodes.forEach((input, index) => {
                if (codeInput.value.length === index + 1) { input.classList.add('focus'); }
                else { input.classList.remove('focus'); }
            });
        }

        // Firts number:
        if (codeInput.value.length === 0) { labelCodes[0].classList.add('focus'); }

        // Enable/disable button:
        if (codeInput.value.length === 6) { button.classList.remove('disabled'); }
        else { button.classList.add('disabled'); }
    });

    // Button event:
    button.addEventListener('click', function(event) {
        // Avoid the default event:
        event.preventDefault();
        
        // Variables:
        let codeValid = input_check({input: codeInput, type: 'code'});
        let passValid = input_check({input: newPasswordInput, type: 'password'});

        // Checking:
        if (codeValid && passValid &&
            newPasswordInput.value.trim() === newRepasswordInput.value.trim()) {

            // Check the code:
            if (!button.classList.contains('disabled')) {
                // Hide:
                textError.classList.remove('show');

                // Remove the error animation:
                newPasswordInput.closest('.input-container').classList.remove('error');
                newRepasswordInput.closest('.input-container').classList.remove('error');

                // Inputs:
                input_disabled({input: codeInput, status: 'disabled'});
                input_disabled({input: newPasswordInput, status: 'disabled'});
                input_disabled({input: newRepasswordInput, status: 'disabled'});
            
                // Disable the container
                containerCode.classList.add('disabled');
                
                // Disabled the inputs:
                labelCodes.forEach(input => {
                    // Remove the error class:
                    input.classList.remove('error');
                    input.classList.add('disabled');
                });

                input_disabled({input: codeInput, status: 'disabled'});
                
                // Button:
                load_button({button: button, mode: 'add'});

                // Data:
                const data = {
                    email: localStorage.getItem('email'),
                    new_password: newPasswordInput.value.trim(),
                    new_password_confirmation: newRepasswordInput.value.trim(),
                    verification_code: codeInput.value.trim()

                };

                // Fetch to server:
                fetch_reset_password(data)

                .then (result => {
                    // Delay:
                    setTimeout(() => {
                        // Class:
                        form.classList.remove('fade-in');
                        form.classList.add('fade-out');

                        // Block the elements:
                        generalElements.forEach(element => { element.classList.add('no-touch'); })

                        // Erase the data saved:
                        localStorage.removeItem('email');
        
                        // Add the class:
                        labelCodes.forEach(input => {
                            input.classList.add('success');
                        });

                        // Go login:
                        setTimeout(() => {
                            window.location.href = '../../index.html';
                        }, 600);
                    }, 1000);
                })

                .catch (error => {
                    // Delay:
                    setTimeout(() => {
                        // Show:
                        textError.classList.add('show');

                        console.log(error);

                        // Error:
                        switch (error.status) {
                            case 400: {
                                textError.textContent = 'Código incorrecto';

                                // Add the class:
                                labelCodes.forEach(input => {
                                    input.classList.add('error');
                                    input.classList.remove('disabled');
                                });

                                break;
                            }

                            case 401: {
                                textError.textContent = 'La nueva contraseña no puede ser22ual a la actual';
                                repeat_animation(newPasswordInput.closest('.input-container'), 'error');
                                repeat_animation(newRepasswordInput.closest('.input-container'), 'error');
                                break;
                            }

                            case 404: {
                                textError.textContent = 'Correo inexistente';
                                break;
                            }

                            case 422: {
                                textError.textContent = 'La nueva contraseña no puede ser igual a la actual';
                                repeat_animation(newPasswordInput.closest('.input-container'), 'error');
                                repeat_animation(newRepasswordInput.closest('.input-container'), 'error');
                                break;
                            }

                            default: { textError.textContent = 'Ha ocurrido un error en el servidor'; break; }
                        }

                        // Inputs:
                        input_disabled({input: codeInput, status: 'enable'});
                        input_disabled({input: newPasswordInput, status: 'enable'});
                        input_disabled({input: newRepasswordInput, status: 'enable'});
                
                        // Disabled the inputs:
                        labelCodes.forEach(input => {
                            // Remove the error class:
                            input.classList.remove('error');
                            input.classList.remove('disabled');
                        });

                        // Enable the container
                        containerCode.classList.remove('disabled');
                        
                        // Button:
                        load_button({button: button, mode: 'remove', text: 'Verificar'});
                    }, 800);
                })
            }
        }
        else {
            // Show:
            textError.classList.add('show');

            // Error:
            if (passValid === false) {
                repeat_animation(newPasswordInput.closest('.input-container'), 'error');
                textError.textContent = 'La contraseña es inválida';
            }

            if (newPasswordInput.value.trim() !== newRepasswordInput.value.trim()) {
                repeat_animation(newRepasswordInput.closest('.input-container'), 'error');
                textError.textContent = 'Las contraseñas no coinciden';
            }

            // All inputs is emptys:
            if (codeInput.value.trim() === '' &&
                newPasswordInput.value.trim() === '' &&
                newRepasswordInput.value.trim() === '') {
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

        // Go sign up / sign in:
        setTimeout(() => {
            window.location.href = './forgot-password.html';
        }, 600);
    });

    // Resend the code:
    resendCodeText.addEventListener('click', () => {
        if (!resendCodeText.classList.contains('no-touch')) {
            // Time for cooldown:
            let time = 30;

            // Text in resend container:
            const mainText = document.querySelector('.resend');
            const otherText = document.querySelector('.cooldown');

            // Hide the text:
            mainText.classList.add('hide');

            // Show the text:
            otherText.classList.remove('hide');
            
            // Update the text:
            otherText.textContent = `Código reenviado. Puedes reintentarlo en ${time} seg.`;

            // Resend the code:
            let data = { email: localStorage.getItem('email') }
            fetch_resend_code (data);

            // Add the class:
            resendCodeText.classList.add('no-touch');

            // Clock:
            const cooldown = setInterval(() => {
                if (time <= 0) {
                    // Show the text:
                    mainText.classList.remove('hide');

                    // Hide the text:
                    otherText.classList.add('hide');

                    // Remove the class:
                    resendCodeText.classList.remove('no-touch');

                    // Clear the cooldown:
                    clearInterval(cooldown);
                }
                else {
                    // Update the time:
                    time -= 1;

                    // Update the text:
                    otherText.textContent = `Código reenviado. Puedes reintentarlo en ${time} seg.`;
                }

                // Update the value:

            }, 1000);
        }
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
    newPasswordInput.addEventListener('input', () => {
        // Variables:
        let level = 0;
        let value = newPasswordInput.value.trim();

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
