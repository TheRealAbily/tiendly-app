// Import the necessary elements:
import { url, apply_class, get_css_values,
        check_login, create_notification, back_button,
        visibility_effect} from '../../general/js/functions/general-functions.js'; // Functions for better optimization

// Import the function:
import { events_category } from './events-category.js';

// Export the function to get information Category:
export function get_category() {
    // Functions:
    check_login({}); // Check if the user is logged

    // Check if can show the elements from fetch:
    let canShowElements = true;

    // Variables:
    let direction = localStorage.getItem('comes-from') === 'show-more' ? 'show-more' : 'dashboard'; // Get the place from come

    // Back button:
    back_button({_hide_button: localStorage.getItem('comes-from') === 'show-more' ? false : true,
                _move_title: localStorage.getItem('comes-from') === 'show-more' ? false : true,
                _link: `../../${direction}/html/${direction}.html`, _exit: 'other',
                _delay: 1000, _globalVars: [{headerSearchCanTouch: false}], _callback: () => {
                    
        // Select the general container and subtitle:
        apply_class({_query: '#general-container', _class: 'element-entry-visible', _method: 'r'});
        apply_class({_query: '#general-container', _class: 'element-fade-out'});
        apply_class({_query: '#subtitle', _class: 'element-entry-visible', _method: 'r'});
        apply_class({_query: '#subtitle', _class: 'element-fade-out'});
        apply_class({_query: '.input-search-container-fix', _class: 'element-entry-visible', _method: 'r'});
        apply_class({_query: '.input-search-container-fix', _class: 'element-fade-out'});

        // Abovid show the elements on view:
        canShowElements = false;
    }});

    // ---------------------------------------------------------------------------

    // Connect to server:
    fetch (url + `api/categories/${localStorage.getItem('category-id-selected') || 1}`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })

    .then (response => {
        if (!response.ok) {
            if (response?.status === 401 || response?.code === 401 || localStorage.getItem('token') === '') { check_login({_exit: true}); }
            else { throw new Error('No se ha podido obtener la información de las categorías'); }
        }
        else { if (localStorage.getItem('token') === '') { check_login({_exit: true}); } }

        return response.json();
    })

    .then (result => {
        // Check if this can show the products:
        if (canShowElements) {
            // Functions:
            insert_elements(result.data.name, result.data.subcategories); // Insert the elements
            events_category(); // Add the events click to products buttons
        }
    })

    .catch (error => {
        console.log(error);
        // Show the error notification:
        create_notification('error', 'Ha ocurrido un error al conectarse al servidor', 5000, 1000);
    })
}

// ----------------------------------------------------------------------------------------------------------------

