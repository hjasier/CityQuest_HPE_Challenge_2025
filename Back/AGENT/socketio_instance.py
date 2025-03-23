# socketio_instance.py
import socketio
import logging
import os
from dotenv import load_dotenv
from ImageHandler import handle_image
from session_handler import session_manager


load_dotenv()

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


API_URL = os.getenv("API_SERVER_URL")

# Instancia de la conexión al servidor por sockets
sio = socketio.AsyncClient()

async def connect_socket():
    logging.info("[SOCKETIO] Conectando al servidor...")
    await sio.connect(API_URL)


@sio.event
def connect():
    logging.info("[SOCKETIO] Conexión establecida con el servidor.")

@sio.event
def disconnect():
    logging.info("[SOCKETIO] Desconectado del servidor.")



@sio.event
def agent_action(data):
    if not session_manager.get_session():
        logging.error("[SOCKETIO] La sesión aún no está lista.")
        return
    else:
        logging.info("[SOCKETIO] Session: " + str(session_manager.get_session()))
    #logging.info("[SOCKETIO] Acción del agente recibida: %s", data)
    action_type = data.get("type")
    if action_type == "photo":
        photo = data.get("image")
        if photo:
            handle_image(photo)
            logging.info("[SOCKETIO] Imagen recibida y procesada.")
        else:
            logging.warning("[SOCKETIO] No se recibió ninguna imagen en los datos.")
    else:
        logging.info("[SOCKETIO] Acción del agente recibida: %s", action_type)



