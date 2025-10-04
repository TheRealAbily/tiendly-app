// Input focus:
export function input_focus (container) {
    // Select the inputs:
    const inputs = container.querySelectorAll('input');

    // Add the event:
    inputs.forEach(input => {
        // Focus effect:
        input.addEventListener('focus', () => {
            input.classList.add('hold');

            // Container:
            const container = input.closest('.input-container');
            if (container) {
                container.querySelector('.input-label').classList.remove('change');

                input.closest('.input-container').classList.remove('error');
            }
        });

        // Blur effect:
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.classList.remove('hold');
            }
            else {
                // Container:
                const container = input.closest('.input-container');
                if (container) {
                    container.classList.remove('error');
                    container.querySelector('.input-label').classList.add('change');
                }
            }
        });
    });
}
