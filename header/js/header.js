// Import the necessary elements:
import { apply_class, check_login,
        globalVars, load_vars } from '../../general/js/functions/general-functions.js'; // Functions for better optimization

// Functionality for header:
export function header_functionality() {
    // Load the global vars:
    load_vars();

    // Hide the back:
    if (globalVars.headerBackShow) { document.getElementById('back').style.display = 'flex'; }

    // Get & set CSS vars:
    function setter_value(element, property, variable) {
        // Variables:
        const styles = getComputedStyle(element);
        const matrix = new DOMMatrixReadOnly(styles.transform);
        let value;

        switch (property) {
            // Translate X:
            case 'translateX': {
                const currentTranslateX = matrix.m41;
                const currentRotateRad = Math.atan2(matrix.b, matrix.a);

                let currentRotateDeg = currentRotateRad * (180 / Math.PI);
                currentRotateDeg = ((currentRotateDeg + 180) % 360 + 360) % 360 - 180;

                value = `translateX(${currentTranslateX}px) rotate(${currentRotateDeg}deg)`;
                break;
            }

            // Rotate:
            case 'rotate': {
                const currentTranslateX = matrix.m41;
                const currentRotateRad = Math.atan2(matrix.b, matrix.a);
                
                let currentRotateDeg = currentRotateRad * (180 / Math.PI);
                currentRotateDeg = ((currentRotateDeg + 180) % 360 + 360) % 360 - 180;
                
                value = `translateX(${currentTranslateX}px) rotate(${currentRotateDeg}deg)`;
                break;
            }

            // Background:
            case 'background': {
                value = styles.backgroundColor;
                break;
            }

            // Rest:
            default: {
                value = styles.getPropertyValue(property);
            }
        }

        // Set the value:
        element.style.setProperty(variable, value);
    }

    // Header buttons:
    const buttons = document.querySelectorAll('.icon-container');
    
    // Search animation:
    let searchAnimationCanStart = true;

    // Add the event:
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Functions:
            check_login({}); // Check if the user is logged
            load_vars(); // Load the global vars

            // Check the button pressed:
            if (globalVars.headerSearchCanTouch) {
                if (globalVars.headerSearch) {
                    switch (button.id) {
                        // Search:
                        case 'search': {
                            if (searchAnimationCanStart) {
                                if (!button.classList.contains('expand-search-in')) {
                                    // Out:
                                    apply_class({_element: button, _class: 'expand-search-out', _method: 'r'}); // Container
                                    ['span', 'input', 'i'].forEach(_element => { apply_class({_query: _element, _class: 'expand-search-out', _method: 'r', _father_element: button}); });

                                    // In:
                                    apply_class({_element: button, _class: 'expand-search-in'}); // Container
                                    ['span', 'input', 'i'].forEach(_element => { apply_class({_query: _element, _class: 'expand-search-in', _father_element: button}); });
                                }
                                else {
                                    // Set the new values for the container:
                                    const container = document.getElementById('search');
                                    setter_value(container, 'width', '--header-container-width-out');
                                    setter_value(container, 'background', '--header-container-background-out');
                                    setter_value(container, 'border-radius', '--header-container-radius-out');
                                    setter_value(container, 'box-shadow', '--header-container-shadow-out');
                                    setter_value(container, 'translateX', '--header-container-translate-out');
                                    
                                    // Set the new values for the input:
                                    const input = container.querySelector('input');
                                    setter_value(input, 'opacity', '--header-input-opacity-out');

                                    // Set the new values for the icon:
                                    const icon = container.querySelector('i');
                                    setter_value(icon, 'background', '--header-icon-background-out');
                                    setter_value(icon, 'translateX', '--header-icon-transform-out');

                                    // Out:
                                    apply_class({_element: button, _class: 'expand-search-out'}); // Container
                                    ['span', 'input', 'i'].forEach(_element => { apply_class({_query: _element, _class: 'expand-search-out', _father_element: button}); });

                                    // In:
                                    apply_class({_element: button, _class: 'expand-search-in', _method: 'r'}); // Container
                                    ['span', 'input', 'i'].forEach(_element => { apply_class({_query: _element, _class: 'expand-search-in', _method: 'r', _father_element: button}); });
                                    
                                    // Variable:
                                    searchAnimationCanStart = false;

                                    // Clock:
                                    setTimeout(() => {
                                        searchAnimationCanStart = true;
                                    }, 700);
                                }
                            }
                            break;
                        }
                    }
                }
            }
        });
    });
}
