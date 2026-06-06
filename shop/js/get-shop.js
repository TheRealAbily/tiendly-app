// Import the necessary elements:
import { url, apply_class, start_view,
        check_login, back_button, set_theme,
        create_notification, visibility_effect,
        scroll_effect, disable_c_menu, disable_scroll } from '../../general/js/functions/general-functions.js'; // Functions for better optimization

// Import the functionalities:
import { events_shop, format_price } from './events-shop.js';

// Variable:
let dollarPrice = 0;

// Order method for shops:
let orderMethod = 'By price';
let resultFromApi = '';

// Export the dollar price:
export function dollar_price({_mode = 'set', _amount = 0}) {
    if (_mode === 'set') { dollarPrice = _amount; }
    else { return parseFloat(parseFloat(dollarPrice).toFixed(2)); }
}

// When document is loaded:
document.addEventListener('DOMContentLoaded', () => {
    // Functions:
    check_login({}); // Check if the user is logged
    scroll_effect(); // Scroll effect
    set_theme(); // Set the theme
    disable_scroll(); // Disable the scroll
    disable_c_menu(); // Disable the context menu
    start_view({_mustAnimate: localStorage.getItem('comes-from') === 'dashboard' ? true : false, _callback: () => {
        // Variables:
        let direction = localStorage.getItem('comes-from') === 'category' ? 'category' : 'dashboard'; // Get the place from come
        let link = `../../${localStorage.getItem('comes-from')}/html/${localStorage.getItem('comes-from')}.html`; // Correct route
        
        // Set the back button functionality:
        back_button({_hide_button: localStorage.getItem('comes-from') === 'product' || localStorage.getItem('comes-from') === 'show-more' ? false : true,
                    _move_title: localStorage.getItem('comes-from') === 'product' || localStorage.getItem('comes-from') === 'show-more' ? false : true,
                    _link: link,
                    _delay: 1000, _exit: 'other', _globalVars: [{headerSearchCanTouch: false}],
                    _callback: () => {
            
            // Apply the necessary class:
            apply_class({_query: '#general-container', _class: 'element-entry-visible', _method: 'r'});
            apply_class({_query: '#general-container', _class: 'element-fade-out'});

            // Set where it comes from:
            localStorage.setItem('comes-from', 'shop');
        }});
    }});

    // ---------------------------------------------------------------------------

    // Connect to server for get the product information:
    fetch(url + `api/shops/${localStorage.getItem('shop-id-selected')}`, {
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
            else { throw new Error('No se ha podido obtener la información de la tienda'); }
        }
        return response.json();
    })

    // Show the content, insert the elements, and add the functionality:
    .then(responseApi => {
        resultFromApi = responseApi;
        const result = orderProductResponse(responseApi, 'product.name', 'asc');

        // Delay:
        setTimeout(() => {
            let foundFirstProduct = false;

            // Obtener la ID seleccionada por el usuario
            const selectedProductId = localStorage.getItem('product-selected');

            // Obtener el inventario desde el servidor
            const inventories = result.data.inventories;

            // Reordenar el inventario: el producto seleccionado primero
            let newInventoryOrder = [];
            if (selectedProductId) {
                // Buscar el producto seleccionado
                const selectedProduct = inventories.find(item => String(item.product?.id) === String(selectedProductId));
                // Agregar el producto seleccionado al inicio si existe
                if (selectedProduct) {
                    newInventoryOrder.push(selectedProduct);
                }
                // Agregar el resto de productos (excepto el seleccionado)
                newInventoryOrder = newInventoryOrder.concat(
                    inventories.filter(item => String(item.product?.id) !== String(selectedProductId))
                );

                foundFirstProduct = true;
            } else {
                // Si no hay producto seleccionado, mantener el orden original
                newInventoryOrder = inventories;
            }

            // Set the values:
            document.getElementById('shop-name').textContent = result.data.name; // Name
            document.getElementById('shop-subcategory').textContent = result.data.is_active === 1 ? 'Abierto' : 'Cerrado'; // Status
            document.getElementById('shop-address').textContent = result.data.address; // Address
            
            document.getElementById('total-price-dolar-items').textContent = parseFloat(result.data.bcv).toFixed(2) + ' Bs.'; // Dolar price
            dollar_price({_mode: 'set', _amount: result.data.bcv});

            // Set a color for status:
            apply_class({_query: '#shop-subcategory', _class: (result.data.is_active === 1 ? 'open' : 'close')});
            
            // -----------------------------------------------------------------------

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

            // Get the height from address and
            // add the button if is neeeded:
            if (document.getElementById('shop-address').offsetHeight > 62.5) {
                // Add the gradient:
                const gradient = document.createElement('span');
                gradient.classList.add('gradient');
                document.querySelector('.text-container').appendChild(gradient);

                // Add the button:
                const buttonDescription = document.createElement('button');
                buttonDescription.classList.add('mini-button', 'mini', 'entry-mini-button');
                buttonDescription.id = 'address-button';
                document.querySelector('.description-container').appendChild(buttonDescription);

                // Remove the class for better view:
                document.querySelector('.separator-2').classList.remove('short-description');
                document.getElementById('shop-address').classList.remove('short-description');
            }

            // -----------------------------------------------------------------------

            // Select the products container:
            const productsContainer = document.getElementById('products-container');
            productsContainer.innerHTML = '';

            // Variables:
            let dataLength = newInventoryOrder.length // Elements
            let data = newInventoryOrder;

            // Define the correct unit:
            function set_unit(unit, index, just_value = false) {
                // Check if is measure:
                if (!just_value) {
                    if (unit === 'not_applicable') {
                        if (parseInt(data[index]?.measure) === 1) { return `${parseInt(data[index]?.measure)} Unidad.` }
                        else { return `${parseInt(data[index]?.measure)} Unidades.` }
                    }
                    else { return `${data[index]?.measure.toString().replace(/\./g, ',')} ${unit.charAt(0).toUpperCase() + unit.slice(1)}.`; }
                }
                else { return parseFloat(data[index]?.measure); }
            }
            
            // Check if exists shops that container:
            if (newInventoryOrder.length === 0) {
                // Show message for no inventories:
                const containerLiContainer = document.createElement('li');
                containerLiContainer.innerHTML = `<span class="animate error-list">
                                                <i></i>
                                                <h4>No hay productos disponibles en esta tienda</h4>
                                            </span>`;

                // Insert the element:
                productsContainer.appendChild(containerLiContainer);
            }
            else {
                // Input value for default and preserve previous quantities if any:
                let inputValue = 0;
                let iconClass = null;

                // Preserve existing quantities when rebuilding the list (so user edits are not lost by sorting/filtering)
                const existingQuantities = {};
                document.querySelectorAll('.product-button').forEach(pb => {
                    const pid = parseInt(pb.id.replace('product-cart-id-',''), 10);
                    const val = parseInt(pb.querySelector('.input-add-cart')?.value, 10);
                    if (!isNaN(pid)) { existingQuantities[pid] = !isNaN(val) ? val : 0; }
                });

                // Insert the products:
                for (let x = 0; x < dataLength; x++) {
                    if (data[x].stock >= 1) {
                        const currentProductId = parseInt(data[x].product?.id, 10);

                        // Determine input value: prefer previously set value, otherwise if this is the selected product set to 1, else 0
                        if (existingQuantities.hasOwnProperty(currentProductId)) {
                            inputValue = existingQuantities[currentProductId];
                        } else if (selectedProductId && String(currentProductId) === String(selectedProductId)) {
                            inputValue = 1;
                            localStorage.setItem('product-selected-founded', 'found');
                        } else {
                            inputValue = 0;
                        }

                        iconClass = inputValue > 0 ? 'selected' : null;

                        // Create the container:
                        const containerLiContainer = document.createElement('li');
                        containerLiContainer.innerHTML = '';
                        apply_class({_element: containerLiContainer, _class: 'set-visibility'});
                        apply_class({_element: containerLiContainer, _class: 'product-container'});
                        
                        const productFallbackUrl = '../../resources/images/error-image.png';
                        const productImageUrl = data[x]?.product?.image ? `${url}storage/${data[x].product.image}` : productFallbackUrl;

                        // Create the container:
                        containerLiContainer.innerHTML += `<div class="product-button set-visibility element-entry-visible" id="product-cart-id-${data[x].product?.id}">
                                                                <div class="product-image">
                                                                    <img src="${productImageUrl}" alt="${data[x].product?.name}" onerror="this.onerror=null; this.src='${productFallbackUrl}';">
                                                                </div>
                                                                <div class="product-information">
                                                                    <h4 class="name">${data[x].product?.name}</h4>
                                                                    <span class="separator"></span>
                                                                    <span class="line-text">
                                                                        <h5>Unidad a la venta:</h5>
                                                                        <p>${set_unit(data[x]?.product?.unit, x)}</p>
                                                                        <p class="unit-product">${set_unit(data[x]?.product?.unit, x, true)}</p>
                                                                    </span>
                                                                    <span class="line-text">
                                                                        <h5>Precio unitario:</h5>
                                                                        <p class="price">${data[x].current_price.toString().replace(/\./g, ',')} Ref.</p>
                                                                    </span>
                                                                    <span class="line-text">
                                                                        <h5>Cantidad disponible:</h5>
                                                                        <p class="stock">${data[x].stock}</p>
                                                                    </span>
                                                                </div>
                                                                <div class="product-cart">
                                                                    <i class="${iconClass}"></i>
                                                                    <input class="input-add-cart" type="number" min="0" max="${data[x].stock}" value="${inputValue}" placeholder=". . .">
                                                                </div>
                                                            </div>`;

                        // Insert the elements:
                        productsContainer.appendChild(containerLiContainer);
                    }
                }
            }

            // -----------------------------------------------------------------------

            // Remove the loading effect on search input:
            document.querySelector('.input-search-container').classList.remove('loading-effect');

            // -----------------------------------------------------------------------

            // Remove the loading effect on cart:
            document.querySelector('.user-cart').classList.remove('loading-effect');

            // -----------------------------------------------------------------------

            // Remove the loading effect on filter input:
            apply_class({_query: '#filter-button', _class: 'loading-effect', _method: 'r'});

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
                            case 0: { orderMethod = 'By price'; sortProductsDOM('#products-container', 'price', 'asc'); } break;
                            case 1: { orderMethod = 'By name'; sortProductsDOM('#products-container', 'name', 'asc'); } break;
                            case 2: { orderMethod = 'By unit'; sortProductsDOM('#products-container', 'unit', 'asc'); } break;
                        }
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

            // Change the label on screen:
            document.getElementById('label-products').textContent = 'Productos en el carrito:';

            // -----------------------------------------------------------------------

            // Set the visibility effect:
            visibility_effect({});

            // -----------------------------------------------------------------------

            // Set the cart items:
            if (result.data.cart?.status === 'pending') {
                const cartItems = Array.isArray(result.data.cart?.cart_items) ? result.data.cart.cart_items : [];
                cartItems.forEach(_product => {
                    const cartSection = document.querySelector(`#product-cart-id-${_product.product_id}`);
                    if (!cartSection) return;
                    
                    // Restore the cart saved:
                    const icon = cartSection.querySelector('.product-cart i');
                    if (icon) icon.classList.add('selected'); // Icon
                    const qtyInput = cartSection.querySelector('.input-add-cart');
                    if (qtyInput) qtyInput.value = _product.quantity; // Quantity
                });

                // Edit the button:
                const editCartButton = document.getElementById('create-cart')
                editCartButton.textContent = 'Editar carrito';
                editCartButton.disabled = false;
                apply_class({_element: editCartButton, _class: 'disabled', _method: 'r'});
                apply_class({_element: editCartButton, _class: 'is-edit'});

                // Set the total items and price (on Ref.):
                document.getElementById('total-amount-items').textContent = Array.from(result.data.cart.cart_items).reduce((acc, _product) => acc + _product.quantity, 0);
                document.getElementById('total-price-items').textContent = parseFloat(result.data.cart.total_price).toFixed(2).replace(/\./g, ',') + ' Ref.';
                document.getElementById('total-price-bs-items').textContent = format_price((parseFloat(result.data.cart.total_price.replace(',', '.')) * dollar_price({_mode: 'return'})).toFixed(2).replace(/\./g, ',')) + ' Bs.';
                
                // Add the functionality to buttons:
                events_shop('PUT', result.data.cart?.id);
            }
            else {
                // Add the functionality to buttons:
                events_shop('POST');
            }
        }, 1500);
    })

    // Show the error notification:
    .catch(error => {
        // Check if the user is logged:
        check_login({});
        console.log(error);
        // Show the error notification:
        create_notification('error', 'Ha ocurrido un error al conectarse al servidor', 5000, 1000);
    })
});

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

