# WebSocketManager.py
from flask import Blueprint, request
from socketio_instance import socketio  # Importamos socketio desde el archivo separado
from flask_socketio import emit

# Crear Blueprint para WebSocket
websocket_bp = Blueprint("websocket", __name__)

# Diccionario para almacenar clientes conectados (por ID de sesión)
connected_clients = {}

@socketio.on("connect")
def handle_connect():
    client_id = request.sid  # Identificador único del cliente
    connected_clients[client_id] = request.sid
    print(f"Cliente conectado: {client_id}")

@socketio.on("disconnect")
def handle_disconnect():
    client_id = request.sid
    connected_clients.pop(client_id, None)
    print(f"Cliente desconectado: {client_id}")

    
@socketio.on("server_command")
def handle_server_command(data):
    """Recibe comandos del agente y los reenvía al móvil"""
    print(f"Enviando comando al móvil: {data}")
    emit("mobile_action", data, broadcast=True)

@socketio.on("mobile_response")
def handle_mobile_response(data):
    """Recibe respuestas del móvil (ej: fotos, ubicación) y las reenvía al agente"""
    print(f"Respuesta del móvil recibida: {data}")


@socketio.on("ALIVE")
def handle_test_alive(data):
    """Recibe mensajes de prueba de los clientes"""
    print(f"Mensaje ALIVE recibido: {data}")
    emit("ALIVE", data, broadcast=True)