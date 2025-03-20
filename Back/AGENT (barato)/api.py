import enum
from typing import Annotated
from livekit.agents import llm
import logging
from livekit.agents import llm
import socketio

logger = logging.getLogger("building-recognition")
logger.setLevel(logging.INFO)


sio = socketio.Client()
sio.connect("http://localhost:5000")


class AssistantFnc(llm.FunctionContext):
    def __init__(self) -> None:
        super().__init__()
    
    @llm.ai_callable(description="Abre el modal de la camara en el dispositivo del usuario para que pueda enseñarte el objeto , edificio , lugar que desea reconocer")
    def open_camera(self):
        logging.info("Abriendo la cámara en tu móvil...")
        sio.emit("server_command", {"action": "open_camera"})
        return "Dame un momento , apunta la cámara al frente"

    @llm.ai_callable(description="Mostrar al usuario una ruta con los retos de por medio como puntos de interes")
    def calculate_route(self, destination: Annotated[str, llm.TypeInfo(description="Destino final")]):
        logging.info(f"Calculando la ruta a {destination}...")
        sio.emit("server_command", {"action": "calculate_route", "destination": destination})
        return f"Calculando la ruta a {destination}..."
    
    
