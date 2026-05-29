// 1. BASES DE DATOS SIMULADAS
const datosEspacios = {
    'aula-1': {
        titulo: 'Aula 1: Taller de Informática',
        descripcion: 'Equipada con 15 computadoras. Piso nivelado, sin escalones.',
        accesibilidad: '✅ Puerta de 90cm. Espacio para silla de ruedas.'
    },
    'bano-acc': {
        titulo: 'Baño Accesible Universal',
        descripcion: 'Baño unisex adaptado.',
        accesibilidad: '✅ Cuenta con barrales rebatibles y timbre de emergencia.'
    }
};

const rutas = {
    // Si tocan aula-1 y luego bano-acc (o viceversa)
    'aula-1-bano-acc': {
        dibujo_svg: 'M 125 150 L 125 180 L 350 180 L 350 150',
        instrucciones: `
            <h2>Recorrido: Aula 1 a Baño Accesible</h2>
            <ol>
                <li>Salí del espacio actual hacia el pasillo central.</li>
                <li>Avanzá en línea recta por 20 metros.</li>
                <li>Tu destino estará a la derecha.</li>
            </ol>`
    },
    'bano-acc-aula-1': {
        dibujo_svg: 'M 350 150 L 350 180 L 125 180 L 125 150',
        instrucciones: `
            <h2>Recorrido: Baño Accesible a Aula 1</h2>
            <ol>
                <li>Salí del baño hacia el pasillo central.</li>
                <li>Avanzá en línea recta por 20 metros.</li>
                <li>El aula estará a tu izquierda.</li>
            </ol>`
    }
};

// 2. VARIABLES DE ESTADO
let selecciones = []; // Memoria temporal de los clics

// 3. ELEMENTOS DEL DOM
const espacios = document.querySelectorAll('.espacio-interactivo');
const fichaDescriptiva = document.getElementById('ficha-descriptiva');
const lineaRecorrido = document.getElementById('linea-recorrido');
const btnLimpiar = document.getElementById('btn-limpiar');

// 4. LÓGICA PRINCIPAL
function manejarInteraccion(idEspacio) {
    const elemento = document.getElementById(idEspacio);

    // Si ya había 2 seleccionados y tocás un 3ro, limpiamos el mapa primero
    if (selecciones.length === 2) {
        limpiarMapa();
    }

    // Si tocás el mismo espacio que ya estaba seleccionado, lo deseleccionamos
    if (selecciones.length === 1 && selecciones[0] === idEspacio) {
        limpiarMapa();
        return;
    }

    // Agregamos el nuevo espacio a la memoria y lo pintamos
    selecciones.push(idEspacio);
    elemento.classList.add('seleccionado');
    elemento.setAttribute('aria-pressed', 'true'); // Accesibilidad

    // EVALUAMOS QUÉ MOSTRAR
    if (selecciones.length === 1) {
        // Un solo clic: Mostrar Información
        const info = datosEspacios[idEspacio];
        if (info) {
            fichaDescriptiva.innerHTML = `
                <h2>${info.titulo}</h2>
                <p>${info.descripcion}</p>
                <p><strong>Accesibilidad:</strong> ${info.accesibilidad}</p>
                <hr>
                <button onclick="alert('Abriendo reporte...')">Reportar Barrera Física</button>
            `;
        }
    } 
    else if (selecciones.length === 2) {
        // Dos clics: Trazar Ruta
        const claveRuta = `${selecciones[0]}-${selecciones[1]}`;
        const rutaEncontrada = rutas[claveRuta];

        if (rutaEncontrada) {
            lineaRecorrido.setAttribute('d', rutaEncontrada.dibujo_svg);
            lineaRecorrido.style.display = 'block';
            fichaDescriptiva.innerHTML = rutaEncontrada.instrucciones;
            fichaDescriptiva.focus(); // Mueve el foco al texto para lectores de pantalla
        } else {
            fichaDescriptiva.innerHTML = `<h2>Ruta no disponible</h2><p>Aún no hemos relevado este recorrido.</p>`;
        }
    }
}

function limpiarMapa() {
    selecciones = [];
    espacios.forEach(esp => {
        esp.classList.remove('seleccionado');
        esp.setAttribute('aria-pressed', 'false');
    });
    lineaRecorrido.style.display = 'none';
    fichaDescriptiva.innerHTML = `<h2>Información del sector</h2><p>Hacé clic en cualquier espacio del mapa para comenzar.</p>`;
}

// 5. EVENTOS
espacios.forEach(espacio => {
    espacio.addEventListener('click', function() { manejarInteraccion(this.id); });
    espacio.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            manejarInteraccion(this.id);
        }
    });
});

btnLimpiar.addEventListener('click', limpiarMapa);