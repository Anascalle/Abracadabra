import { retos } from "./challenges.js";
import { ingredientes } from "./ingredients.js";

// Cargar equipos y turno desde localStorage
export let equipos = JSON.parse(localStorage.getItem("equipos")) || [];
export let turnoActual = JSON.parse(localStorage.getItem("turnoActual")) || 0;

let progresoPistas = {}; // Progreso de cada ingrediente

// Actualizar el turno en la interfaz
export function actualizarTurno() {
    let turnoElemento = document.getElementById("turno");

    if (equipos.length > 0 && turnoElemento) {
        turnoElemento.innerText = `Turno de: ${equipos[turnoActual].name}`;
    } else {
        console.warn("⚠️ No hay equipos disponibles o no se encontró el elemento 'turno'.");
    }
}

// Pasar al siguiente equipo (pero no cambiar de ronda)
export function siguienteTurno() {
    if (equipos.length > 0) {
        turnoActual = (turnoActual + 1) % equipos.length;
        localStorage.setItem("turnoActual", JSON.stringify(turnoActual)); // Guarda turno
        actualizarTurno();
        console.log(`🔄 Ahora es el turno de: ${equipos[turnoActual].name}`);
    } else {
        console.warn("⚠️ No hay equipos para cambiar el turno.");
    }
}

export function mostrarModal(categoria, ingredienteNombre = null) {
    let modalTitulo = document.getElementById("modal-titulo");
    let modalTexto = document.getElementById("modal-texto");
    let modal = document.getElementById("modal");
    let cumplioBtn = document.getElementById("cumplio-btn");

    if (!modalTitulo || !modalTexto || !modal || !cumplioBtn) {
        console.error("❌ Elementos del modal no encontrados.");
        return;
    }

    if (ingredienteNombre) {
        let ingrediente = ingredientes.find(i => i.nombre === ingredienteNombre);
        if (!ingrediente || !ingrediente.pistas || !Array.isArray(ingrediente.pistas)) {
            console.warn(`⚠️ Ingrediente "${ingredienteNombre}" no encontrado o sin pistas.`);
            return;
        }

        // Inicializa progreso si no existe
        progresoPistas[ingredienteNombre] = progresoPistas[ingredienteNombre] || 0;
        let pistaActual = ingrediente.pistas[progresoPistas[ingredienteNombre]];

        modalTitulo.innerText = ingredienteNombre;
        modalTexto.innerText = pistaActual;
       
    } else {
        if (!retos[categoria]) {
            console.warn(`⚠️ Categoría "${categoria}" no encontrada.`);
            return;
        }

        let retoAleatorio = retos[categoria][Math.floor(Math.random() * retos[categoria].length)];
        modalTitulo.innerText = categoria;
        modalTexto.innerText = retoAleatorio;
        
    }

    // El botón "Cumplió" ahora solo avanza la pista, no el turno
    cumplioBtn.onclick = cumplioReto;

    modal.style.display = "block";
}

// Función cuando un equipo cumple un reto (solo avanza la pista)
export function cumplioReto() {
    let equipoActual = equipos[turnoActual];

    if (!equipoActual || !Array.isArray(equipoActual.ingredients) || equipoActual.ingredients.length === 0) {
        console.warn(`⚠️ El equipo ${equipoActual?.name || "desconocido"} no tiene ingredientes asignados.`);
        return;
    }

    let ingrediente = equipoActual.ingredients.find(ing =>
        ing && ing.nombre && Array.isArray(ing.pistas)
    );

    if (!ingrediente) {
        console.warn(`⚠️ Ninguno de los ingredientes de ${equipoActual.name} es válido.`);
        return;
    }

    progresoPistas[ingrediente.nombre] = progresoPistas[ingrediente.nombre] || 0;

    if (progresoPistas[ingrediente.nombre] < ingrediente.pistas.length - 1) {
        progresoPistas[ingrediente.nombre]++;
        console.log(`✅ Mostrando siguiente pista de "${ingrediente.nombre}".`);
    } else {
        console.log(`✅ Todas las pistas de "${ingrediente.nombre}" han sido mostradas.`);
    }

    cerrarModal();

    // 🔄 Pasar el turno al siguiente equipo automáticamente
    siguienteTurno();
}



// Función para cambiar de ronda después de que todos cumplan
export function siguienteRonda() {
    siguienteTurno();
}

// Cerrar modal
export function cerrarModal() {
    let modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "none";
    } else {
        console.error("❌ No se encontró el modal.");
    }
}
