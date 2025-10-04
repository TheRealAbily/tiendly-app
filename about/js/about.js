// Import the necessary elements:
import { start_view, back_button, check_login,
        set_theme, reset_vars, save_vars,
        disable_c_menu } from '../../general/js/functions/general-functions.js'; // Functions for better optimization

// When document is loaded:
document.addEventListener('DOMContentLoaded', () => {
    // Functions:
    check_login({}); // Check if the user is logged
    set_theme(); // Set the theme
    disable_c_menu(); // Disable the context menu
    reset_vars(); // Restart the vars
    save_vars(); // And saved
    start_view({_callback: () => {
        back_button({_delay: 1000, _form: document.querySelector('form'),
                    _globalVars: [{headerSearchCanTouch: false}]}); // Back button functionality
    }}); // Show the back button
});
