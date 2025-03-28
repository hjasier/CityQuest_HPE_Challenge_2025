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

# Instancia asincrónica de la conexión al servidor por sockets
sio = socketio.AsyncClient()
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

async def socketio_connect():
    try:
        await sio.connect(API_URL)
        logging.info("[SOCKETIO] Conexión establecida con el servidor.")
    except socketio.exceptions.ConnectionError as e:
        logging.error(f"[SOCKETIO] Error al conectar con el servidor: {e}")
        raise

async def emit_event(name, data):
    if sio.connected:
        try:
            await sio.emit(name, data, namespace="/")
            logging.info(f"[SOCKETIO] Evento emitido: {data}")
        except Exception as e:
            logging.error(f"[SOCKETIO] Error al emitir evento: {e}")
    else:
        logging.warning("[SOCKETIO] No se puede emitir el evento, no hay conexión establecida.")


@sio.event
async def connect():
    logging.info("[SOCKETIO] Conexión establecida con el servidor.")

@sio.event
async def disconnect():
    logging.info("[SOCKETIO] Desconectado del servidor.")


@sio.event
async def agent_action(data):
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
            await session.conversation.item.create(
                llm.ChatMessage(
                    role="system",
                    content=f"Se recibió una actualización de foto: {info}"
                )
            )
            await session.response.create()  
            logging.info("[SOCKETIO] Mensaje de sistema agregado a la conversación")
            
    elif action_type == "location_update":
        location = data.get("location")
        if location:
            logging.info(f"[SOCKETIO] Información de la ubicación: {location}")
            await session.conversation.item.create(
                llm.ChatMessage(
                    role="system",
                    content=f"Se recibió una actualización de ubicación: {location}"
                )
            )
            await session.response.create()  
            logging.info("[SOCKETIO] Mensaje de sistema agregado a la conversación")
