// Import the functionality:
import { footer_functionality } from '../../../footer/js/footer.js';

// Import the footer:
document.addEventListener('DOMContentLoaded', () => {
    // Get the position:
    const positionFooter = document.querySelector('footer');

    // Import the footer:
    if (positionFooter) {
        fetch ('../../footer/html/footer.html')

        .then (response => {
            if (!response.ok) { throw new Error('No se ha encontrado el archivo footer.html'); }
            else { return response.text(); }
        })

        .then (result => {
            // Create the styles:
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '../../footer/css/footer.css';

            // Insert the styles:
            document.querySelector('footer').appendChild(link);

            // Create the element:
            const footer = document.createElement('div');
            footer.id = 'middle-container-footer';
            footer.innerHTML = result;

            // Insert the footer:
            positionFooter.appendChild(footer);

            // Functionality:
            footer_functionality();
        })

        .catch (error => {})
    }
});
