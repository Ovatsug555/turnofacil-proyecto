import sqlite3
from flask import Flask, jsonify, request

app = Flask(__name__)


def init_db():
    conn = sqlite3.connect('turnofacil.db')
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS turnos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT NOT NULL,
            servicio TEXT NOT NULL,
            fecha TEXT NOT NULL,
            hora TEXT NOT NULL,
            estado TEXT DEFAULT 'pendiente'
        )
    """)
    conn.commit()
    conn.close()


@app.route('/api/turnos', methods=['GET'])
def obtener_turnos():
    conn = sqlite3.connect('turnofacil.db')
    conn.row_factory = sqlite3.Row
    turnos = conn.execute(
        'SELECT * FROM turnos ORDER BY fecha DESC'
    ).fetchall()
    conn.close()
    return jsonify([dict(t) for t in turnos])


@app.route('/api/turnos', methods=['POST'])
def crear_turno():
    datos = request.get_json()
    conn = sqlite3.connect('turnofacil.db')
    conn.execute(
        'INSERT INTO turnos (usuario, servicio, fecha, hora) VALUES (?, ?, ?,'
        ' ?)',
        (datos['usuario'], datos['servicio'], datos['fecha'], datos['hora']),
    )
    conn.commit()
    conn.close()
    return jsonify({'mensaje': 'Turno registrado con éxito'}), 201


if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)