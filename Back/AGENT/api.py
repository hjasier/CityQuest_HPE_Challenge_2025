from livekit.agents import llm
from typing import Annotated
import logging
import socketio

logger = logging.getLogger("user-data")
logger.setLevel(logging.INFO)



sio = socketio.Client()
sio.connect("http://localhost:5000")

class AssistantFnc(llm.FunctionContext):
    
    @llm.ai_callable(description="Abre el modal de la camara en el dispositivo del usuario para que pueda enseñarte el objeto , edificio , lugar que desea reconocer")
    def open_camera(self):
        logging.info("Abriendo la cámara en tu móvil...")
        sio.emit("server_command", {"open_camera": "open_camera"})
        return "Dame un momento , apunta la cámara al frente"

    @llm.ai_callable(description="Mostrar al usuario una ruta con los retos de por medio como puntos de interes")
    def calculate_route(self, destination: Annotated[str, llm.TypeInfo(description="Destino final")]):
        logging.info(f"Calculando la ruta a {destination}...")
        sio.emit("server_command", {"calculate_route": "calculate_route", "destination": destination})
        return f"Calculando la ruta a {destination}..."
    
    