// Insert the elements:
function insert_elements(name, subcategories) {
    // Get the container and check if exists:
    const generalContainer = document.getElementById('general-container');
    if (!generalContainer) return;

    // Filter the categorys that have products:
    const subcategoriesWithProducts = subcategories.filter(sub => sub.products && sub.products.length > 0);

    // Show the error message if not exists categorys:
    if (subcategoriesWithProducts.length === 0) {
        // Wait until the products is showed:
        setTimeout(() => {
            // Remove the others containers:
            apply_class({_query: '#general-container', _class: 'element-fade-out'});
            apply_class({_query: '#general-container', _class: 'element-entry-visible', _method: 'r'});

            // Hide the main subtitle from the view:
            apply_class({_query: '#subtitle', _class: 'element-fade-out'});
            apply_class({_query: '#subtitle', _class: 'element-entry-visible', _method: 'r'});

            // Hide the input:
            apply_class({_query: '.input-search-container-fix', _class: 'element-fade-out'});
            apply_class({_query: '.input-search-container-fix', _class: 'element-entry-visible', _method: 'r'});
            
            // Show the error message:
            setTimeout(() => {
                // Clear the container:
                generalContainer.innerHTML = ``;
                generalContainer.classList.remove('element-fade-out');

                // Create the error item:
                const errorElement = document.createElement('div');
                errorElement.classList.add('error-list', 'animate');
                errorElement.innerHTML = `<i class="products"></i>
                                            <h4>No existen productos<br>pertenecientes a esta categoría</h4>`;
                generalContainer.appendChild(errorElement);
            }, 750);
        }, 1500);

        // Exit the function:
        return;
    }
    
    // Set the title if exists:
    if (name) { document.querySelector('#subtitle').textContent = name; }

    // Remove the loading effect from input:
    apply_class({_query: '.input-search-container', _class: 'loading-effect', _method: 'r'});

    // Clear the container:
    generalContainer.innerHTML = ``;

    // 3. Usa un DocumentFragment para mejorar el rendimiento.
    //    Construimos todo en memoria y lo añadimos al DOM una sola vez al final.
    const fragment = document.createDocumentFragment();
    const productsPerRow = Math.floor(generalContainer.offsetWidth / get_css_values({_propertys: ['--dashboard-products-min-width', '--dashboard-margin-width']})) || 1;

    // 4. Recorre solo las subcategorías filtradas y crea su HTML.
    subcategoriesWithProducts.forEach((sub, index) => {
        // Crea y añade el título de la subcategoría
        const title = document.createElement('h3');
        title.className = `subtitle set-visibility category-element subcategory-${sub.name.replace(/ /g, '-')} subcategory-title-${sub.name.replace(/ /g, '-')}`;
        title.textContent = sub.name;
        fragment.appendChild(title);

        // Crea el contenedor UL para los productos
        const productRow = document.createElement('ul');
        productRow.classList.add(`subcategory-${sub.name.replace(/ /g, '-')}`, `subcategory-container-${sub.name.replace(/ /g, '-')}`, 'mini-container', 'set-visibility', 'category-element');

        const products = sub.products;
        const totalProducts = products.length;
        let allLiHTML = '';

        // Itera sobre los productos en grupos dinámicos para crear los <li>
        for (let i = 0; i < totalProducts; i += productsPerRow) {
            const chunk = products.slice(i, i + productsPerRow);
            let productsInLiHTML = '';

            // Genera el HTML para cada producto en el grupo
            chunk.forEach(product => {
                const fallbackUrl = '../../resources/images/error-image.png';
                const imageUrl = product.image ? `${url}storage/${product.image}` : fallbackUrl;

                productsInLiHTML += `<div class="product-button" id="product-id-${product.id}">
                                        <div>
                                            <img src="${imageUrl}" alt="${product.name}" onerror="this.onerror=null; this.src='${fallbackUrl}';">
                                        </div>
                                        <h4 class="product-name">${product.name}</h4>
                                    </div>`;
            });

            // Añade elementos invisibles si el grupo está incompleto (siempre que chunk.length < productsPerRow)
            const placeholdersNeeded = productsPerRow - chunk.length;
            for (let j = 0; j < placeholdersNeeded; j++) {
                productsInLiHTML += `<div class="product-button hide"></div>`;
            }

            allLiHTML += `<li class="original-container">${productsInLiHTML}</li>`;
        }

        productRow.innerHTML = allLiHTML;
        fragment.appendChild(productRow);

        // Añade un separador, excepto después de la última subcategoría
        // if (index < subcategoriesWithProducts.length - 1) {
        //     const separator = document.createElement('span');
        //     separator.className = `line-separator fix set-visibility category-element subcategory-${sub.name.replace(' ', '-')} subcategory-line-${sub.name.replace(' ', '-')}`;
        //     fragment.appendChild(separator);
        // }

        const separator = document.createElement('span');
        separator.className = `line-separator fix set-visibility category-element subcategory-${sub.name.replace(/ /g, '-')} subcategory-line-${sub.name.replace(/ /g, '-')}`;
        fragment.appendChild(separator);
    });

    // Insert the content:
    generalContainer.appendChild(fragment);

    // Select all elements from view for apply the entry class:
    document.querySelectorAll('.category-element').forEach(element => {
        // Variables:
        const rect = element.getBoundingClientRect(); // Get the border of element
        const fullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight; // Check if inside

        // Check if full visible inside of container:
        if (fullyVisible) {
            apply_class({_element: element, _class: 'element-not-visible', _method: 'r'});
            apply_class({_element: element, _class: 'set-visibility', _method: 'r'});
        }
        else { apply_class({_element: element, _class: 'element-not-visible'}); }
    });

    // Apply the entry animation to specifics elements:
    requestAnimationFrame(() => visibility_effect({_query: '.set-visibility', _container: '#category'}));
}
