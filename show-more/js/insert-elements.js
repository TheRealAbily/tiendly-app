// Import the necessary elements:
import {check_login, set_theme, start_view,
        disable_c_menu, scroll_effect, visibility_effect,
        get_css_values, disable_scroll} from '../../general/js/functions/general-functions.js'; // Functions for better optimization

// Import the function to get elements:
import { get_elements } from './get-elements.js';

// When document is loaded:
document.addEventListener('DOMContentLoaded', () => {
    // Functions:
    check_login({}); // Check if the user is logged
    scroll_effect(); // Scroll effect
    set_theme(); // Set the theme
    disable_c_menu(); // Disable the context menu
    disable_scroll(); // Disable the scroll
    start_view({_mustAnimate: localStorage.getItem('comes-from') === 'dashboard' ? true : false}); // Show the back button

    // Variables:
    const container = document.getElementById('container'); // Container to insert elements
    const amount = Math.floor(container.offsetWidth / get_css_values({_propertys: [`--dashboard-${localStorage.getItem('show-more') === 'categories' ? 'categories' : 'products'}-min-width`, '--dashboard-margin-width']}));
    
    // Repeat for insert more elements:
    for (let i = 0; i < amount * (amount + 1); i++) {
        // Wrapper for element:
        const wrapper = document.createElement('li');
        wrapper.classList.add(`${localStorage.getItem('show-more')}-button` || 'categories-button');

        // Check the elements to insert:
        if (localStorage.getItem('show-more') === 'categories') {
            // Create the category element:
            wrapper.innerHTML = `<div class="loading-effect"></div>
                                <h2>. . .</h2>`;
        }
        else {
            // Create the product/shop element:
            wrapper.innerHTML = `<div class="loading-effect"></div>`;
        }

        // Insert the element:
        container.appendChild(wrapper);
    }

    // Set the place where it's coming:
    localStorage.setItem('comes-from', 'show-more');

    // Visibility effect:
    visibility_effect({_query: '.set-visibility', _container: '#dashboard'});

    // Get the elements to show:
    get_elements(localStorage.getItem('show-more'));
});


