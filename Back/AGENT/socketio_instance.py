import socketio
import logging
import os
from dotenv import load_dotenv
from ImageHandler import handle_image
from livekit.agents import (AutoSubscribe, JobContext, WorkerOptions, cli, llm)
import asyncio

load_dotenv()

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

API_URL = os.getenv("API_SERVER_URL")

# Instancia de la conexión al servidor por sockets
sio = socketio.Client()
_session = None
_loop = None


def init_socketio(session,loop):
    """Establece la sesión global para ser usada en los eventos de socketio"""
    global _session
    global _loop
    _session = session
    _loop = loop
    logging.info("[SOCKETIO] Sesión del modelo establecida correctamente")

def get_session():
    """Obtiene la sesión global"""
    return _session

def get_loop():
    """Obtiene el loop global"""
    return _loop

def get_socketio():
    return sio

def socketio_connect():
    try:
        sio.connect(API_URL)
        logging.info("[SOCKETIO] Conexión establecida con el servidor.")
    except socketio.exceptions.ConnectionError as e:
        logging.error(f"[SOCKETIO] Error al conectar con el servidor: {e}")
        raise

def emit_event(name, data):
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
            
            # Usar asyncio.run_coroutine_threadsafe para ejecutar el código asincrónico
            async def add_photo_update_to_conversation():
                await session.conversation.item.create(
                    llm.ChatMessage(
                        role="system",
                        content=f"Se recibió una actualización de foto: {info}"
                    )
                )
                await session.response.create()

            # Ejecutar la coroutine de manera segura desde un hilo de fondo
            asyncio.run_coroutine_threadsafe(add_photo_update_to_conversation(), _loop)
            logging.info("[SOCKETIO] Mensaje de sistema agregado a la conversación")
