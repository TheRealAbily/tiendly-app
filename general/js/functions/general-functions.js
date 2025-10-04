// Set the global variables:
export let globalVars = {
    // Header:
    headerSearch: true,
    headerSearchShow: true,
    headerBackShow: false,
    headerSearchCanTouch: true,

    // Type transition:
    dashboardTransitionType: 'screen-white'
};

// Backup:
const defaultVars = globalVars;

// Save the vars:
export function save_vars() {
    localStorage.setItem('global-vars', JSON.stringify(globalVars));
}

// Load the vars:
export function load_vars() {
    if (localStorage.getItem('global-vars')) {
        // Parsea las variables guardadas.
        const storedVars = JSON.parse(localStorage.getItem('global-vars'));
        
        // Fusiona las variables por defecto con las guardadas.
        // Esto asegura que si añades nuevas propiedades a globalVars en el código, no se pierdan.
        globalVars = { ...globalVars, ...storedVars };
    }
}

// Reset the vars:
export function reset_vars() {
    globalVars = defaultVars;
    localStorage.setItem('global-vars', JSON.stringify(globalVars));
}

// URL from the API Tiendly:
export let url = 'http://127.0.0.1:8000/';

// Root folder:
export const mainPath = window.location.origin;

// Apply/remove/toggle any class if the element exists:
export function apply_class({ _query = '', _element = '', _class = '', _method = 'a', _father_element = document}) {
    // Create the variable:
    let element = '';

    // Check if must select any query o element exists:
    if (_query) { element = _father_element.querySelector(_query); }
    else { element = _element; }

    // Check if exists:
    if (element) {
        // Select the method to apply:
        switch (_method) {
            case 'r': { element.classList.remove(_class); } break; // Remove
            case 't': { element.classList.toggle(_class); } break; // Toggle
            default: { element.classList.add(_class); } break; // Add (for default)
        }
    }
}

// Go to any file in with delay:
export function go(_link, _delay = 0) {
    setTimeout(() => {
        window.location.href = _link;
    }, _delay);
}

// Return the total value from CSS styles list:
export function get_css_values({_propertys = [], _multipler = 10}) {
    return (_propertys.reduce((acc, value) => { return acc + parseFloat(getComputedStyle(document.documentElement).getPropertyValue(value.trim()) || 0)}, 0) * _multipler);
}

// Remove all items from localStorage:
export function remove_items(must = true) {
    if (must) { ['recent-products', 'my-favorites-products',
                'interest-products', 'interest-container',
                'theme', 'show-more', 'product-id-selected',
                'product-selected', 'product-selected-founded',
                'must-show-cart-elements'].forEach(item => { localStorage.removeItem(item); }); }
}

// Apply the visibility condition:
export function visibility_effect({_query = '.set-visibility', _container = '#main-container', _percentage = 10, _margin = ['0px 0px -80px 0px']}) {
    // Variables:
    let observer = null; // Observer created
    const elements = document.querySelectorAll(_query);
    const container = document.querySelector(_container);

    // Disconnect and delete the previous observer:
    if (observer) { observer.disconnect(); }

    // Check if the elements and container exists:
    if (elements && container) {
        elements.forEach(_element => apply_class({_element: _element, _class: 'element-not-visible'})); // Apply the class for hide elements

        // Create the new observer:
        observer = new IntersectionObserver((entries) => {
            entries.forEach(_entry => {
                // Check if must apply the desired effect:
                if (_entry.isIntersecting) {
                    apply_class({_element: _entry.target, _class: 'element-not-visible', _method: 'r'});
                    apply_class({_element: _entry.target, _class: 'element-entry-visible'});

                    observer.unobserve(_entry.target);
                }
            });
        }, {
            // Conditions:
            root: container, // Container 
            threshold: _percentage / 100, // Percentage that should be visible
            rootMargin: _margin // Unobserved margin 
        });

        elements.forEach(_element => observer.observe(_element)); // Apply the effect (on this case, the class)
    }
}

