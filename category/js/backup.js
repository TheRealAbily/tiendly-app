// Import the necessary elements:
import { apply_class, check_login, visibility_effect,
        get_css_values, enable_scroll } from '../../general/js/functions/general-functions.js';

import { start_transition } from '../../dashboard/js/dashboard/events-dashboard.js';

// Exported function:
export function events_category() {
    // Functions:
    check_login({}); // Check if the user is logged
    enable_scroll(); // Enable the scroll

    // Settings:
    const perLi = Math.floor(document.getElementById('general-container').offsetWidth / get_css_values({_propertys: ['--dashboard-products-min-width', '--dashboard-margin-width']})); // Max products per <li>, customizable
    let searchTimeout = null;
    let lastSearch = '';

    // Stable click handler (avoid duplicates across re-bindings)
    function handleProductClick(event) {
        start_transition(event, 'product', { header: false, footer: false }, 'categories', '.category-element');
    }

    // Bind click to all real product buttons (exclude placeholders)
    function add_product_click_events() {
        document.querySelectorAll('.product-button:not(.hide)').forEach(btn => {
            btn.removeEventListener('click', handleProductClick);
            btn.addEventListener('click', handleProductClick);
        });
    }

    add_product_click_events();

    // Debounced search
    const searchInput = document.getElementById('input-search');
    if (!searchInput) return; // Safety

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();

        if (searchTimeout) clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => handle_search(query, perLi), 500);
    });

    function handle_search(query, perLi) {
        if (lastSearch === query) return;
        lastSearch = query;

        // Clear previous dynamic state (errors + dynamic <li>)
        document.querySelectorAll('.error-list').forEach(el => el.remove());
        document.querySelectorAll('.sought-container').forEach(el => el.remove());

        if (query === '') {
            restore_original_view();
            return;
        }

        // 1) Hide all real product cards first, then show matches
        document.querySelectorAll('.product-button:not(.hide)').forEach(btn => { btn.style.display = 'none'; });

        // Match by startsWith (can switch to includes if needed)
        document.querySelectorAll('.product-name').forEach(nameEl => {
            const name = nameEl.textContent.trim().toLowerCase();
            const productBtn = nameEl.closest('.product-button');
            if (!productBtn || productBtn.classList.contains('hide')) return;
            productBtn.style.display = name.startsWith(query) ? 'flex' : 'none';
        });

        // 2) Show/hide mini-containers + subtitles + lines according to visible real products
        toggle_containers();

        // 3) Build product list from visible real cards (skip placeholders)
        const products = collect_visible_products();

        // 4) No results → error
        if (!products.length) {
            show_error_message();
            return;
        }

        // 5) Insert grouped dynamic <li> by subcategory
        group_products_by_subcategory(products, perLi).forEach(([subcategory, liElements]) => {
            const container = document.querySelector(`.${subcategory}`);
            if (!container) return; // Safety
            liElements.forEach(li => container.appendChild(li));
        });

        // 6) Hide originals (only original <li>, not the <ul>)
        document.querySelectorAll('.original-container').forEach(c => { c.style.display = 'none'; });

        // 7) Re-bind click + re-apply visibility
        add_product_click_events();
        // visibility_effect({});
        apply_animation();
    }

    function restore_original_view() {
        // Show containers and products back to normal (exclude placeholders)
        document.querySelectorAll('.original-container').forEach(c => { c.style.display = 'flex'; });
        document.querySelectorAll('.mini-container').forEach(c => { c.style.display = 'flex'; });
        document.querySelectorAll('.product-button:not(.hide)').forEach(p => { p.style.display = 'flex'; });

        // Subtitles and lines visible again
        document.querySelectorAll('.subtitle').forEach(s => { s.style.display = 'flex'; });
        document.querySelectorAll('.line-separator').forEach(l => { l.style.display = 'flex'; });

        // Remove dynamic stuff & errors (defensive, aunque arriba ya lo hicimos)
        document.querySelectorAll('.sought-container').forEach(c => c.remove());
        document.querySelectorAll('.error-list').forEach(e => e.remove());

        // Re-bind and re-apply effects
        add_product_click_events();
        // visibility_effect({});
        apply_animation();
    }

    function toggle_containers() {
        document.querySelectorAll('.mini-container').forEach(mini => {
            // Only count real product cards (exclude .hide placeholders)
            const anyVisible = Array.from(mini.querySelectorAll('.product-button:not(.hide)'))
                .some(p => p.style.display === 'flex');

            mini.style.display = anyVisible ? 'flex' : 'none';

            // Match subtitle & line for this subcategory
            const subcategoryClass = getSubcategoryClass(mini);
            if (subcategoryClass) {
                const idSuffix = subcategoryClass.replace('subcategory-container-', '');
                const subtitle = document.querySelector(`.subcategory-title-${idSuffix}`);
                const line = document.querySelector(`.subcategory-line-${idSuffix}`);
                if (subtitle) subtitle.style.display = anyVisible ? 'flex' : 'none';
                if (line) line.style.display = anyVisible ? 'flex' : 'none';
            }
        });

        // Hide last visible line (optional; if you want to keep it visible, remove block below)
        const visibleLines = Array.from(document.querySelectorAll('.line-separator'))
            .filter(line => line.style.display === 'flex');
        if (visibleLines.length) {
            visibleLines[visibleLines.length - 1].style.display = 'none';
        }
    }

    function collect_visible_products() {
        const products = [];
        document.querySelectorAll('.mini-container').forEach(mini => {
            if (mini.style.display !== 'flex') return;

            mini.querySelectorAll('.product-button:not(.hide)').forEach(btn => {
                if (btn.style.display !== 'flex') return;

                // Defensive guards (skip malformed nodes)
                const img = btn.querySelector('img');
                const nameEl = btn.querySelector('.product-name');
                if (!img || !nameEl) return;

                const subcategory = getSubcategoryClass(mini);
                if (!subcategory) return;

                products.push({
                    subcategory,
                    id: (btn.id || '').startsWith('product-id-')
                        ? btn.id.replace('product-id-', 'sought-id-')
                        : btn.id || '', // Keep original or empty if missing
                    image: img.src,
                    name: img.alt || nameEl.textContent.trim()
                });
            });
        });
        return products;
    }

    function show_error_message() {
        const errorElement = document.createElement('div');
        errorElement.id = 'not-found-products';
        errorElement.classList.add('error-list', 'animate', 'not-found-products');
        errorElement.innerHTML = `
            <i class="products"></i>
            <h4>No se han encontrado<br>productos que coincidan</h4>
        `;
        const target = document.getElementById('general-container') || document.body; // Safety
        target.appendChild(errorElement);
    }

    // Get "subcategory-container-*" class from an element
    function getSubcategoryClass(el) {
        return Array.from(el.classList).find(c => c.startsWith('subcategory-container-')) || '';
    }

    // Function to apply the animations:
    function apply_animation() {
        // Select all elements from view for apply the entry class:
        document.querySelectorAll('.category-element').forEach(element => {
            // Variables:
            const rect = element.getBoundingClientRect(); // Get the border of element
            const fullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight; // Check if inside

            // Remove all class:
            apply_class({_element: element, _class: 'element-not-visible', _method: 'r'});
            apply_class({_element: element, _class: 'set-visibility', _method: 'r'});
            apply_class({_element: element, _class: 'element-entry-visible', _method: 'r'});
    
            // Check if full visible inside of container:
            if (fullyVisible) {
                // Add the class:
                apply_class({_element: element, _class: 'element-entry-visible'});
            }
            else {
                // Add the class:
                apply_class({_element: element, _class: 'element-not-visible'});
                apply_class({_element: element, _class: 'set-visibility'});
            }
        });
    
        // Apply the entry animation to specifics elements:
        visibility_effect({_query: '.set-visibility', _container: '#category'});
    }
}

// Helper: group products into <li> chunks (returns DOM nodes)
function group_products_by_subcategory(products, perLi) {
    // Group by subcategory
    const grouped = {};
    products.forEach(p => {
        if (!grouped[p.subcategory]) grouped[p.subcategory] = [];
        grouped[p.subcategory].push(p);
    });

    // Build DOM
    return Object.entries(grouped).map(([subcategory, items]) => {
        const liElements = [];
        for (let i = 0; i < items.length; i += perLi) {
            const chunk = items.slice(i, i + perLi);
            while (chunk.length < perLi) chunk.push({ hide: true });

            const li = document.createElement('li');
            li.classList.add('sought-container');

            // Note: use only innerHTML append here for brevity; nodes are safe/scoped.
            li.innerHTML = chunk.map(prod => {
                if (prod.hide) return `<div class="product-button hide"></div>`;
                const idAttr = prod.id ? ` id="${prod.id}"` : '';
                return `
                    <div class="product-button"${idAttr}>
                        <div><img src="${prod.image}" alt="${prod.name}"></div>
                        <h4 class="product-name">${prod.name}</h4>
                    </div>
                `;
            }).join('');

            liElements.push(li);
        }
        return [subcategory, liElements];
    });
}


