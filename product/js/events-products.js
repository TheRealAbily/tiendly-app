// Import the necessary elements:
import { apply_class, check_login, repeat_animation,
        visibility_effect, screen_block, go, enable_scroll,
        globalVars, save_vars, load_vars } from '../../general/js/functions/general-functions.js'; // Functions for better optimization

// Functionality for buttons:
export function events_products(method) {
    // Enable the scroll:
    enable_scroll();
    
    // Get the elements from category:
    const productsContainer = document.querySelectorAll('.shop-button');
    
    // Add the events for the shops:
    if (productsContainer.length) {
        productsContainer.forEach(button => {
            button.addEventListener('click', (event) => {
                // Functions:
                check_login({}); // Check if the user is logged
                load_vars();
                globalVars.headerSearchShow = false; // Hide the search button on header
                globalVars.headerBackShow = true; // Show the back button on header
                globalVars.dashboardTransitionType = 'fade-in'; // Set the transition type
                save_vars();
                apply_class({_element: button, _class: 'pressed'}); // Add the class
                apply_class({_query: '#general-container', _class: 'element-entry-visible', _method: 'r'}); // Select the general container and
                apply_class({_query: '#general-container', _class: 'element-fade-out'}); // add the fade-out animation

                // Block the screen:
                screen_block();

                // Save the shop ID:
                localStorage.setItem('shop-id-selected', parseInt(event.target.id.replace('shop-id-', ''), 10));
                localStorage.setItem('comes-from', 'product');
                
                // Go to file:
                go('../../shop/html/shop.html', 800);
            });
        });
    }

    // --------------------------------------------------------------------------

    // Check if is not a update:
    if (method !== 'update') {
        // Add the icons to mini buttons:
        document.querySelectorAll('.mini-button').forEach(_button => {
            // Remove the loading effect:
            apply_class({_element: _button, _class: 'loading-effect', _method: 'r'});

            // Add the icon according to its index:
            const icon = document.createElement('i');

            // Select the class:
            switch(_button.id) {
                case 'favorite-button': { apply_class({_element: icon, _class: 'favorite'}); } break; // Favorite
                case 'share-button': { apply_class({_element: icon, _class: 'share'}); } break; // Share
                case 'report-button': { apply_class({_element: icon, _class: 'report'}); } break; // Report
                case 'description-button': { apply_class({_element: icon, _class: 'arrow'}); } break; // Description
            }

            // Insert the icon:
            _button.appendChild(icon);
        });
    }

    // --------------------------------------------------------------------------

    // Check if the product is favorite:
    if (localStorage.getItem('my-favorites-products')) {
        // Get the list:
        if (JSON.parse(localStorage.getItem('my-favorites-products')).includes(localStorage.getItem('product-id-selected'))) {
            apply_class({_element: document.getElementById('favorite-button').querySelector('i'), _class: 'selected'});
        }
    }

    // --------------------------------------------------------------------------

    // Check if is not a update:
    if (method !== 'update') {
        // Add the click event for mini buttons on view:
        document.querySelectorAll('.mini-button').forEach(button => {
            button.addEventListener('click', () => {
                // Select the elements from view:
                const container = document.querySelector('.text-container') // Container
                const gradient = document.querySelector('.gradient'); // Gradient
                const icon = button.querySelector('i'); // Icon

                // Check if is not the description button:
                if (button.id !== 'description-button') {
                    // Add the bouncing animation to icons:
                    repeat_animation(icon, 'animate');

                    // Toggle the selected class:
                    icon.classList.toggle('selected');
                }

                // Check the index and set the animation
                // and functionality:
                switch (button.id) {
                    // Add/remove favorites:
                    case 'favorite-button': {
                        // Variable:
                        let favoriteProducts = [];

                        // Add/remove the product from favorites:
                        if (icon.classList.contains('selected')) {
                            // Add the product to recent products list:
                            if (!localStorage.getItem('my-favorites-products')) {
                                // Add the first element:
                                favoriteProducts = [localStorage.getItem('product-id-selected')];
                                localStorage.setItem('my-favorites-products', JSON.stringify(favoriteProducts));
                            }
                            else {
                                // Add one more element:
                                favoriteProducts = JSON.parse(localStorage.getItem('my-favorites-products')) || [];

                                // Check list:
                                if (favoriteProducts) {
                                    // Check if the element already exist
                                    // and remove on this case:
                                    if (favoriteProducts.includes(localStorage.getItem('product-id-selected'))) {
                                        favoriteProducts.splice(favoriteProducts.indexOf(localStorage.getItem('product-id-selected')), 1);
                                    }

                                    // Add the new element, remove the first
                                    // if list is so big, and saved the list:
                                    favoriteProducts.push(localStorage.getItem('product-id-selected'));
                                    localStorage.setItem('my-favorites-products', JSON.stringify(favoriteProducts));
                                }
                            }
                        }
                        else {
                            // Get the list, remove the object if exist
                            // and saved the new list:
                            if (localStorage.getItem('my-favorites-products')) {
                                favoriteProducts = JSON.parse(localStorage.getItem('my-favorites-products')) || [];

                                if (favoriteProducts.includes(localStorage.getItem('product-id-selected'))) {
                                    favoriteProducts.splice(favoriteProducts.indexOf(localStorage.getItem('product-id-selected')), 1);
                                }

                                if (favoriteProducts.length === 0) { localStorage.removeItem('my-favorites-products'); }
                                else { localStorage.setItem('my-favorites-products', JSON.stringify(favoriteProducts)); }
                            }
                        }
                    }
                        
                    break;

                    // Share product:
                    case 'share-button': {} break;

                    // Report product:
                    case 'report-button': {} break;

                    // Show description:
                    case 'description-button': {
                        // Set the value for expand:
                        document.documentElement.style.setProperty('--product-description-max-height', (document.getElementById('product-description').offsetHeight + 30) + 'px');

                        // Check if the button has been pressed previously:
                        if (!icon.classList.contains('icon-in') && !icon.classList.contains('icon-out')) {
                            // Only add the class for start the animations:
                            apply_class({_element: container, _class: 'container-open'}); // Container
                            apply_class({_element: gradient, _class: 'gradient-fade-out'}); // Gradient
                            apply_class({_element: icon, _class: 'icon-in'}); // Icon
                        }
                        else {
                            // Container:
                            apply_class({_element: container, _class: 'container-open', _method: 't'});
                            apply_class({_element: container, _class: 'container-close', _method: 't'});

                            // Gradient:
                            apply_class({_element: gradient, _class: 'gradient-fade-in', _method: 't'});
                            apply_class({_element: gradient, _class: 'gradient-fade-out', _method: 't'});

                            // Icon:
                            apply_class({_element: icon, _class: 'icon-in', _method: 't'});
                            apply_class({_element: icon, _class: 'icon-out', _method: 't'});
                        }
                    }
                        
                    break;
                }

                // Disable for a while, then enable it:
                button.disabled = true;
                setTimeout(() => { button.disabled = false; }, 650);
            });
        });
    }

    // --------------------------------------------------------------------------
    
    // Variables:
    const inputSearch = document.getElementById('input-search'); // Input for search
    let searchTimeout = null; // Debounce timeout for search

    // Guard to avoid attaching multiple listeners when events_products is called again
    if (inputSearch && !inputSearch.dataset.searchAttached) {
        inputSearch.dataset.searchAttached = '1';
        const handleSearch = () => {
            const searchValue = inputSearch.value.trim().toLowerCase();

            if (searchTimeout) { clearTimeout(searchTimeout); }
            searchTimeout = setTimeout(() => {
                // Remove any previous 'not found' messages
                document.querySelectorAll('.not-found-shops').forEach(_el => _el.remove());

                // Get current list items
                const liElements = document.querySelectorAll('#shops-container li');

                liElements.forEach(container => {
                    const nameEl = container.querySelector('.name');
                    const shopName = nameEl ? nameEl.textContent.trim().toLowerCase() : '';

                    // Show or hide according to search
                    if (shopName.startsWith(searchValue) || searchValue === '') { container.style.display = 'flex'; }
                    else { container.style.display = 'none'; }

                    // Entry animation:
                    apply_class({_element: container, _class: 'element-not-visible'});
                    apply_class({_element: container, _class: 'element-entry-visible', _method: 'r'});
                });

                // Get all visible shop containers (current DOM)
                const showedElements = Array.from(document.querySelectorAll('.shop-container')).filter(_element => _element.style.display !== 'none');

                requestAnimationFrame(() => {
                    let errorItem = document.getElementById('not-found-shops');
                    if (showedElements.length === 0) {
                        if (errorItem) { errorItem.remove(); }

                        const errorElement = document.createElement('div');
                        errorElement.id = 'not-found-shops';
                        errorElement.classList.add('error-list', 'animate', 'not-found-shops');
                        errorElement.innerHTML = `<i class="shops"></i>\n                                                        <h4>No se han encontrado<br>tiendas que coincidan</h4>`;

                        document.getElementById('general-container').appendChild(errorElement);
                    }
                    else {
                        if (errorItem) { errorItem.remove(); }
                        showedElements.forEach(_element => {
                            visibility_effect({_element: _element, _container: '#shops-container'})
                        });
                    }
                });

                // Create the observer:
                visibility_effect({});
            }, 500);
        };

        inputSearch.addEventListener('input', handleSearch);
    }

}
