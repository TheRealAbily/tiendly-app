// Import the functionality:
import { header_functionality } from '../../../header/js/header.js';

// Import the header:
document.addEventListener('DOMContentLoaded', () => {
    // Get the position:
    const positionHeader = document.querySelector('header');

    // Import the header:
    if (positionHeader) {
        fetch ('../../header/html/header.html')

        .then (response => {
            if (!response.ok) { throw new Error('No se ha encontrado el archivo header.html'); }
            else { return response.text(); }
        })

        .then (result => {
            // Create the styles:
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '../../header/css/header.css';

            // Insert the styles:
            document.querySelector('head').appendChild(link);

            // Create the element:
            const header = document.createElement('div');
            header.id = 'middle-container-header';
            header.innerHTML = result;

            // Insert the header:
            positionHeader.appendChild(header);

            // Functionality:
            header_functionality();
        })

        .catch (error => {})
    }
});
