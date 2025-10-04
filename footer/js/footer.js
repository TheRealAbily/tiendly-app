// Import the necessary elements:
import { apply_class, check_login, screen_block,
        globalVars, repeat_animation } from '../../general/js/functions/general-functions.js'; // Functions for better optimization


// Functionality for footer:
export function footer_functionality () {
    // Variables:
    const header = document.querySelector('header'); // Header
    const main = document.querySelector('main'); // main label
    const footer = document.querySelector('footer');
    const footerButtons = document.querySelector('footer').querySelectorAll('li'); // Footer buttons
    const footerMark = document.querySelector('footer').querySelector('.mark');
    let footerDelay = false;
    
    // Add the event:
    footerButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            if (!button.classList.contains('selected') && !footerDelay) {
                // Check if the user is logged:
                check_login({});

                // Control the mark position:
                apply_class({_element: document.querySelector('footer').querySelector('.selected'), _class: 'selected', _method: 'r'});
                apply_class({_element: button, _class: 'selected'});
                
                // Get the current position:
                let MaskX = getComputedStyle(footerMark).getPropertyValue('left');

                // Set the start/end value:
                footer.style.setProperty('--footer-mark-position-start', MaskX);
                footer.style.setProperty('--footer-mark-position-end', `${(100 / footerButtons.length) * index}%`);
                
                // Reload the class:
                repeat_animation(footerMark, 'animate');

                // Block the search:
                globalVars.headerSearch = false;

                // Scroll:
                main.scrollTo({
                    left: main.clientWidth * index,
                    behavior: 'smooth'
                });

                // Pause the animation:
                footerDelay = true;

                setTimeout(() => { footerDelay = false; }, 500);

                // Add or remove the shadow of header:
                if (document.querySelectorAll('.main-container')[index].scrollTop >= 10) {
                    if (!header.classList.contains('box-shadow')) { apply_class({_element: header, _class: 'box-shadow'}); } }
                else {
                    if (header.classList.contains('box-shadow')) { apply_class({_element: header, _class: 'box-shadow', _method: 'r'}); } }
                
                // Adjust one pixel for footer mark:
                if (index === 2) { apply_class({_element: footerMark, _class: 'adjust-pixel'}); }
                else { apply_class({_element: footerMark, _class: 'adjust-pixel', _method: 'r'}); }
                
                // Block the screen:
                screen_block();

                // Remove the screen for block touchs:
                setTimeout(() => {
                    screen_block(false);
                    if (index === 0) { globalVars.headerSearch = true; }
                }, 400);
            }
        });
    });
}
