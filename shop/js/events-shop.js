// Import the necessary elements:
import { url, apply_class, repeat_animation, create_notification,
        load_vars, save_vars, globalVars, screen_block, go,
        visibility_effect, load_button, check_login, 
        enable_scroll} from '../../general/js/functions/general-functions.js'; // Functions for better optimization

// Get the dollar price:
import { dollar_price } from './get-shop.js';

// Change the icon cart:
function change_cart_icon(input, status) {
    // Select the container:
    const container = input.closest('.product-cart');

    // Change the icon:
    if (container) {
        // Select the icon:
        const i = container.querySelector('i');

        // Change the icon:
        if (i) {
            if (status === 'add') { i.classList.add('selected'); }
            else { i.classList.remove('selected'); }
        }
    }
}

// Format the price:
export function format_price(_price) {
    // Check if it has a coma:
    if (!_price.toString().includes(',')) { _price += ',00'; }

    // Separate the whole part from the decimal part:
    let [int, float] = _price.split(',');

    // Check the length of float:
    if (float.toString().length === 1) { float += '0'; }

    // New number:
    const formatedNumber = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Return the new number:
    return `${formatedNumber},${parseFloat(float.toString()).toFixed(0)}`;
}

/**
 * Updates the visibility of products based on the current search term and cart filter.
 * It centralizes all filtering logic.
 */
function updateProductList() {
    const searchValue = document.getElementById('input-search').value.trim().toLowerCase();
    const cartButtonIcon = document.getElementById('cart-button')?.querySelector('i');
    const isCartFilterActive = cartButtonIcon?.classList.contains('selected') || false;
    
    const liElements = document.querySelectorAll('#products-container > li');
    let visibleCount = 0;

    // Remove any existing error message.
    document.querySelector('.not-found-products')?.remove();

    liElements.forEach(container => {
        // Ensure we are working with a product container, not a loader or error message.
        const productButton = container.querySelector('.product-button');
        if (!productButton) {
            return;
        }

        const productName = container.querySelector('.name').textContent.trim().toLowerCase();
        const quantity = parseInt(container.querySelector('.input-add-cart').value, 10) || 0;

        // A product is visible if it matches the search term AND the cart filter status.
        const matchesSearch = productName.includes(searchValue);
        const matchesCartFilter = !isCartFilterActive || (isCartFilterActive && quantity > 0);

        const shouldBeVisible = matchesSearch && matchesCartFilter;

        if (shouldBeVisible) {
            container.style.display = 'flex';
            visibleCount++;
        } else {
            container.style.display = 'none';
        }
    });
    
    // If no products are visible after filtering, show a "not found" message.
    if (visibleCount === 0 && liElements.length > 0 && liElements[0].querySelector('.product-button')) {
        const errorElement = document.createElement('div');
        errorElement.id = 'not-found-shops'; // Reusing ID, consider changing if it causes issues.
        errorElement.classList.add('error-list', 'animate', 'not-found-products');

        if (isCartFilterActive) {
            errorElement.innerHTML = `<i class="cart"></i><h4>No se han añadido<br>productos al carrito</h4>`;
        } else {
            errorElement.innerHTML = `<i class="products"></i><h4>No se han encontrado<br>productos que coincidan</h4>`;
        }
        document.getElementById('general-container').appendChild(errorElement);
    }
    
    // Re-apply entry animations to all currently visible elements to give user feedback on filter change.
    const visibleElements = Array.from(document.querySelectorAll('.product-container')).filter(el => el.style.display !== 'none');
    visibleElements.forEach(el => {
        apply_class({_element: el, _class: 'element-entry-visible', _method: 'r'});
        requestAnimationFrame(() => {
            apply_class({_element: el, _class: 'element-entry-visible'});
        });
    });
}

/**
 * Calculates and updates the total amount and prices in the cart summary section.
 */
function updateCartTotals() {
    const amountItems = document.getElementById('total-amount-items');
    const priceItems = document.getElementById('total-price-items');
    const priceBsItems = document.getElementById('total-price-bs-items');
    const createCartButton = document.getElementById('create-cart');

    const selectedProducts = Array.from(document.querySelectorAll('.product-button')).filter(el => parseInt(el.querySelector('.input-add-cart').value, 10) > 0);

    const totalUnits = selectedProducts.reduce((acc, el) => acc + parseInt(el.querySelector('.input-add-cart').value, 10), 0);
    const totalPrice = selectedProducts.reduce((acc, el) => acc + (parseFloat(el.querySelector('.price').textContent.replace(' Ref.', '').replace(',', '.')) * parseInt(el.querySelector('.input-add-cart').value, 10)), 0);
    const totalBsPrice = totalPrice * dollar_price({_mode: 'return'});

    amountItems.textContent = totalUnits;
    priceItems.textContent = `${format_price(totalPrice.toFixed(2).replace('.', ','))} Ref.`;
    priceBsItems.textContent = `${format_price(totalBsPrice.toFixed(2).replace('.', ','))} Bs.`;

    createCartButton.disabled = totalUnits === 0;
    apply_class({_element: createCartButton, _class: 'disabled', _method: totalUnits > 0 ? 'r' : 'a'});
}

