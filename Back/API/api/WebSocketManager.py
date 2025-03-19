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


def handle_calculate_route(data):
    """Maneja la acción de calcular una ruta."""
    # Calcular la ruta (esto es solo un ejemplo, reemplázalo con tu lógica real)
    route = calculate_route("destination")
    
    # Obtener el ID del cliente que envió la petición
    client_id = request.sid
    logging.info("EMITIENDO RUTA")
    # Enviar la ruta calculada de vuelta al cliente que la solicitó
    emit("mobile_action", {"show_route": route}, room=client_id)

def handle_other_actions(data):
    """Maneja acciones distintas a calcular una ruta."""
    # Si no es una acción de calcular ruta, reenviar el comando al móvil
    logging.info(f"Enviando comando al móvil: {data}")
    emit("mobile_action", data, broadcast=True)



@socketio.on("mobile_response")
def handle_mobile_response(data):
    """Recibe respuestas del móvil (ej: fotos, ubicación) y las reenvía al agente"""
    logging.info(f"Respuesta del móvil recibida: {data}")
    #esperar 5 segundos y enviar un mensaje de vuelta
    socketio.sleep(5)
    handle_calculate_route("data")

@socketio.on("ALIVE")
def handle_test_alive(data):
    """Recibe mensajes de prueba de los clientes"""
    logging.info(f"Mensaje ALIVE recibido: {data}")
    emit("ALIVE", data, broadcast=True)


