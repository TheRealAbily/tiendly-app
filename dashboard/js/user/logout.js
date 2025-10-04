// Import the necessary elements:
import { url, apply_class, go, remove_items, screen_block, check_login } from '../../../general/js/functions/general-functions.js'; // Functions for better optimization

// When document is loaded:
document.addEventListener('DOMContentLoaded', () => {
    // Select the logout button:
    const button = document.getElementById('logout-button');

    // Check if exists:
    if (button) {
        button.addEventListener('click', () => {
            if (!button.classList.contains('pressed')) {
                // Press the button:
                apply_class({_element: button, _class: 'pressed'});

                // Fetch to logout:
                fetch (url + 'api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })

                .then (response => {
                    if (!response.ok) { throw new Error('El servidor no pudo cerrar la sesión, pero se procederá localmente.'); }
                    return response.json();
                })

                .then (result => {
                    // Remove the class:
                    apply_class({_query: 'footer', _class: 'fade-out'}); // Footer
                    apply_class({_query: '.options-container', _class: 'element-fade-out'}); // Container

                    // Block the screen:
                    screen_block();

                    // Go to login:
                    check_login(true);

                    // Got to login:
                    remove_items(true);
                    localStorage.removeItem('token');
                    setTimeout(() => { go('../../index.html'); }, 1000);
                })
                
                .catch (error => {
                    // Remove the class:
                    apply_class({_query: 'footer', _class: 'fade-out'}); // Footer
                    apply_class({_query: '.options-container', _class: 'element-fade-out'}); // Container

                    // Block the screen:
                    screen_block();

                    // Go to login:
                    check_login(true);

                    // Got to login:
                    remove_items(true);
                    localStorage.removeItem('token');
                    setTimeout(() => { go('../../index.html'); }, 1000);
                })
            }
        });
    }
});
