// Input numbers:
export function input_numbers ({container = null, specific = null}) {
    // Check the container:
    if (container) {
        // Inputs:
        let inputs = null;
        
        // Select the inputs:
        if (specific) { inputs = container.querySelectorAll(specific); }
        else { inputs = container.querySelectorAll('input'); }

        // Add the event:
        inputs.forEach(input => {
            // List:
            const listKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace']; // Yes, that was necessary

            // Avoid strange symbs:
            input.addEventListener('keydown', (event) => {
                if (!listKeys.includes(event.key)) { event.preventDefault(); }
                if (input.value.length > 8 && event.key !== 'Backspace') { event.preventDefault(); }
            });

            // Add the "V" to start:
            if (specific === '#ci') {
                input.addEventListener('input', () => {
                    input.value = input.value.replace('V', '');
                    input.value = 'V' + input.value;
                });

                input.addEventListener('keydown', (event) => {
                    if (event.key === 'Backspace' && input.value.length == 2) {
                        input.value = '';
                    }
                });
            }
        });
    }
}
