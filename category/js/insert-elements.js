// Import the necessary elements:
import { start_view, check_login, get_css_values,
        scroll_effect, visibility_effect, set_theme,
        globalVars, load_vars, save_vars,
        disable_c_menu, disable_scroll } from '../../general/js/functions/general-functions.js'; // Functions for better optimization

// Import the function to get Category:
import { get_category } from './get-category.js';

// When document is loaded:
document.addEventListener('DOMContentLoaded', () => {
    // Functions:
    check_login({}); // Check if the user is logged
    scroll_effect(); // Set the scroll effect
    set_theme(); // Set the theme
    disable_scroll(); // Disable the scroll
    disable_c_menu(); // Disable the context menu
    start_view({_mustAnimate: localStorage.getItem('comes-from') === 'dashboard' ? true : false}); // Show the back button
    load_vars(); // Load the vars
    globalVars.dashboardTransitionType = 'fade-in';
    save_vars(); // Save the vars

    // Add the general products container to the main shops container:
    const generalContainer = document.getElementById('general-container');

    // Check if exists:
    if (generalContainer) {
        // Container height:
        const containerHeight = Math.floor(generalContainer.offsetHeight / 140) - 1;

        // Insert the elements:
        for (let i = 0; i < containerHeight + 1; i++) {
            // Insert the title:
            const generalTitleContainer = document.createElement('h3');
            generalTitleContainer.classList.add('subtitle', 'set-visibility');
            generalTitleContainer.textContent = '. . .';
            generalContainer.appendChild(generalTitleContainer);

            // Template:
            const generalLiContainer = document.createElement('li');
            generalLiContainer.classList.add('set-visibility');
            generalLiContainer.innerHTML = '';

            // Add the popular product single container:
            for (let k = 0; k < Math.floor(generalContainer.offsetWidth / get_css_values({_propertys: ['--dashboard-products-min-width', '--dashboard-margin-width']})); k++) {
                generalLiContainer.innerHTML += `<div class="loading-effect"></div>`;
            }

            // Insert the element:
            generalContainer.appendChild(generalLiContainer);

            // Insert the line:
            if (i < containerHeight) {
                const generalLineContainer = document.createElement('span');
                generalLineContainer.classList.add('line-separator', 'fix', 'set-visibility');
                generalContainer.appendChild(generalLineContainer);
            }
        }

        // Set the observer to view:
        visibility_effect({_query: '.set-visibility', _container: '#category'});
    }

    // Get category:
    setTimeout(() => { get_category(); }, 750);
});
