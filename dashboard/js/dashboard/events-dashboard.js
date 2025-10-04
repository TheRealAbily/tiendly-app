// Import the necessary elements:
import { apply_class, go, check_login, screen_block, create_notification,
        globalVars, save_vars, load_vars } from '../../../general/js/functions/general-functions.js'; // Functions for better optimization

// Add the events to buttons from dashboard:
export function events_dashboard() {
    // Check if the cart is created:
    if (localStorage.getItem('cart') === 'created') { create_notification('success', 'El carrito se ha creado correctamente', 5000, 0); }
    if (localStorage.getItem('cart') === 'edited') { create_notification('success', 'El carrito se ha editado correctamente', 5000, 0); }
    localStorage.setItem('cart', 'nothing');

    // Select all buttons from Dashboard:
    const buttons = document.querySelectorAll('.dashboard-button');

    // Check if exists:
    if (buttons) {
        buttons.forEach(_button => {
            _button.addEventListener('click', (event) => {
                // Apply the class:
                apply_class({_element: _button, _class: 'pressed'});

                // Check the type button pressed and
                // start the transition to other file:
                ['category', 'product', 'shop'].forEach(_class => { if (_button.classList.contains(`${_class}-button`)) { start_transition(event, _class); } });
            });
        });
    }

    // Large button:
    const largeButtons = document.querySelectorAll('.large-button');

    // Check if exists:
    if (largeButtons) {
        largeButtons.forEach((_button, _index) => {
            _button.addEventListener('click', () => {
                // Apply the class:
                apply_class({_element: _button, _class: 'pressed'});

                // Save the element to show:
                localStorage.setItem('show-more', ['categories', 'products', 'shops'][_index]);
                
                // Start transition for more elements:
                start_transition(_button.id.replace('show-all-', ''), 'show-more');
            });
        });
    }
}

// Start the transition animation by pressing a Dashboard button:
export function start_transition(event, type, obj = null, local = 'dashboard', elements = '.dashboard-element') {
    // First check if user is logged:
    check_login({});

    // Get the global vars, edits them
    // and saves them:
    load_vars();
    globalVars.headerSearchShow = false; // Hide the search button on header
    globalVars.headerBackShow = true; // Show the back button on header
    globalVars.dashboardTransitionType = 'fade-in'; // Set the transition type
    save_vars();
    
    // Add the class for the animations
    // on header and footer:
    if (obj === null) { 
        apply_class({_query: '#header-title', _class: 'move-out'});
        apply_class({_query: 'footer', _class: 'fade-out'});
    }
    else {
        if (obj.header) { apply_class({_query: '#header-title', _class: 'move-out'}); }
        if (obj.footer) { apply_class({_query: 'footer', _class: 'fade-out'}); }
    }

    // Hide the Dashboard:
    document.querySelectorAll(elements).forEach(_element => {
        apply_class({_element: _element, _class: 'element-entry-visible', _method: 'r'});
        apply_class({_element: _element, _class: 'element-fade-out'});
        apply_class({_element: _element, _class: 'set-visibility'});
    });

    // Block the screen:
    screen_block();

    // Set where from come:
    localStorage.setItem('comes-from', local); // Set the start of user

    // Check if must show more elements:
    if (type !== 'show-more') {
        // Remove the all prefixes:
        let selectedId = event.target.id;
        ['category-id-', 'popular-id-', 'recent-id-',
        'shop-id-', 'my-favorites-id-', 'favorites-id-',
        'queue-id-', 'product-id-', 'sought-id-'].forEach(prefix => { selectedId = selectedId.replace(prefix, ''); });

        // Convert the number:
        if (/^\d+$/.test(selectedId)) { selectedId = parseInt(selectedId, 10); }

        // Save the ID:
        localStorage.setItem(`${type}-id-selected`, selectedId);
    }

    // Go to selected file:
    go(`../../${type}/html/${type}.html`, 800);
}
