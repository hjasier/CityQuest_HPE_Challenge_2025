# WebSocketManager.py
from flask import Blueprint, request
from socketio_instance import socketio  # Importamos socketio desde el archivo separado
from flask_socketio import emit
from .RouteGenerator import calculate_route
import logging

# Crear Blueprint para WebSocket
websocket_bp = Blueprint("websocket", __name__)

# Diccionario para almacenar clientes conectados (por ID de sesión)
connected_clients = {}

@websocket_bp.route("/emit_test")
def emit_test():
    socketio.emit("mobile_action", {"show_camera": "¡Hola, mundo!"}, namespace="/")
    return "Mensaje enviado"

@websocket_bp.route("/emit_test2")
def emit_test2():
    handle_calculate_route("data")
    return "Mensaje enviado"


@socketio.on("connect")
def handle_connect():
    client_id = request.sid  # Identificador único del cliente
    connected_clients[client_id] = request.sid
    logging.info(f"Cliente conectado: {client_id}")

@socketio.on("disconnect")
def handle_disconnect():
    client_id = request.sid
    connected_clients.pop(client_id, None)
    logging.info(f"Cliente desconectado: {client_id}")

    
@socketio.on("server_command")
def handle_server_command(data):
    """Recibe comandos del agente, maneja la ruta y responde directamente al cliente."""
    action = data.get("action")
    
    if action == "calculate_route":
        handle_calculate_route(data)
    else:
        handle_other_actions(data)




@socketio.on("mobile_response")
def handle_mobile_response(data):
    """Recibe respuestas del móvil (ej: fotos, ubicación) y las reenvía al agente"""
    logging.info(f"Respuesta del móvil recibida: {data}")
    
    if data.get("type") == "photo":
        socketio.emit("agent_action_session", {"type":"photo","image": data.get("image")}, namespace="/", include_self=False)






def handle_calculate_route(data):
    """Maneja la acción de calcular una ruta."""
    logging.info("EMITIENDO RUTA")
    route = calculate_route("destination")
    socketio.emit("mobile_action", {"show_route": route}, namespace="/")

def handle_other_actions(data):
    # Reenviar el comando al móvil
    logging.info(f"RE-Enviando comando al móvil: {data}")
    socketio.emit("mobile_action", data, namespace="/", include_self=False)