// Functionality for buttons:
export function events_shop(_method, _cartId = '') {
    // Enable the scroll:
    enable_scroll();

    // Update the price:
    if (localStorage.getItem('product-selected-founded') === 'found') { updateCartTotals(); } 
    
    // Add/remove the shadow on options:
    document.querySelector('#main-container').addEventListener('scroll', () => {
        const optionsContainer = document.querySelector('.options-shop-container');
        if (!optionsContainer) return;

        // Get the position relative to the viewport
        const rect = optionsContainer.getBoundingClientRect();
        const mainContainer = document.getElementById('main-container');
        const mainRect = mainContainer.getBoundingClientRect();

        // Get the computed padding-top of #main-container
        const mainPaddingTop = parseFloat(window.getComputedStyle(mainContainer).paddingTop) || 0;

        // Calculate the relative top position considering the padding
        const relativeTop = rect.top - mainRect.top - mainPaddingTop;

        // Select the background element
        const background = optionsContainer.querySelector('.background');

        // Check if the top of the container is at the top of #main-container (allow a small margin for precision)
        if (Math.abs(relativeTop) <= 2) {
            // At the top: apply fade-in, remove fade-out
            background.classList.add('fade-in');
            background.classList.remove('fade-out');
        }
        else {
            // Not at the top: apply fade-out, remove fade-in
            if (background.classList.contains('fade-in')) {
                background.classList.add('fade-out');
                background.classList.remove('fade-in');
            }
        }
    });

    // Check if enable/disable the button:
    const createCartButton = document.getElementById('create-cart');

    // Set the event to create cart:
    createCartButton.addEventListener('click', () => {
        // Animation button:
        load_button({button: createCartButton, mode: 'add'});
        
        // Block all inputs:
        Array.from(document.querySelectorAll('.input-add-cart')).map(_input => {
            _input.disabled = true;
            apply_class({_element: _input, _class: 'disabled'}); 
        });

        // Get the list item:
        const listItems = Array.from(document.querySelectorAll('.product-button')).map(_product => {
            const productId = parseInt(_product.id.replace('product-cart-id-', ''), 10);
            const productAmount = parseInt(_product.querySelector('.input-add-cart').value, 10);
            return {product_id: productId, quantity: productAmount}; })
            .filter(_product => _product.quantity > 0);
        
        // Convert the data on params:
        const param = {
            shop_id: parseInt(localStorage.getItem('shop-id-selected'), 10),
            items: listItems
        };

        // Check that the data is saved:
        if (localStorage.getItem('shop-id-selected') && localStorage.getItem('shop-id-selected') > 0) {
            // Disable the back button:
            apply_class({_query: '#back', _class: 'disabled'});
            apply_class({_query: '#back', _class: 'fade-out'});
            apply_class({_query: '#back', _class: 'fade-in', _method: 'r'});

            // Check if edit:
            if (_method === 'PUT') { _cartId = `/${_cartId}`; }

            // Get the list ID of items:
            fetch(url + `api/carts${_cartId}`, {
                method: _method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(param)
            })
        
            .then (response => {
                if (!response.ok) {
                    if (response?.status === 401 || response?.code === 401 || localStorage.getItem('token') === '') { check_login({_exit: true}); }
                    else { throw new Error('No se ha podido obtener la información de la tienda'); }
                }
                return response.json();
            })
        
            .then (result => {
                // Functions:
                load_vars();
                globalVars.headerBackShow = false;
                globalVars.dashboardTransitionType = 'fade-in';
                save_vars();

                apply_class({_query: '#back', _class: 'pressed'});
                apply_class({_query: '#header-title', _class: 'move-in'});
                apply_class({_query: '#general-container', _class: 'element-entry-visible', _method: 'r'});
                apply_class({_query: '#general-container', _class: 'element-fade-out'});

                // Block the screen:
                screen_block();

                // Save that the cart is created:
                localStorage.setItem('comes-from', 'dashboard');

                // Check if is new or edited:
                if (createCartButton.classList.contains('is-edit')) { localStorage.setItem('cart', 'edited'); }
                else { localStorage.setItem('cart', 'created'); }
                                
                // Go to file:
                go('../../dashboard/html/dashboard.html', 800);
            })
        
            .catch (error => {
                // Show the error notification:
                create_notification('error', 'Ha ocurrido un error al crear el carrito', 5000, 1000);

                // Enable the back button:
                apply_class({_query: '#back', _class: 'disabled', _method: 'r'});
                apply_class({_query: '#back', _class: 'fade-out', _method: 'r'});
                apply_class({_query: '#back', _class: 'fade-in'});
            })
        }
        else {
            // Show the error notification:
            create_notification('error', 'Ha ocurrido un error al crear el carrito', 5000, 1000);

            // Enable the back button:
            apply_class({_query: '#back', _class: 'disabled', _method: 'r'});
        }
    })

    // --------------------------------------------------------------------------

    // Select all inputs from shops:
    const inputs = document.querySelectorAll('.input-add-cart');
    
    // Add the event:
    if (inputs.length) {
        inputs.forEach(input => {
            // Max stock:
            const stock = parseInt(input.closest('.product-button').querySelector('.stock').textContent);

            input.addEventListener('keydown', (event) => {
                // Prevent the default action if the key
                // is one of the forbidden characters:
                if (['e', ',', '.', '-'].includes(event.key)) {
                    event.preventDefault();
                }
            });

            // Limited the stock:
            input.addEventListener('input', () => {
                // Set the icon:
                if (input.value.trim() > 0) { change_cart_icon(input, 'add'); }
                else { change_cart_icon(input, 'remove'); }

                // Limited the stock:
                if (input.value.trim() > stock) { input.value = stock; }

                // Update totals in the cart summary.
                updateCartTotals();

                // If the cart filter is active, changing a quantity can affect visibility,
                // so we need to update the list.
                const cartButtonIcon = document.getElementById('cart-button')?.querySelector('i');
                if (cartButtonIcon?.classList.contains('selected')) {
                    updateProductList();
                }
            });

            // Limited the stock:
            input.addEventListener('blur', () => {
                // Sanitize value:
                let value = parseInt(input.value, 10);

                // If empty, not a number,
                // or negative, default to 0:
                if (input.value === '') {
                    input.value = 0;
                }

                // Limit the amount:
                if (value > stock) { input.value = stock; }

                // Update cart icon:
                if (value > 0) { change_cart_icon(input, 'add'); }
                else { change_cart_icon(input, 'remove'); }

                // Recalculate totals on blur as well to be safe.
                updateCartTotals();
            });
        });
    }

    // --------------------------------------------------------------------------

    // Add the icons to mini buttons:
    document.querySelectorAll('.mini-button').forEach(_button => {
        // Remove the loading effect:
        apply_class({_element: _button, _class: 'loading-effect', _method: 'r'});

        // Add the icon according to its index:
        const icon = document.createElement('i');

        // Set like selected element:
        if (localStorage.getItem('must-show-cart-elements') === 'show') { icon.classList.add('selected'); }

        // Select the class:
        switch(_button.id) {
            case 'cart-button': { apply_class({_element: icon, _class: 'cart'}); } break; // Cart
            case 'map-button': { apply_class({_element: icon, _class: 'map'}); } break; // Map
            case 'report-button': { apply_class({_element: icon, _class: 'report'}); } break; // Report
            case 'address-button': { apply_class({_element: icon, _class: 'arrow'}); } break; // Address
        }

        // Insert the icon:
        _button.appendChild(icon);
    });

    // --------------------------------------------------------------------------

    // Add the click event for mini buttons on view:
    document.querySelectorAll('.mini-button').forEach(button => {
        button.addEventListener('click', () => {
            // Select the elements from view:
            const container = document.querySelector('.text-container') // Container
            const gradient = document.querySelector('.gradient'); // Gradient
            const icon = button.querySelector('i'); // Icon

            // Check if is not the description button:
            if (button.id !== 'address-button') {
                // Add the bouncing animation to icons:
                repeat_animation(icon, 'animate');

                // Toggle the selected class:
                icon.classList.toggle('selected');
            }

            // Check the index and set the animation
            // and functionality:
            switch (button.id) {
                // Cart:
                case 'cart-button': {
                    // The icon's 'selected' class is toggled automatically.
                    // We just need to call our unified function to update the product list.
                    updateProductList();
                } break;

                // Map:
                case 'map-button': {} break;

                // Report:
                case 'report-button': {} break;

                // Show address:
                case 'address-button': {
                    // Set the value for expand 
                    document.documentElement.style.setProperty('--product-description-max-height', (document.getElementById('shop-address').offsetHeight + 30) + 'px');

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
                } break;
            }

            // Disable for a while, then enable it:
            button.disabled = true;
            setTimeout(() => { button.disabled = false; }, 650);
        });
    });

    // --------------------------------------------------------------------------

    // Variables:
    const inputSearch = document.getElementById('input-search'); // Input for search
    let searchTimeout = null; // Debounce timeout for search.

    // Filter:
    inputSearch.addEventListener('input', () => {
        // Debounce the search:
        if (searchTimeout) { clearTimeout(searchTimeout); }
        searchTimeout = setTimeout(() => {
            // Call the unified function to update the list.
            updateProductList();
        }, 500); // Delay
    });

    // --------------------------------------------------------------------------

    // Update the list of products:
    if (localStorage.getItem('must-show-cart-elements') === 'show') { updateProductList(); }
}
