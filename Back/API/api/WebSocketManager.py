# WebSocketManager.py
from flask import Blueprint, request
from socketio_instance import socketio  # Importamos socketio desde el archivo separado
from flask_socketio import emit
from .RouteGenerator import handle_calculate_route
import logging
from . import AgentWebSocketManager
from . import ClientWebSocketManager
# Crear Blueprint para WebSocket
websocket_bp = Blueprint("websocket", __name__)

# Diccionario para almacenar clientes conectados (por ID de sesión)
connected_clients = {}


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

    
    
    
    
    
@websocket_bp.route("/emit_test_cam")
def emit_test():
    socketio.emit("mobile_action", {"action": "show_camera"}, namespace="/")
    return "Mensaje enviado"

@websocket_bp.route("/emit_test_route")
def emit_route_test():
    handle_calculate_route("data")
    return "Mensaje enviado"    
    
    
@websocket_bp.route("/emit_test_agent")
def emit_agent_test():
    socketio.emit("agent_action", {"type": "test"}, namespace="/")
    return "Mensaje enviado"    


@websocket_bp.route("/emit_test_location")
def emit_test_location():
    socketio.emit("mobile_action", {"action": "get_location"}, namespace="/")
    return "Mensaje enviado"








