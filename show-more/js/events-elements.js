// Import the necessary elements:
import { visibility_effect } from '../../general/js/functions/general-functions.js'; // Functions for better optimization

        // Import the transition function:
import { start_transition } from '../../dashboard/js/dashboard/events-dashboard.js';

// Apply the functionality to buttons:
export function events_elements(_type) {
    // Select all buttons:
    document.querySelectorAll('.show-more-button').forEach(_button => {
        _button.addEventListener('click', (event) => {
            if (_button.classList.contains('category')) { start_transition(event, 'category', {}, 'show-more', '.show-more-element'); }
            if (_button.classList.contains('product')) { start_transition(event, 'product', {}, 'show-more', '.show-more-element'); }
            if (_button.classList.contains('shop')) { start_transition(event, 'shop', {}, 'show-more', '.show-more-element'); }
        });
    });

    // Search input:
    const searchInput = document.getElementById('input-search');
    const elementsToSearch = document.querySelectorAll('li');
    let searchTimeout = null;
    let lastSearch = '';
    let foundSome = false;
    
    searchInput.addEventListener('input', () => {
        // Reset the timeout with debouncing:
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = searchInput.value.trim().toLowerCase(); // Value from input

            if (lastSearch !== query) {
                // Save the current search:
                lastSearch = query;

                // Reset if found some:
                foundSome = false;

                // Remove the previous error message:
                const errorMessage = document.getElementById('not-found-element')
                if (errorMessage) { errorMessage.remove(); }

                // Check all elements:
                elementsToSearch.forEach(_element => {
                    const name = _element.querySelector('.name').textContent.trim().toLowerCase(); // Values from elements 
                    
                    // Check if must show or hide:
                    if (name.startsWith(query) || query === '') {
                        _element.style.display = 'flex';

                        _element.classList.add('element-not-visible');
                        _element.classList.remove('element-entry-visible');

                        foundSome = true;
                    }
                    else { _element.style.display = 'none'; }
                });

                // Show the message error if not matches any:
                if (!foundSome) {
                    const errorElement = document.createElement('li');
                    errorElement.id = 'not-found-element';
                    errorElement.classList.add('error');

                    switch (_type) {
                        case 'categories': {
                            errorElement.innerHTML = `<div>
                                                        <i class="category"></i>
                                                        <h4>No se han encontrado<br>categorías que coincidan</h4>
                                                    </div>`;
                        } break;

                        case 'products': {
                            errorElement.innerHTML = `<div>
                                                        <i class="product"></i>
                                                        <h4>No se han encontrado<br>productos que coincidan</h4>
                                                    </div>`;
                        } break;

                        case 'shops': {
                            errorElement.innerHTML = `<div>
                                                        <i class="shop"></i>
                                                        <h4>No se han encontrado<br>tiendas que coincidan</h4>
                                                    </div>`;
                        } break;
                    }
                    
                    // Insert the message error:
                    document.getElementById('container').appendChild(errorElement);
                }
                else {
                    // Apply the visibility effect:
                    visibility_effect({_container: '#dashboard'});
                }
            }
        }, 500);
    });
}