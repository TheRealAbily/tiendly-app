// Set the global variables:
export let globalVars = {
    // Header:
    headerSearch: true,
    headerSearchShow: true,
    headerBackShow: false,
    headerSearchCanTouch: true,

    // Type transition:
    dashboardTransitionType: 'screen-white'
};

// Backup:
const defaultVars = globalVars;

// Save the vars:
export function save_vars() {
    localStorage.setItem('global-vars', JSON.stringify(globalVars));
}

// Load the vars:
export function load_vars() {
    if (localStorage.getItem('global-vars')) {
        // Parsea las variables guardadas.
        const storedVars = JSON.parse(localStorage.getItem('global-vars'));
        
        // Fusiona las variables por defecto con las guardadas.
        // Esto asegura que si añades nuevas propiedades a globalVars en el código, no se pierdan.
        globalVars = { ...globalVars, ...storedVars };
    }
}

// Reset the vars:
export function reset_vars() {
    globalVars = defaultVars;
    localStorage.setItem('global-vars', JSON.stringify(globalVars));
}