// Create the screen for block the user touchs and avoid some error:
export function screen_block(block = true) {
    // Select all screens:
    const screens = document.querySelectorAll('.screen-block-touchs');

    if (block) {
        // Disable the scroll:
        disable_scroll();

        screens.forEach(screen => {
            // Set the new top to screen:
            screen.style.top = `${screen.closest('.main-container').scrollTop}px`;

            // Apply the necessary class:
            apply_class({_element: screen, _class: 'active'});
            apply_class({_element: screen, _class: 'desactive', _method: 'r'});
            apply_class({_element: screen, _class: 'filter'});
        });
    }
    else {
        // Enable the scroll:
        enable_scroll();
        
        screens.forEach(screen => {
            // Apply the necessary class:
            apply_class({_element: screen, _class: 'active', _method: 'r'});
            apply_class({_element: screen, _class: 'desactive'});
        });
    }
}

// Set the functionality for back button:
export function back_button({_query = '#back', _hide_button = true,
                            _move_title = true, _link = '../../dashboard/html/dashboard.html',
                            _delay = 0, _form = '', _exit = 'default',
                            _globalVars = [], _callback = () => {}}) {
    // Variables:
    const backButton = document.querySelector(_query); // Select the element like back button
    let backIsPressed = false; // Check if back button already was pressed
    
    // Check if exists the element:
    if (backButton) {
        backButton.addEventListener('click', () => {
            // Check if the button has not been pressed previously:
            if (!backIsPressed) {
                // Change the global vars if exists:
                if (_globalVars) {
                    load_vars();
                    _globalVars.forEach(obj => { for (let key in obj) { globalVars[key] = obj[key]; } });
                    save_vars();
                }

                // Hide the specific elements:
                if (_hide_button) { apply_class({_element: backButton, _class: 'fade-out'}); } // Check if must apply the exit class to button
                if (_move_title) { apply_class({_query: '#header-title', _class: 'move-in'}); } // Check if must apply the exit class to button

                // Block the screen:
                screen_block();

                // Block the button:
                backIsPressed = true;

                // Apply the class if contains form:
                if (_form) {
                    apply_class({_element: _form, _class: 'fade-in', _method: 'r'});
                    apply_class({_element: _form, _class: 'fade-out'});
                }

                // Execute the callback:
                _callback();

                // Return to main menu or other
                // file before some miliseconds:
                switch(_exit) {
                    case 'default': { go('../../dashboard/html/dashboard.html', _delay); } break;

                    case 'specific': {
                        // Set the location:
                        const location = localStorage.getItem('comes-from');

                        // Check if exists:
                        if (location) { go(`../../${location}/html/${location}.html`, _delay); }
                        else { go('../../dashboard/html/dashboard.html', _delay); }
                    }
                    break;

                    case 'other': {
                        go(_link, _delay);
                    }
                    break;
                }
            }
        });
    }
}

// Return to login if the user is not logged:
export function check_login({_root = '../../index.html', _exit = false}) {
    if (_exit || !localStorage.getItem('token')) {
        remove_items(true);
        
        const localItems = ['token', 'cart', 'comes-from', 'category-id-selected', 'product-id-selected', 'shop-id-selected'];
        
        localItems.forEach(_localVar => {
            localStorage.removeItem(_localVar);
        });

        window.location.href = _root;
    }
}

// Play any sfx:
export function sfx(sound, volume = 1, loop = false, delay = 0) {
    // Select and load the audio:
    const audio = new Audio(`../../../resources/sounds/${sound}`);

    // Check if exists:
    if (audio) {
        // Modify the audio playing:
        audio.volume = volume;
        audio.loop = loop;

        // Play the audio with any delay:
        setTimeout(() => { audio.play(); }, delay);
    }
}

// --- Notification System ---
let notificationQueue = [];
let isNotificationActive = false;

// Internal function to process the next notification in the queue.
function _process_queue() {
    if (notificationQueue.length > 0) {
        const next = notificationQueue.shift();
        // Use requestAnimationFrame to ensure the next notification appears smoothly.
        requestAnimationFrame(() => {
            _show_notification(next.status, next.message, next.time);
        });
    } else {
        isNotificationActive = false;
    }
}

