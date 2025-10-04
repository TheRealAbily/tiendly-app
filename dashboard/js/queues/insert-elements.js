// Import the functions:
import { check_login } from '../../../general/js/functions/general-functions.js';
import { get_queues } from './get-queues.js';

// Insert the template for queues:
document.addEventListener('DOMContentLoaded', () => {
    check_login({});
    insert_elements();
});

// Insert the elements:
export function insert_elements() {
    // Select the queues container:
    const queuesContainer = document.getElementById('queues-container');
    queuesContainer.innerHTML = '';
    
    // Create and insert the containers:
    for(let i = 0; i < 3; i++) {
        const liElement = document.createElement('li');
        liElement.innerHTML = `<div class="queue-element queue loading-effect"></div>`;
        queuesContainer.appendChild(liElement);
    }

    // Get the queues:
    get_queues();
}
