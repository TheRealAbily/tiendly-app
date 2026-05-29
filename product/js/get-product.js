// Import the necessary elements:
import { url, apply_class, start_view,
        check_login, back_button, set_theme,
        create_notification, visibility_effect,
        scroll_effect, disable_c_menu, disable_scroll } from '../../general/js/functions/general-functions.js'; // Functions for better optimization

// Import the functionalities:
import { events_products } from './events-products.js';

// Order method for shops:
let orderMethod = 'By price';
let resultFromApi = '';

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
    .then(responseApi => {
        resultFromApi = responseApi;
        const result = orderProductResponse(responseApi, 'current_price', 'asc');

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

            // Remove the loading effect on filter input:
            apply_class({_query: '#filter-button', _class: 'loading-effect', _method: 'r'});

            // -----------------------------------------------------------------------

            // Change the label on filter button:
            const filterButton = document.getElementById('filter-button');
            filterButton.innerHTML = `Filtros <i></i>`;
            filterButton.addEventListener('click', () => {
                apply_class({_query: '#filter-pause', _class: 'block'});
                setTimeout(() => { apply_class({_query: '#filter-pause', _class: 'block', _method: 'r'}); }, 650);

                document.getElementById('filter-screen').classList.remove('remove-background');
                document.getElementById('filters').classList.remove('has-closed');
                document.getElementById('filter-screen').classList.add('has-background');
                document.getElementById('filters').classList.add('has-opened');
            })

            // -----------------------------------------------------------------------

            // Apply the class for fitler buttons:
            document.querySelectorAll('.filter-button').forEach((button, index) => {
                button.addEventListener('click', () => {
                    if (!button.classList.contains('marked')) {
                        document.querySelectorAll('.filter-button').forEach(otherButton => {
                            otherButton.classList.remove('marked', 'animate');
                            otherButton.innerHTML = '';
                        })

                        apply_class({_element: button, _class: 'animate', _method: 'r'});
                        void button.offsetHeight;
                        apply_class({_element: button, _class: 'animate'});

                        apply_class({_element: button, _class: 'marked'});
                        button.innerHTML = '<i></i>';

                        switch (index) {
                            case 0: { orderMethod = 'By price'; } break;
                            case 1: { orderMethod = 'By name'; } break;
                            case 2: { orderMethod = 'By unit'; } break;
                        }

                        newOrder();
                    }
                })
            })

            // -----------------------------------------------------------------------

            // Accept the filters:
            document.getElementById('filter-accept').addEventListener('click', function () {
                apply_class({_query: '#filter-pause', _class: 'block'});
                setTimeout(() => { apply_class({_query: '#filter-pause', _class: 'block', _method: 'r'}); }, 650);

                document.getElementById('filter-screen').classList.remove('has-background');
                document.getElementById('filters').classList.remove('has-opened');
                document.getElementById('filter-screen').classList.add('remove-background');
                document.getElementById('filters').classList.add('has-closed');
            })
            
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

// -----------------------------------------------------------------------

function orderProductResponse(response, routeKey, order = 'asc') {
    // Clonamos el objeto de respuesta
    const newResponse = { 
        ...response,
        data: {
            ...response.data,
            inventories: response.data && Array.isArray(response.data.inventories) ? [...response.data.inventories] : []
        }
    };

    const targetArray = newResponse.data.inventories;

    // Si por alguna razón no hay inventarios, retornamos la respuesta intacta
    if (targetArray.length === 0) {
        return newResponse;
    }

    // Función interna para navegar en el árbol de cada inventario (ej: 'shop.name')
    const getValueOnRoute = (object, route) => {
        return route.split('.').reduce((obj, key) => { return obj ? obj[key] : undefined; }, object);
    };

    // Ordenamos el array de inventarios
    targetArray.sort((a, b) => {
        let valueA = getValueOnRoute(a, routeKey);
        let valueB = getValueOnRoute(b, routeKey);

        // Si los valores son strings (como el nombre de la tienda), usamos localeCompare
        if (typeof valueA === 'string') {
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }

        // Si son números o strings numéricos (como measure: "18.23"), los casteamos a Number
        return order === 'asc' ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA);
    });

    return newResponse;
}

function newOrder() {
    switch (orderMethod) {
        case 'By price': { resultFromApi = orderProductResponse(resultFromApi, 'current_price', 'asc'); } break;
        case 'By name': { resultFromApi = orderProductResponse(resultFromApi, 'shop.name', 'asc'); } break;
        case 'By unit': { resultFromApi = orderProductResponse(resultFromApi, 'measure', 'asc'); } break;
    }

    // Select the shop container:
    const shopContainer = document.getElementById('shops-container');
    shopContainer.innerHTML = '';

    // Variables:
    let dataLength = resultFromApi.data.inventories.length // Elements
    let data = resultFromApi.data.inventories;

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
    if (resultFromApi.data.inventories.length === 0) {
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
                                                            <p>${set_unit(resultFromApi.data.unit, x)}</p>
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
            
        // -----------------------------------------------------------------------

        document.querySelectorAll('li').forEach(container => {
            // Element name:
            const shopName = container.querySelector('.name').textContent.trim().toLowerCase() || '';

            // Search it:
            const searchValue = document.getElementById('input-search').value.trim().toLowerCase();
            if (shopName.startsWith(searchValue) || searchValue === '') { container.style.display = 'flex'; }
            else { container.style.display = 'none'; }
            
            // Entry animation:
            apply_class({_element: container, _class: 'element-not-visible'});
            apply_class({_element: container, _class: 'element-entry-visible', _method: 'r'});

            // Get all elements showed:
            const showedElements = Array.from(document.querySelectorAll('.shop-container')).filter(_element => _element.style.display !== 'none');

            // Apply the entry animation to specifics elements:
            requestAnimationFrame(() => {
                // Select just the message error:
                if (showedElements.length === 0) {
                    // Select and remove the error item:
                    let errorItem = document.getElementById('not-found-shops');
                    if (errorItem) { errorItem.remove(); }
                    
                    // Create the error item:
                    const errorElement = document.createElement('div');
                    errorElement.id = 'not-found-shops';
                    errorElement.classList.add('error-list', 'animate', 'not-found-shops');
                    errorElement.innerHTML = `<i class="shops"></i>
                                                <h4>No se han encontrado<br>tiendas que coincidan</h4>`;
                    
                    document.getElementById('general-container').appendChild(errorElement);
                }
                else {
                    // Apply the effect:
                    showedElements.forEach(_element => {
                        visibility_effect({_element: _element, _container: '#shops-container'})
                    });
                }
            });

            // Create the observer:
            visibility_effect({});
        });

        // -----------------------------------------------------------------------

        // Add the functionality to buttons:
        events_products('update');
    }
}