// Internal function that handles the actual display of a single notification.
function _show_notification(status, message, time) {
    isNotificationActive = true;

    // Select the notification if it exists, or prepare to create it.
    let notification = document.getElementById('notification');

    // Ensure CSS is loaded, but only once.
    if (!document.querySelector('link[href="../../general/css/notification.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '../../general/css/notification.css';
        document.head.appendChild(link);
    }

    // Play sound
    sfx('notification.wav');

    // Create the notification element if it doesn't exist
    if (!notification) {
        const body = document.querySelector('body');
        notification = document.createElement('section');
        notification.id = 'notification';
        notification.innerHTML = `<!-- Background -->
                                <span class="background"></span>
                                <!-- Container -->
                                <div class="animate">
                                    <!-- Left section -->
                                    <span><i></i></span>
                                    <!-- Right section -->
                                    <span><h6 id="notification-text"></h6></span>
                                </div>`;
        body.appendChild(notification);
    }

    // Update content and classes
    notification.classList.remove('hide');
    notification.classList.add('show');

    const container = notification.querySelector('div');
    container.className = `${status} animate`; // Reset classes and set new ones

    const text = notification.querySelector('#notification-text');
    text.innerText = message;

    // Set a timer to hide the notification
    setTimeout(() => {
        const existNotification = document.getElementById('notification');
        if (existNotification) {
            existNotification.classList.remove('show');
            existNotification.classList.add('hide');
        }

        // Wait for the hide animation to finish (assuming 500ms) before processing the next one.
        // This duration should match the CSS animation for the 'hide' class.
        setTimeout(() => {
            _process_queue();
        }, 500);

    }, time);
}

// Insert or update the content of notification:
export function create_notification(status = 'error', message, time, delay = 0) {
    // Apply a delay if is needed:
    setTimeout(() => {
        if (isNotificationActive) {
            notificationQueue.push({ status, message, time });
        } else {
            _show_notification(status, message, time);
        }
    }, delay);
}

// Scroll effect:
export function scroll_effect() {
    // Variables:
    const header = document.querySelector('header'); // Header
    const mainContainers = document.querySelectorAll('.main-container'); // Main containers
    let scroll = true; // Can scroll

    // Check if exists:
    if (header) {
        // Set the event:
        mainContainers.forEach(container => {
            container.addEventListener('scroll', () => {
                if (scroll) { header.classList.toggle('box-shadow', container.scrollTop >= 10); }
                
                scroll = !scroll;
            });
        });
    }
}

// Set the theme:
export function set_theme() { change_theme(localStorage.getItem('theme') || 'light-mode'); }

// Change the theme:
export function change_theme(theme) {
    // Root:
    const root = document.documentElement;
    const style = getComputedStyle(root);

    // Prefix:
    let prefix = theme === 'light-mode' ? 'ocwt' : 'ocdt';

    // Colors to change:
    const colors = [
        ['bg-color', 3],
        ['color', 6],
        ['button-color', 2],
        ['form-color', 1],
        ['gray-tone', 9],
        ['text-color', 5],
        ['input-color', 5],
        ['element-ui-color', 2]];

    // Iterate over each element:
    colors.forEach(element => {
        for (let i = 0; i < element[1]; i++) {
            root.style.setProperty(`--${element[0]}-${i + 1}`, style.getPropertyValue(`--${prefix}-${element[0]}-${i + 1}`));
        }
    });
}

// Gets the next sibling that matches a condition:
export function get_next_sibling({_container, _query}) {
    // Check if exists:
    if (_container && _query) {
        let currentElement = _container.nextElementSibling;
        let startsWith = _query[0];

        // Go through all the elements:
        while (currentElement) {
            switch(startsWith) {
                // By class:
                case '.': {
                    if (currentElement.classList.contains(_query)) { return currentElement; }
                    else { currentElement = currentElement.nextElementSibling; }
                }
                break;

                // By ID:
                case '#': {
                    if (currentElement.id === _query) { return currentElement; }
                    else { currentElement = currentElement.nextElementSibling; }
                }
                break;
            }
        }

        // If not exists:
        return null;
    }
}

// Repeat the animation:
export function repeat_animation(_element, _class) {
    // Check if exists:
    if (_element) {
        _element.classList.remove(_class); // Remove
        void _element.offsetWidth; // Reload
        _element.classList.add(_class); // Add
    }
}

// Adjust the header according to transition:
export function start_view({_delay = 5, _mustAnimate = true, _callback = () => {}}) {
    // Select the header element
    const header = document.querySelector('header');

    // Check if header exists
    if (header) {
        // Create a MutationObserver to detect when the header content is added
        const observer = new MutationObserver((mutationsList, observerInstance) => {
            // Check if the back button is now present in the header
            const backButton = header.querySelector('#back');
            if (backButton) {
                // Change the display:
                backButton.style.display = 'flex';

                // Apply the necessary class:
                if (_mustAnimate) { apply_class({_element: backButton, _class: 'fade-in'}); }

                // Execute the callback function
                _callback();

                // Disconnect the observer, no longer needed
                observerInstance.disconnect();
            }
        });

        // Start observing the header for child changes
        observer.observe(header, { childList: true, subtree: true });

        // In case the header and back button are already present, apply immediately after delay
        setTimeout(() => {
            const backButton = header.querySelector('#back');
            if (backButton) {
                backButton.style.display = 'flex';
                if (_mustAnimate) { apply_class({_element: backButton, _class: 'fade-in'}); }
                _callback();
                observer.disconnect();
            }
        }, _delay);
    }
}

// Button load animation:
export function load_button({button = null, mode = 'add', text = ''}) {
    // Check:
    if (button) {
        // Mode:
        switch (mode) {
            case 'add': {
                if (!button.classList.contains('semi-disabled')) {
                    button.classList.add('semi-disabled'); // Filter

                    // Animation:
                    button.innerHTML = `
                        <div class="load-container">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>`;
                }
            } break;

            case 'wait': {
                if (!button.classList.contains('semi-disabled')) {
                    button.classList.add('semi-disabled'); // Filter
                }
            } break;

            case 'pause': {
                if (!button.classList.contains('semi-disabled')) {
                    button.classList.add('semi-disabled'); // Filter
                }
                
                button.textContent = text; // Text
            } break;

            default: {
                button.classList.remove('semi-disabled'); // Class
                button.textContent = text; // Text
            } break;
        }
    }
}

/* Disable the context menu */
export function disable_c_menu() {
    if (1 === 2) 
    // Mouse button:
    document.addEventListener('contextmenu', event => event.preventDefault() );

    // Keyboard:
    document.addEventListener('keydown', function (event) {
        if (event.key === 'F12' || // DevTools
            (event.ctrlKey && event.shiftKey && ['I', 'J', 'C'].includes(event.key)) || // Ctrl+Shift+I/J/C
            (event.ctrlKey && event.key === 'U')) { // Ver código fuente
            event.preventDefault(); // Disable the event
        }
    });
}

// Disable login for press enter:
export function disable_enter() {
    document.querySelectorAll('input').forEach(_input => {
        _input.addEventListener('keydown', (event) => {
            if (event.key === 'enter') { event.preventDefault(); }
        });
    });
}

// Prevent any default scrolling action
function preventScroll(event) {
    event.preventDefault();
}

// Disable scroll globally
export function disable_scroll() {
    // Mouse wheel:
    window.addEventListener("wheel", preventScroll, { passive: false });

    // Touch screen:
    window.addEventListener("touchmove", preventScroll, { passive: false });

    // Keyboard arrows, space, page up/down, home/end:
    window.addEventListener("keydown", function (event) {
        // Keys that cause scrolling:
        const keys = ["ArrowUp", "ArrowDown", "ArrowLeft",
                    "ArrowRight", " ", "PageUp",
                    "PageDown", "Home", "End"];
        
        if (keys.includes(event.key)) {
            preventScroll(event);
        }
    }, { passive: false });
}

// Enable scroll again
export function enable_scroll() {
    window.removeEventListener("wheel", preventScroll, { passive: false });
    window.removeEventListener("touchmove", preventScroll, { passive: false });
}

// Change the URL:
export function change_url(_url) {
    url = _url
    console.log(url);
}
