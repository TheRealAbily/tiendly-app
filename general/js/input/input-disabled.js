// Enable/disable the input:
export function input_disabled({input = null, status = 'enable'}) {
    // Select the div container:
    if (input) {
        // Container:
        let container = input.closest('.input-container');

        if (container) {
            if (status === 'enable') { container.classList.remove('disabled'); }
            else { container.classList.add('disabled'); }
        }
    }
}
