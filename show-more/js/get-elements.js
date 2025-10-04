// Import the necessary elements:
import { url, check_login, create_notification, apply_class,
        enable_scroll, visibility_effect, back_button,
        start_view } from '../../general/js/functions/general-functions.js'; // Functions for better optimization

// Import the functionality:
import { events_elements } from './events-elements.js';

// Function for get the elements to show:
export function get_elements(_type) {
    // Define if must show the element from server or not:
    let mustShow = true;

    // Start the view correctly:
    start_view({_mustAnimate: localStorage.getItem('comes-from') === 'dashboard' ? true : false, _callback: () => {
        // Back button functionality:
        back_button({_delay: 1000, _callback: () => {
            // Apply the exit animation to the input and the main section
            ['.input-search-container-fix', 'section', '#container'].forEach(selector => {
                apply_class({_query: selector, _class: 'element-entry-visible', _method: 'r'});
                apply_class({_query: selector, _class: 'element-fade-out'});
            });

            // Cancel show the elements:
            mustShow = false;
        }})
    }});
    
    // Connect to server:
    fetch(url + `api/${_type}`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    
    .then (response => {
        if (!response.ok) {
            if (response?.status === 401 || response?.code === 401 || localStorage.getItem('token') === '') { check_login({_exit: true}); }
            else { throw new Error('No se ha podido obtener la información del Dashboard'); }
        }
        return response.json();
    })

    .then (result => {
        // Check if must show:
        if (mustShow) {
            // Enable the scroll again:
            enable_scroll();

            // Remove the loading effect from input:
            const inputContainer = document.querySelector('.input-search-container');
            inputContainer.classList.remove('loading-effect');

            // Change the label:
            const input = inputContainer.querySelector('input');
            
            switch (_type) {
                case 'categories': input.placeholder = 'Buscar categoría'; break;
                case 'products': input.placeholder = 'Buscar producto'; break;
                case 'shops': input.placeholder = 'Buscar tienda'; break; 
            }

            // Remove the previous templates inserted:
            const container = document.getElementById('container');
            container.innerHTML = '';

            // Insert the correct elements:
            result.data.data.forEach(_item => {
                // Create the wrapper:
                const wrapper = document.createElement('li');
                wrapper.classList.add(`${localStorage.getItem('show-more')}-button` || 'categories-button', 'set-visibility', 'element-not-visible', 'show-more-element');

                // Check the element to insert:
                switch (_type) {
                    case 'categories': {
                        wrapper.innerHTML = `<div class="show-more-button category" id="category-id-${_item?.id}">
                                                <i style="mask-image: url('${url}storage/${_item?.icon}');"></i>
                                            </div>
                                            <h2 class="name">${_item?.name}</h2>`;
                    } break;

                    case 'products': {
                        const fallbackUrl = '../../resources/images/error-image.png';
                        const imageUrl = _item?.image ? `${url}storage/${_item.image}` : fallbackUrl;

                        wrapper.innerHTML = `<div class="show-more-button product" id="product-id-${_item?.id}">
                                                <div>
                                                    <img src="${imageUrl}" alt="${_item?.name}" onerror="this.onerror=null; this.src='${fallbackUrl}';">
                                                </div>
                                                <h4 class="name">${_item?.name}</h4>
                                            </div>`;
                    } break;

                    case 'shops': {
                        const fallbackUrl = '../../resources/images/error-image.png';
                        const imageUrl = _item?.image ? `${url}storage/${_item.image}` : fallbackUrl;

                        wrapper.innerHTML = `<div class="show-more-button shop" id="shop-id-${_item?.id}">
                                                <div>
                                                    <img src="${imageUrl}" alt="${_item?.name}" onerror="this.onerror=null; this.src='${fallbackUrl}';">
                                                </div>
                                                <h4 class="name">${_item?.name}</h4>
                                            </div>`;
                    } break;
                }

                // Insert the element:
                container.appendChild(wrapper);

            });

            // Apply visibility effect:
            visibility_effect({_container: '#dashboard'});

            // Aplicamos la funcionalidad una sola vez, después de insertar todos los elementos.
            events_elements(_type);
        }
    })

    .catch (error => {
        console.log(error);

        create_notification('error', 'Ha ocurrido un error al conectarse al servidor', 5000, 1000);
    })
}