function sortProductsDOM(containerSelector, criteria, order = 'asc') {
    const container = document.querySelector(containerSelector);
    if (!container) { 
        return; 
    }

    // Convertimos los nodos hijos en un array para poder usar .sort()
    const products = Array.from(container.children);

    products.sort((a, b) => {
        let valueA, valueB;

        // Extraemos el valor según el criterio seleccionado
        if (criteria === 'name') {
            valueA = a.querySelector('.name')?.textContent.trim() || '';
            valueB = b.querySelector('.name')?.textContent.trim() || '';
            return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        }

        if (criteria === 'price') {
            // Limpiamos el texto removiendo "Ref." y cambiando la coma decimal por punto para operarlo como número
            const rawA = a.querySelector('.price')?.textContent.replace('Ref.', '').replace(/\s/g, '').replace(',', '.') || '0';
            const rawB = b.querySelector('.price')?.textContent.replace('Ref.', '').replace(/\s/g, '').replace(',', '.') || '0';
            valueA = parseFloat(rawA);
            valueB = parseFloat(rawB);
        }

        if (criteria === 'unit') {
            valueA = parseInt(a.querySelector('.unit-product')?.textContent.trim() || '0', 10);
            valueB = parseInt(b.querySelector('.unit-product')?.textContent.trim() || '0', 10);
        }

        return order === 'asc' ? valueA - valueB : valueB - valueA;
    });

    // Movemos los elementos en el DOM uno por uno según el nuevo orden
    products.forEach(product => {
        container.appendChild(product);
    });
}
