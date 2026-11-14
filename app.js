const formTurno = document.getElementById('formTurno');
const listaTurnos = document.getElementById('listaTurnos');

// Simulación de almacenamiento local + conexión preparada para API Python
let turnosLocales = JSON.parse(localStorage.getItem('turnos')) || [];

function renderizarTurnos() {
    listaTurnos.innerHTML = turnosLocales
        .map(t => `<li><strong>${t.fecha} (${t.hora})</strong> - ${t.servicio} | Cliente: ${t.usuario}</li>`)
        .join('');
}

formTurno.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nuevoTurno = {
        usuario: document.getElementById('usuario').value,
        servicio: document.getElementById('servicio').value,
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value
    };

    // Guardar en estado local para previsualización inmediata
    turnosLocales.push(nuevoTurno);
    localStorage.setItem('turnos', JSON.stringify(turnosLocales));
    renderizarTurnos();
    formTurno.reset();

    // Envío al backend Python (Flask) cuando esté corriendo en local
    try {
        await fetch('http://localhost:5000/api/turnos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoTurno)
        });
    } catch (error) {
        console.log('Modo local activo (Backend desconectado)');
    }
});

renderizarTurnos();