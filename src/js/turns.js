// Cargar equipos desde localStorage o inicializar vacío
export let equipos = JSON.parse(localStorage.getItem("equipos")) || [];

// Forzar turnoActual a 1 si hay equipos
export let turnoActual = (equipos.length > 1) ? 1 : 0;
localStorage.setItem("turnoActual", JSON.stringify(turnoActual));

// Actualizar turno en pantalla
export function actualizarTurno() {
    let turnoElemento = document.getElementById("turno");

    console.log(`🔄 Actualizando turno...`);
    console.log(`👥 Equipos:`, equipos);
    console.log(`🎯 Turno actual en variable: ${turnoActual}`);
    console.log(`💾 Turno guardado en localStorage:`, localStorage.getItem("turnoActual"));

    if (equipos.length > 0 && turnoElemento) {
        turnoElemento.innerText = `Turno de: ${equipos[turnoActual]?.name || "Equipo desconocido"}`;
    } else {
        turnoElemento.innerText = "No hay equipos disponibles.";
    }
}

// Pasar al siguiente turno (pero mantenerlo en 1 si lo deseas)
export function siguienteTurno() {
    if (equipos.length > 0) {
        turnoActual = 1; // Siempre mantener el turno en 1
        localStorage.setItem("turnoActual", JSON.stringify(turnoActual));
        actualizarTurno();
    }
}

// Asegurar que el turno se muestra al cargar la página
window.onload = function() {
    actualizarTurno();
};
