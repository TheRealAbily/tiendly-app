// Import the functions:
import { input_disabled } from '../../general/js/input/input-disabled.js';
import { fetch_verify_code, fetch_resend_code } from './fetch.js';

// Import the necessary elements:
import { repeat_animation, load_button, disable_c_menu, disable_enter, go } from '../../general/js/functions/general-functions.js'; // Functions for better optimization

// When document is loaded:
document.addEventListener('DOMContentLoaded', () => {
    // Functions:
    disable_c_menu(); // Disable the context menu
    disable_enter() // Disable press enter to login

    // General elements:
    const generalElements = document.querySelectorAll('.this');

    // Form:
    const form = document.querySelector('form');

    // Container:
    const containerCode = document.querySelector('.code-container-inset');

    // Input:
    const codeInput = document.getElementById('code');

    // Labels for code:
    const labelCodes = document.querySelectorAll('.code-input');

    // Button:
    const button = document.getElementById('verify-button');

    // Error:
    const textError = document.getElementById('error-text');

    // Resend code:
    const resendCodeText = document.getElementById('resend-code-text');

    // Sign up:
    const signUpText = document.getElementById('sign-up-text');

    // Remove the no-touch class:
    setTimeout(() => {
        generalElements.forEach(element => { element.classList.remove('no-touch'); })
    }, 500);

    // Send the code if is not verify:
    if (localStorage.getItem('email') && localStorage.getItem('unverify-account') === 'true') {
        // Send the code:
        let data = { email: localStorage.getItem('email') }
        fetch_resend_code (data);
        localStorage.setItem('unverify-account', 'false');
    }

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

        // Remove the error message:
        textError.classList.remove('show');
    });

    // Button event:
    button.addEventListener('click', function(event) {
        // Avoid the default event:
        event.preventDefault();

        // Check the code:
        if (!button.classList.contains('disabled')) {
            // Hide:
            textError.classList.remove('show');
            
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
                verification_code: code.value.trim()
            };

            // Fetch to server:
            fetch_verify_code(data)

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

                    // Erase the data saved:
                    localStorage.removeItem('data-user');
                    localStorage.removeItem('email');
                    localStorage.removeItem('current-page');
    
                    // Add the class:
                    labelCodes.forEach(input => {
                        input.classList.add('success');
                    });

                    // Go dashboard:
                    setTimeout(() => {
                        // Top screen:
                        repeat_animation(document.querySelector('.top-screen'), 'show');

                        // Dashboard:
                        setTimeout(() => {
                            window.location.href = '../../dashboard/html/dashboard.html';
                        }, 1000);
                    }, 3000);
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
                            break;
                        }

                        default: { textError.textContent = 'Ha ocurrido un error en el servidor'; break; }
                    }

                    // Enable the container
                    containerCode.classList.remove('disabled');
                    
                    // Add the class:
                    labelCodes.forEach(input => {
                        input.classList.add('error');
                        input.classList.remove('disabled');
                    });
                    
                    // Button:
                    load_button({button: button, mode: 'remove', text: 'Verificar'});
                }, 800);
            })
        }
    });

    // Change the page:
    signUpText.addEventListener('click', () => {
        // Class:
        form.classList.remove('fade-in');
        form.classList.add('fade-out');

        // Block the elements:
        generalElements.forEach(element => { element.classList.add('no-touch'); })

        // Go sign up / sign in:
        setTimeout(() => {
            if (localStorage.getItem('current-page') === 'register') { window.location.href = './sign-up.html'; }
            else { window.location.href = '../../index.html'; }
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
});
