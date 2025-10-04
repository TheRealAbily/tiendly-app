// Import the necessary elements:
import { url, get_css_values, check_login, create_notification, apply_class } from '../../../general/js/functions/general-functions.js'; // Functions for better optimization
import { events_dashboard } from './events-dashboard.js'; // Apply the functionality to Dashboard

// Get the information of Dashboard from server:
export function get_dashboard () {
    // Check if the user is logged:
    check_login({});

    // Remove the last product selected:
    localStorage.removeItem('product-id-selected');
    localStorage.removeItem('product-selected');
    localStorage.removeItem('product-selected-founded');
    localStorage.removeItem('must-show-cart-elements');

    // Elements saved on localStorage:
    const recentlyViewed = JSON.parse(localStorage.getItem('recent-products')) || [];
    const favorites = JSON.parse(localStorage.getItem('my-favorites-products')) || [];

    // Chceck if exist products:
    if (recentlyViewed) { recentlyViewed.reverse(); }

    // Create the query with URLSearchParams:
    const params = new URLSearchParams();
    recentlyViewed.forEach(v => params.append("products_recently_viewed[]", v));
    favorites.forEach(v => params.append("products_favorites[]", v));
    
    // Connect server for get the Dashboard:
    fetch(url + `api/dashboard?` + params.toString(), {
        headers: {
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
        // Show the ads:
        insert_elements(result.data.advertisements, 'ads');

        // Show the categories:
        insert_elements(result.data.categories, 'categories');

        // Check if must show the recently viewed elements:
        if (result.data.products_recently_viewed.length > 0) {
            insert_elements(result.data.products_recently_viewed, 'recent');
        }

        // Check if must show the favorites elements:
        if (result.data.products_favorites.length > 0) {
            insert_elements(result.data.products_favorites, 'my-favorites');
        }
        
        // Show the products:
        insert_elements(result.data.products, 'popular');

        // Show the shops:
        insert_elements(result.data.shops, 'shops');

        // Show the big ads:
        insert_elements(result.data.advertisements_large, 'big-ads');

        // Add the events to dashboard:
        events_dashboard();

        // Remove the loading effect:
        document.querySelectorAll('.button-container').forEach(_button => {
            apply_class({_element: _button, _class: 'can-overflow'});
            apply_class({_element: _button, _class: 'loading-effect', _method: 'r'});
        })
    })

    .catch (error => { create_notification('error', 'Ha ocurrido un error al conectarse al servidor', 5000, 1000); console.log(error); })
}

// ----------------------------------------------------------------------------------------------------------------

// Insert the elements:
function insert_elements(data, type) {
    // Select the container:
    const container = document.getElementById(`${type}-container`);

    // Check if exists:
    if (container) {
        container.innerHTML = '';

        const fallbackUrl = '../../resources/images/error-image.png';

        // The logic for 'ads' and 'big-ads' is different. They are a simple list of <li>, not grouped.
        if (type === 'ads' || type === 'big-ads') {
            const fragment = document.createDocumentFragment();
            data.forEach(ad => {
                const li = document.createElement('li');
                const imageUrl = ad?.image_url ? `${url}storage/${ad.image_url}` : fallbackUrl;
                // The inner structure is the same for both ad types in the original code.
                li.innerHTML = `<div>
                                    <img src="${imageUrl}" alt="Advertisement" onerror="this.onerror=null; this.src='${fallbackUrl}';">
                                </div>`;
                fragment.appendChild(li);
            });
            container.appendChild(fragment);
            return; // We are done, exit the function.
        }

        let dataLength = data.length;
        let insertElements;

        // Set the measure for grouped elements:
        if (type === 'categories') { insertElements = Math.floor(container.offsetWidth / get_css_values({_propertys: ['--dashboard-categories-min-width', '--dashboard-margin-width']})); }
        else { insertElements = Math.floor(container.offsetWidth / get_css_values({_propertys: ['--dashboard-products-min-width', '--dashboard-margin-width']})); }

        // Fallback to 1 if calculation is 0 or less to avoid issues.
        if (!insertElements || insertElements <= 0) insertElements = 1;

        const fragment = document.createDocumentFragment();

        // Loop through data in chunks of `insertElements` to create rows
        for (let i = 0; i < dataLength; i += insertElements) {
            const chunk = data.slice(i, i + insertElements);
            const li = document.createElement('li');
            let liHTML = '';

            chunk.forEach(item => {
                const imageUrl = item?.image ? `${url}storage/${item.image}` : fallbackUrl;

                if (type === 'categories') {
                    liHTML += `<div>
                                    <div class="category-button dashboard-button" id="category-id-${item.id}">
                                        <i style="mask-image: url('${url}storage/${item.icon}');"></i>
                                    </div>
                                    <h2>${item.name}</h2>
                                </div>`;
                }
                else if (type === 'shops') {
                    liHTML += `<div class="shop-button dashboard-button" id="shop-id-${item.id}">
                                    <div>
                                        <img src="${imageUrl}" alt="${item.name}" onerror="this.onerror=null; this.src='${fallbackUrl}';">
                                    </div>
                                    <h4>${item.name}</h4>
                                </div>`;
                }
                else { // 'recent', 'my-favorites', 'popular'
                    liHTML += `<div class="product-button dashboard-button" id="${type}-id-${item.id}">
                                    <div>
                                        <img src="${imageUrl}" alt="${item.name}" onerror="this.onerror=null; this.src='${fallbackUrl}';">
                                    </div>
                                    <h4>${item.name}</h4>
                                </div>`;
                }
            });

            // Add placeholder elements to fill the last row if it's not full
            const placeholdersNeeded = insertElements - chunk.length;
            if (placeholdersNeeded > 0) {
                for (let j = 0; j < placeholdersNeeded; j++) {
                    if (type === 'categories') {
                        liHTML += `<div></div>`; // Empty div for categories
                    } else {
                        liHTML += `<div class="hide"></div>`; // Hidden div for products/shops
                    }
                }
            }

            li.innerHTML = liHTML;
            fragment.appendChild(li);
        }

        container.appendChild(fragment);
    }

}
