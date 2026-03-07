// Import the necessary elements:
import { url, apply_class, start_view,
        check_login, back_button, set_theme,
        create_notification, visibility_effect,
        scroll_effect, disable_c_menu, disable_scroll } from '../../general/js/functions/general-functions.js'; // Functions for better optimization

// Import the functionalities:
import { events_products } from './events-products.js';

// When document is loaded:
document.addEventListener('DOMContentLoaded', () => {
    // Functions:
    scroll_effect(); // Scroll effect
    set_theme(); // Set the theme
    disable_scroll(); // Disable the scroll
    disable_c_menu(); // Disable the context menu
    start_view({_mustAnimate: localStorage.getItem('comes-from') === 'dashboard' ? true : false, _callback: () => {
        // Variables:
        let direction = localStorage.getItem('comes-from') === 'categories' ? 'category' : localStorage.getItem('comes-from') === 'show-more' ? 'show-more' : 'dashboard'; // Get the place from come
        let link = `../../${direction}/html/${direction}.html`; // Correct route
        
        // Set the back button functionality:
        back_button({_hide_button: localStorage.getItem('comes-from') === 'categories' || localStorage.getItem('comes-from') === 'show-more' ? false : true,
                    _move_title: localStorage.getItem('comes-from') === 'categories' || localStorage.getItem('comes-from') === 'show-more' ? false : true,
                    _link: link,
                    _delay: 1000, _exit: 'other', _globalVars: [{headerSearchCanTouch: false}],
                    _callback: () => {
            
            // Apply the necessary class:
            apply_class({_query: '#general-container', _class: 'element-entry-visible', _method: 'r'});
            apply_class({_query: '#general-container', _class: 'element-fade-out'});

            // Set where it comes from:
            localStorage.setItem('comes-from', 'product');
        }});
    }});

    // ---------------------------------------------------------------------------

    // Connect to server for get the product information:
    fetch(url + 'api/products/' + localStorage.getItem('product-id-selected'), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })

    // Get the response and convert to JSON, or throw a error:
    .then(response => {
        if (!response.ok) {
            if (response?.status === 401 || response?.code === 401 || localStorage.getItem('token') === '') { check_login({_exit: true}); }
            else { throw new Error('No se ha podido obtener la información del producto'); }
        }
        return response.json();
    })

    // Show the content, insert the elements, and add the functionality:
    .then(result => {
        // Delay:
        setTimeout(() => {
            // Set the values:
            document.getElementById('product-name').textContent = result.data.name; // Name
            document.getElementById('product-subcategory').textContent = result.data.subcategory.name; // Subcategory
            document.getElementById('product-description').textContent = result.data.description; // Description
            
            // -----------------------------------------------------------------------

            // Save the ID from product selected:
            localStorage.setItem('product-selected', result.data.id);

            // Remove the loading effect and add
            // the image, with all the attributes:
            const imageContainer = document.getElementById('image-container');
            apply_class({_element: imageContainer, _class: 'loading-effect', _method: 'r'});
            const image = document.createElement('img')
            image.alt = result.data.name;
            const fallbackUrl = '../../resources/images/error-image.png';
            image.src = result.data?.image ? `${url}storage/${result.data.image}` : fallbackUrl;
            image.onerror = function() {
                this.onerror = null;
                this.src = fallbackUrl;
            };
            imageContainer.appendChild(image);

            // -----------------------------------------------------------------------

            // Get the height from description and
            // add the button if is neeeded:
            if (document.getElementById('product-description').offsetHeight > 62.5) {
                // Add the gradient:
                const gradient = document.createElement('span');
                apply_class({_element: gradient, _class: 'gradient'});
                document.querySelector('.text-container').appendChild(gradient);

                // Add the button:
                const buttonDescription = document.createElement('button');
                apply_class({_element: buttonDescription, _class: 'mini'});
                apply_class({_element: buttonDescription, _class: 'mini-button'});
                apply_class({_element: buttonDescription, _class: 'entry-mini-button'});
                buttonDescription.id = 'description-button';
                document.querySelector('.description-container').appendChild(buttonDescription);

                // Remove the class for better view:
                apply_class({_query: '.separator-2', _class: 'short-description', _method: 'r'});
                apply_class({_query: '#product-description', _class: 'short-description', _method: 'r'});
            }

            // -----------------------------------------------------------------------

            // Select the shop container:
            const shopContainer = document.getElementById('shops-container');
            shopContainer.innerHTML = '';

            // Variables:
            let dataLength = result.data.inventories.length // Elements
            let data = result.data.inventories;

            // Define the correct unit:
            function set_unit(unit, index) {
                // Check if is measure:
                if (unit === 'not_applicable') {
                    if (parseInt(data[index]?.measure) === 1) { return `${parseInt(data[index]?.measure)} Unidad.` }
                    else { return `${parseInt(data[index]?.measure)} Unidades.` }
                }
                else { return `${data[index]?.measure.toString().replace(/\./g, ',')} ${unit.charAt(0).toUpperCase() + unit.slice(1)}.`; }
            }
            
            // Check if exists shops that container:
            if (result.data.inventories.length === 0) {
                // Show message for no inventories:
                const containerLiContainer = document.createElement('li');
                containerLiContainer.innerHTML = `<span class="animate error-list">
                                                <i></i>
                                                <h4>No hay tiendas que vendan este producto</h4>
                                            </span>`;

                // Insert the element:
                shopContainer.appendChild(containerLiContainer);
            }
            else {
                // Insert the shops:
                for (let x = 0; x < dataLength; x++) {
                    // Create the container:
                    const containerLiContainer = document.createElement('li');
                    containerLiContainer.innerHTML = '';
                    apply_class({_element: containerLiContainer, _class: 'set-visibility'});
                    apply_class({_element: containerLiContainer, _class: 'shop-container'});
                    
                    const shopFallbackUrl = '../../resources/images/error-image.png';
                    const shopImageUrl = data[x]?.shop?.image ? `${url}storage/${data[x].shop.image}` : shopFallbackUrl;

                    // Create the container:
                    containerLiContainer.innerHTML += `<div class="shop-button" id="shop-id-${data[x].shop?.id}">
                                                            <div class="shop-image">
                                                                <img src="${shopImageUrl}" alt="${data[x].shop?.name}" onerror="this.onerror=null; this.src='${shopFallbackUrl}';">
                                                            </div>
                                                            <div class="shop-information">
                                                                <h4 class="name">${data[x].shop?.name}</h4>
                                                                <span class="separator"></span>
                                                                <span class="line-text">
                                                                    <h5>Unidad a la venta:</h5>
                                                                    <p>${set_unit(result.data.unit, x)}</p>
                                                                </span>
                                                                <span class="line-text">
                                                                    <h5>Precio unitario:</h5>
                                                                    <p>${data[x].current_price.toString().replace(/\./g, ',')} Ref.</p>
                                                                </span>
                                                                <span class="line-text">
                                                                    <h5>Cantidad disponible:</h5>
                                                                    <p>${data[x].stock}</p>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        `;

                    // Insert the elements:
                    shopContainer.appendChild(containerLiContainer);
                }
            }

            // -----------------------------------------------------------------------

            // Remove the loading effect on search input:
            apply_class({_query: '.input-search-container', _class: 'loading-effect', _method: 'r'});

            // -----------------------------------------------------------------------

            // Change the label on screen:
            document.getElementById('label-favorites').textContent = 'Añadir a favoritos:';

            // -----------------------------------------------------------------------

            // Variable:
            let recentProducts = [];

            // Add the product to recent products list:
            if (!localStorage.getItem('recent-products')) {
                // Add the first element:
                recentProducts = [localStorage.getItem('product-id-selected')];
                localStorage.setItem('recent-products', JSON.stringify(recentProducts));
            }
            else {
                // Add one more element:
                recentProducts = JSON.parse(localStorage.getItem('recent-products')) || [];

                // Check list:
                if (recentProducts) {
                    // Check if the element already exist
                    // and remove on this case:
                    if (recentProducts.includes(localStorage.getItem('product-id-selected'))) {
                        recentProducts.splice(recentProducts.indexOf(localStorage.getItem('product-id-selected')), 1);
                    }

                    // Add the new element, remove the first
                    // if list is so big, and saved the list:
                    recentProducts.push(localStorage.getItem('product-id-selected'));
                    if (recentProducts.length === 15) { recentProducts.splice(0, 1); }
                    localStorage.setItem('recent-products', JSON.stringify(recentProducts));
                }
            }
            
            // -----------------------------------------------------------------------

            // Set the visibility effect:
            visibility_effect({});

            // -----------------------------------------------------------------------

            // Add the functionality to buttons:
            events_products();
        }, 1500);
    })

    // Show the error notification:
    .catch(error => {
        // Show the error notification:
        create_notification('error', 'Ha ocurrido un error al conectarse al servidor', 5000, 1000);
    })
});
