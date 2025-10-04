// Import the necessary elements:
import { apply_class, go, screen_block, globalVars, save_vars, load_vars } from '../../../general/js/functions/general-functions.js'; // Functions for better optimization

// When document is loaded:
document.addEventListener('DOMContentLoaded', () => {
    // Select the about button:
    const button = document.getElementById('about-button');

    // Check if exists:
    if (button) {
        button.addEventListener('click', () => {
            if (!button.classList.contains('pressed')) {
                // Edit the global vars:
                load_vars();
                globalVars.headerSearchShow = false; // Hide the search button on header
                globalVars.headerBackShow = true; // Show the back button on header
                globalVars.dashboardTransitionType = 'fade-in'; // Set the transition typeglobalVars2.dashboardTransitionType = 'fade-in';
                save_vars();

                // Apply the necessary class:
                apply_class({_query: '.options-container', _class: 'element-fade-out'}); // Main container
                apply_class({_query: '#header-title', _class: 'move-out'}); // Title
                apply_class({_query: 'footer', _class: 'fade-out'}); // Footer
                apply_class({_element: button, _class: 'pressed'}); // Button

                // Block the screen:
                screen_block();

                // Go to about Tiendly:
                go('../../about/html/about.html', 800);
            }
        });
    }
});
