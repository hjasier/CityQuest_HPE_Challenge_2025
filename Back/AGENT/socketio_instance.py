# socketio_instance.py
import socketio
import logging
import os
from dotenv import load_dotenv
from ImageHandler import handle_image
from livekit.agents import (AutoSubscribe, JobContext, WorkerOptions, cli, llm)


load_dotenv()

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


API_URL = os.getenv("API_SERVER_URL")

# Instancia de la conexión al servidor por sockets
sio = socketio.Client()
_session = None

def set_session(session):
    """Establece la sesión global para ser usada en los eventos de socketio"""
    global _session
    _session = session
    logging.info("[SOCKETIO] Sesión del modelo establecida correctamente")

def get_session():
    """Obtiene la sesión global"""
    return _session

def get_socketio():
    return sio

def socketio_connect():
    try:
        sio.connect(API_URL)
        logging.info("[SOCKETIO] Conexión establecida con el servidor.")
    except socketio.exceptions.ConnectionError as e:
        logging.error(f"[SOCKETIO] Error al conectar con el servidor: {e}")
        raise


def emit_event(name,data):
    if sio.connected:
        try:
            sio.emit(name, data, namespace="/")
            logging.info(f"[SOCKETIO] Evento emitido: {data}")
        except Exception as e:
            logging.error(f"[SOCKETIO] Error al emitir evento: {e}")
    else:
        logging.warning("[SOCKETIO] No se puede emitir el evento, no hay conexión establecida.")


@sio.event
def connect():
    logging.info("[SOCKETIO] Conexión establecida con el servidor.")

@sio.event
def disconnect():
    logging.info("[SOCKETIO] Desconectado del servidor.")



@sio.event
def agent_action(data):
    logging.info("[SOCKETIO] Acción del agente recibida")
    action_type = data.get("type")
    
    session = get_session()
    if session is None:
        logging.warning("[SOCKETIO] No hay sesión disponible para procesar el evento")
        return
    
    logging.info(f"[SOCKETIO] Session disponible: {session}")
    
    logging.info(f"[SOCKETIO] Tipo de acción: {data}")
    
    if action_type == "photo_update":
        info = data.get("info")
        if info:
            logging.info(f"[SOCKETIO] Información de la foto: {info}")
            session.conversation.item.create(
                llm.ChatMessage(
                    role="system",
                    content=f"Se recibió una actualización de foto: {info}"
                )
            )
            session.response.create()
            logging.info("[SOCKETIO] Mensaje de sistema agregado a la conversación")
