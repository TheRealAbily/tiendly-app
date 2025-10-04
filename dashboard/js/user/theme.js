// Import the necessary elements:
import { apply_class, check_login, screen_block,
        change_theme, repeat_animation } from '../../../general/js/functions/general-functions.js'; // Functions for better optimization

// When document is loaded:
document.addEventListener('DOMContentLoaded', () => {
    // Variables:
    const button = document.getElementById('theme-button'); // Theme button
    const circle = document.getElementById('theme-circle'); // Circle
    const icon = document.getElementById('theme'); // Icon

    // Set the icon and values:
    if (localStorage.getItem('theme') === 'dark-mode') {
        // Apply the necessary class:
        apply_class({_element: circle, _class: 'white-theme', _method: 't'}); // Change the circle's color
        apply_class({_element: icon, _class: 'light-mode'}); // Change the icon:
        apply_class({_element: icon, _class: 'dark-mode', _method: 'r'});
    }
    else { localStorage.setItem('theme', 'light-mode'); }

    // Check if exists:
    if (button) {
        button.addEventListener('click', () => {
            if (!button.classList.contains('pressed')) {
                // Check if the user is logged:
                check_login({});

                // Apply the necessary class:
                apply_class({_element: button, _class: 'pressed'}); // Add the pressed class
                apply_class({_element: circle, _class: 'white-theme', _method: 't'}); // Change the circle's color

                // Add the animation:
                repeat_animation(circle, 'animate');

                // Block the screen:
                screen_block();

                // Change the icon:
                setTimeout(() => {
                    // Change the icon:
                    if (circle.classList.contains('white-theme')) {
                        apply_class({_element: icon, _class: 'light-mode'}); // Change the icon:
                        apply_class({_element: icon, _class: 'dark-mode', _method: 'r'});

                        change_theme('light-mode'); // Change the theme and save it
                        localStorage.setItem('theme', 'light-mode');
                    }
                    else {
                        apply_class({_element: icon, _class: 'light-mode', _method: 'r'}); // Change the icon:
                        apply_class({_element: icon, _class: 'dark-mode'});

                        change_theme('dark-mode'); // Change the theme and save it
                        localStorage.setItem('theme', 'dark-mode');
                    }
                }, 500);

                // Unblock the screen:
                setTimeout(() => { screen_block(false); }, 500);

                // Remove the class:
                setTimeout(() => { apply_class({_element: button, _class: 'pressed', _method: 'r'}); }, 1150);
            }
        });
    }
});
