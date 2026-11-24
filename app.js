const formTurno = document.getElementById('formTurno');
const listaTurnos = document.getElementById('listaTurnos');
const buscador = document.getElementById('buscador');

let turnosLocales = JSON.parse(localStorage.getItem('turnos')) || [];

function renderizarTurnos(filtro = '') {
    const filtrados = turnosLocales.filter(t => 
        t.usuario.toLowerCase().includes(filtro.toLowerCase()) || 
        t.servicio.toLowerCase().includes(filtro.toLowerCase())
    );

    listaTurnos.innerHTML = filtrados.map((t, index) => `
        <li style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <strong>${t.fecha} (${t.hora})</strong> - ${t.servicio}<br>
                <small>Cliente: ${t.usuario} (${t.email || 'Sin correo'}) | Estado: <b>${t.estado || 'Confirmado'}</b></small>
            </div>
            <button onclick="cancelarTurno(${index})" style="width:auto; background:#dc3545; margin:0; padding:5px 10px;">Cancelar</button>
        </li>
    `).join('');
}

window.cancelarTurno = function(index) {
    turnosLocales.splice(index, 1);
    localStorage.setItem('turnos', JSON.stringify(turnosLocales));
    renderizarTurnos(buscador.value);
};

buscador.addEventListener('input', (e) => renderizarTurnos(e.target.value));

formTurno.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    // Validación de disponibilidad (evita turnos duplicados en misma fecha/hora)
    const ocupado = turnosLocales.some(t => t.fecha === fecha && t.hora === hora);
    if (ocupado) {
        alert('Error: Ya existe un turno reservado en esa fecha y horario.');
        return;
    }

    const nuevoTurno = {
        usuario: document.getElementById('usuario').value,
        email: document.getElementById('email').value,
        servicio: document.getElementById('servicio').value,
        fecha,
        hora,
        estado: 'Confirmado'
    };

    turnosLocales.push(nuevoTurno);
    localStorage.setItem('turnos', JSON.stringify(turnosLocales));
    renderizarTurnos();
    formTurno.reset();

    try {
        await fetch('http://localhost:5000/api/turnos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoTurno)
        });
    } catch (error) {
        console.log('Operando en modo cliente (GitHub Pages)');
    }
});

renderizarTurnos();
