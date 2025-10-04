// Import the necessary functions:
import { url, check_login, create_notification, apply_class } from "../../../general/js/functions/general-functions.js";
import { insert_elements } from "./insert-elements.js";
import { events_queues } from "./events-queues.js";

// Variables:
let enabled = false;
let timeoutId = null;
const interval = 60 * 1000;

// Repeat the funcion:
function loop() {
    if (!enabled) { return; }
    else {
        reload_queues(); // Reload the section
        timeoutId = setTimeout(loop, interval);
    }
}

// Control:
export function timer_system(command) {
    // Start the interval:
    if (command === "on") {
        if (!enabled) {
            enabled = true;
            loop();
        }
    }

    // End the interval:
    if (command === "off") {
        enabled = false;
        clearTimeout(timeoutId);
        timeoutId = null;
    }

    // Restart the interval:
    if (command === "restart") {
        clearTimeout(timeoutId);
        // Un reinicio debe asegurar que el temporizador esté activo, realizar una recarga inmediata,
        // y luego programar la siguiente iteración.
        enabled = true;
        reload_queues();
        timeoutId = setTimeout(loop, interval);
    }
}

export function get_queues() {
    // Queues container:
    const queuesContainer = document.getElementById('queues-container');

    // Connect server for get the queues:
    fetch(url + `api/queues/get-my-queue`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })

    .then(response => {
        if (!response.ok) {
            if (response?.status === 401 || response?.code === 401 || localStorage.getItem('token') === '') { check_login({_exit: true}); }
            else { throw new Error('No se ha podido obtener la información de las colas'); }
        }
        return response.json();
    })

    .then (result => {
        // Clear the container:
        queuesContainer.innerHTML = '';

        // Get all pending queue:
        let pendingQueues = Array.from(result.data).filter(_queue => { if (_queue.status === 'pending') { return _queue; }});

        // Check queues:
        if (pendingQueues.length > 0) {
            // Insert the queue:
            result.data.forEach(_queue => {
                if (_queue.status === 'pending') {
                    const queue = document.createElement('li');
                    const fallbackUrl = '../../resources/images/error-image.png';
                    const imageUrl = _queue?.shop?.image ? `${url}storage/${_queue.shop.image}` : fallbackUrl;

                    queue.innerHTML = `<div class="queue set-visibility element-entry-visible" id="queue-id-${_queue.queue_id}">
                                        <div class="top-container">
                                            <div class="queue-image">
                                                <img src="${imageUrl}" alt="${_queue?.shop?.name}" onerror="this.onerror=null; this.src='${fallbackUrl}';">
                                            </div>
                                            <div class="queue-information">
                                                <h4 class="name">${_queue?.shop?.name}</h4>
                                                <span class="separator"></span>
                                                <span class="line-text">
                                                    <h5>Estado:</h5>
                                                    ${_queue?.shop?.is_active ? '<p class="open-shop">Abierto</p>' : '<p class="close-shop">Cerrado</p>'}
                                                </span>
                                                <span class="line-text">
                                                    <h5>Clientes por delante:</h5>
                                                    <p class="price ${_queue?.customers_ahead < 10 ?
                                                                            _queue?.customers_ahead < 5 ?
                                                                                _queue?.customers_ahead === 0 ?
                                                                                    'queue-expired'
                                                                                    : 'queue-exclamation'
                                                                                : 'queue-warning'
                                                                    : ''}">${_queue?.customers_ahead === 0 ? '0' : _queue?.customers_ahead}</p>
                                                </span>
                                                <span class="line-text">
                                                    <h5>Precio a pagar:</h5>
                                                    <p>${_queue?.cart?.total_price.toString().replace(/\./g, ',')} Ref.</p>
                                                </span>
                                            </div>
                                        </div>
                                        <div class="bottom-container">
                                            <button class="show-cart-button" id="queue-id-${_queue?.shop?.id}">Ver carrito</button>
                                            <button class="cancel-cart-button" id="cart-id-${_queue?.queue_id}">Cancelar carrito</button>
                                        </div>
                                    </div>`;
                    queuesContainer.appendChild(queue);
                }
            });

            // Set the events:
            events_queues();
        }
        else {
            // Si no hay colas pendientes, detenemos las actualizaciones automáticas.
            timer_system('off');

            // Show the error:
            const errorElement = document.createElement('li');
            apply_class({_element: errorElement, _class: 'queue-error'});
            errorElement.innerHTML = `<div class="error-list">
                                        <i class="queues"></i>
                                        <h4>No se han encontrado<br>colas actualmente</h4>                            
                                    </div>`;
            queuesContainer.appendChild(errorElement);
        }
    })

    .catch (error => { console.log(error); create_notification('error', 'Ha ocurrido un error al obtener las colas', 5000, 1000); })
}

// Reload the queues:
function reload_queues() {
    // Insert the elements:
    insert_elements();
}
