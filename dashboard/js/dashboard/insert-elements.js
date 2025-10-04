// Import the necessary elements:
import { get_dashboard } from './get-dashboard.js'; // Get the information for Dashboard
import { apply_class, get_css_values, remove_items,
        visibility_effect, check_login, set_theme,
        globalVars, load_vars, reset_vars,
        disable_c_menu, scroll_effect} from '../../../general/js/functions/general-functions.js'; // Functions for better optimization

// When document is loaded:
document.addEventListener('DOMContentLoaded', () => {
    // Functions:
    scroll_effect(); // Scroll effect
    check_login({}); // Check if the user is logged
    load_vars(); // Load the vars
    set_theme(); // Set the theme
    disable_c_menu(); // Disable the context menu
    remove_items(false); // Remove all items
    visibility_effect({_container: '#dashboard'}); // Set the visibility effect

    // Check the var:
    if (globalVars.dashboardTransitionType === 'screen-white') { apply_class({_query: '#top-screen', _class: 'fade-out'}); } // Remove the screen on top
    else {
        // Show the others elements:
        apply_class({_query: '.queues-container', _class: 'element-fade-in'}); // Part of the main container
        apply_class({_query: '.options-container', _class: 'element-fade-in'}); // Part of the main container
        apply_class({_query: 'footer', _class: 'fade_in'}); // Footer
    }

    // List of containers:
    ['ads-container', 'categories-container',
    'recent-container', 'my-favorites-container',
    'popular-container', 'shops-container',
    'big-ads-container', 'interest-container'].forEach(_container => {
        // Variables:
        const container = document.getElementById(_container); // Container
        const dashboardMargin = '--dashboard-margin-width'; // General margin from Dashboard
        const liElement = document.createElement('li'); // li label
        let html = ''; // HTML Template;
        
        // Check if exists:
        if (container) {
            // Select the loading template:
            if (_container === 'ads-container' || _container === 'big-ads-container') { // Ads and big ads
                html = `<div class="loading-effect">
                            <img>
                        </div>`
            }
            else {
                if (_container === 'categories-container') { // Categories
                    for (let i = 0; i < Math.floor(container.offsetWidth / get_css_values({_propertys: ['--dashboard-categories-min-width', dashboardMargin]})); i++) {
                        html += `<div>
                                    <div class="loading-effect min-loading"></div>
                                    <h2>. . .</h2>
                                </div>`;
                    }
                }
                else { // Recents and favorites products
                    if (_container === 'recent-container' || _container === 'my-favorites-container' || _container === 'interest-container') {
                        if (_container === 'recent-container' && localStorage.getItem('recent-products') ||
                            _container === 'my-favorites-container' && localStorage.getItem('my-favorites-products') ||
                            _container === 'interest-container' && localStorage.getItem('interest-container')) {
                            for (let i = 0; i < Math.floor(container.offsetWidth / get_css_values({_propertys: ['--dashboard-products-min-width', dashboardMargin]})); i++) {
                                html += `<div class="loading-effect"></div>`;
                            }
                        }
                        else {
                            // Remove the container and title:
                            document.querySelectorAll(`.${_container.replace('container', 'part')}`).forEach(_element => { _element.remove(); });
                        }
                    }
                    else { // General products and shops
                        for (let c = 0; c < Math.floor(container.offsetWidth / get_css_values({_propertys: ['--dashboard-products-min-width', dashboardMargin]})); c++) {
                            html += `<div class="loading-effect"></div>`;
                        }
                    }
                }
            }
            
            // Insert the HTML:
            liElement.innerHTML = html;
            
            // Insert the child:
            container.appendChild(liElement);
        }
    });

    // Functions:
    reset_vars(); // Reset the vars
    get_dashboard(); // Get dashboard
});
