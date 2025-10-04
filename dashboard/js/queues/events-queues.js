// Import the necessary elements:
import { apply_class, load_button, create_notification, url, check_login } from "../../../general/js/functions/general-functions.js";

// Control the automatic update:
import { timer_system } from "./get-queues.js";

// Import the start transition button:
import { start_transition } from "../dashboard/events-dashboard.js";

// --- Variables ---
let firstTime = true;
let queueToCancelId = null; // Almacena el ID de la cola a cancelar.

// --- Configuración de Eventos del Modal (se llama una sola vez) ---
function setupModalEventListeners() {
    const messageContainer = document.getElementById('message-container');
    const message = document.getElementById('message-box');
    const acceptDeleteCart = document.getElementById('accept-delete-cart');
    const cancelDeleteCart = document.getElementById('cancel-delete-cart');

    // Evento para el botón "Cancelar" en el modal
    cancelDeleteCart.addEventListener('click', () => {
        // Oculta el modal con animaciones
        apply_class({_element: messageContainer, _class: 'cart-container-fade-out'});
        apply_class({_element: message, _class: 'element-fade-out'});
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 500);

        // Reanuda las actualizaciones automáticas
        timer_system('on');
    });

    // Evento para el botón "Aceptar" en el modal
    acceptDeleteCart.addEventListener('click', () => {
        if (!queueToCancelId) return; // Comprobación de seguridad

        load_button({button: acceptDeleteCart});

        // Deshabilita los botones del modal para evitar clics múltiples
        acceptDeleteCart.disabled = true;
        apply_class({_element: acceptDeleteCart, _class: 'disabled'});
        cancelDeleteCart.disabled = true;
        apply_class({_element: cancelDeleteCart, _class: 'disabled'});

        const params = { status: 'cancelled' };

        // Petición para cancelar la cola
        fetch(url + `api/queues/${queueToCancelId}/change-status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(params)
        })
        .then(response => {
            if (!response.ok) {
                if (response?.status === 401 || response?.code === 401) {
                    check_login({_exit: true});
                } else {
                    throw new Error('No se ha podido eliminar el carrito de la cola');
                }
            }
            return response.json();
        })
        .then(result => {
            create_notification('success', 'El carrito ha sido eliminado correctamente', 5000, 1000);

            // Oculta el modal
            apply_class({_element: messageContainer, _class: 'cart-container-fade-out'});
            apply_class({_element: message, _class: 'element-fade-out'});
            setTimeout(() => {
                messageContainer.style.display = 'none';
            }, 500);

            // Reinicia el sistema de actualización. Esto recargará los datos inmediatamente.
            timer_system('restart');
        })
        .catch(error => {
            console.log(error);
            create_notification('error', 'No se ha podido eliminar el carrito', 5000, 1000);
            
            // Si hay un error, oculta el modal y simplemente reanuda el temporizador.
            apply_class({_element: messageContainer, _class: 'cart-container-fade-out'});
            apply_class({_element: message, _class: 'element-fade-out'});
            setTimeout(() => {
                messageContainer.style.display = 'none';
            }, 500);
            timer_system('on');
        })
        .finally(() => {
            // Limpia el ID de la cola para la próxima vez
            queueToCancelId = null;
        });
    });
}

// Set the events for queues:
export function events_queues() {
    if (firstTime) {
        firstTime = false;
        timer_system('on');
        setupModalEventListeners(); // Configura los listeners del modal una sola vez
    }

    const messageContainer = document.getElementById('message-container');
    const message = document.getElementById('message-box');
    const acceptDeleteCart = document.getElementById('accept-delete-cart');
    const cancelDeleteCart = document.getElementById('cancel-delete-cart');

    // Añade el evento para cada botón de "cancelar carrito" en la lista
    document.querySelectorAll('.cancel-cart-button').forEach(_button => {
        _button.addEventListener('click', (event) => {
            // Almacena el ID de la cola que se va a cancelar
            queueToCancelId = event.target.id.replace('cart-id-', '');

            // Muestra el modal de confirmación
            messageContainer.style.display = 'flex';
            apply_class({_element: messageContainer, _class: 'cart-container-fade-in'});
            apply_class({_element: messageContainer, _class: 'cart-container-fade-out', _method: 'r'});
            apply_class({_element: message, _class: 'element-fade-in'});
            apply_class({_element: message, _class: 'element-fade-out', _method: 'r'});

            // Resetea y habilita los botones del modal
            load_button({button: acceptDeleteCart, mode: 'default', text: 'Aceptar'});
            acceptDeleteCart.disabled = false;
            apply_class({_element: acceptDeleteCart, _class: 'disabled', _method: 'r'});
            cancelDeleteCart.disabled = false;
            apply_class({_element: cancelDeleteCart, _class: 'disabled', _method: 'r'});

            // Pausa las actualizaciones automáticas mientras el modal está abierto
            timer_system('off');
        });
    });

    // Add the event for show the cart:
    document.querySelectorAll('.show-cart-button').forEach(_button => {
        _button.addEventListener('click', (event) => {
            // Añade la animación de fade-out para el título de la cola:
            apply_class({_query: '#queue-title', _class: 'set-visibility'});
            apply_class({_query: '#queue-title', _class: 'element-fade-out'});

            // Set for edit the cart:
            localStorage.setItem('must-show-cart-elements', 'show');

            // Inicia la transición:
            start_transition(event, 'shop');
        });
    });
}
