// Import the necessary elements:
import { repeat_animation } from '../../../general/js/functions/general-functions.js'; // Functions for better optimization

// Input eye effect:
export function input_eye (container) {
    // Select the inputs:
    const inputs = container.querySelectorAll('input[type="password"]');

    // Search the eye button:
    inputs.forEach(input => {
        let eye = input.closest('.input-container').querySelector('i');
        
        if (eye) {
            eye.addEventListener('click', () => {
                if (eye.classList.contains('show')) {
                    eye.classList.remove('show');
                    eye.classList.add('hide');

                    // Animation:
                    repeat_animation(eye, 'animation');

                    // Change the input type:
                    setTimeout(() => { input.type = 'password'; }, 150);
                }
                else {
                    eye.classList.add('show');
                    eye.classList.remove('hide');

                    // Animation:
                    repeat_animation(eye, 'animation');

                    // Change the input type:
                    setTimeout(() => { input.type = 'text'; }, 150);
                }
            })
        }
    });
}
