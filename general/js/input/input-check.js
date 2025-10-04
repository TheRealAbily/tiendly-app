// Input check for differents types:
export function input_check({input = null, type = 'text'}) {
    // Check the input:
    if (input) {
        // Variables:
        const value = input.value.trim();
        let isValid = true;

        // Check if is empty:
        if (value !== '') {
            switch (type) {
                // If is name:
                case 'name': {
                    if (value.length < 5) { isValid = false; }
                    if (value.length > 50) { isValid = false; }
                    break;
                }

                // If is CI:
                case 'ci': {
                    if (value.length < 8) { isValid = false; }
                    if (value.length > 9) { isValid = false; }
                    break;
                }

                // If is email:
                case 'email': {
                    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                    break;
                }

                // If is password for register:
                case 'password': {
                    if (!/\d/.test(value)) { isValid = false; }
                    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) { isValid = false; }
                    if (!/[A-Za-z]/.test(value)) { isValid = false; }
                    if (value.length < 8) { isValid = false; }
                    break;
                }

                // If is password for login:
                case 'simple-password': {
                    if (value.length < 1) { isValid = false; }
                    break;
                }
            }
        }
        else { return false; }

        return isValid;
    }
    else { return false; }
}
