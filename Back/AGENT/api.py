from livekit.agents import llm
from typing import Annotated
import logging
import socketio

logger = logging.getLogger("user-data")
logger.setLevel(logging.INFO)



sio = socketio.Client()
sio.connect("http://localhost:5000")

class AssistantFnc(llm.FunctionContext):
    
    @llm.ai_callable(description="Abrir la cámara en el móvil")
    def open_camera(self):
        logging.info("Abriendo la cámara en tu móvil...")
        sio.emit("server_command", {"action": "open_camera"})
        return "Abriendo la cámara en tu móvil..."

    @llm.ai_callable(description="Mostrar al usuario una ruta con los retos de por medio como puntos de interes")
    def calculate_route(self, destination: Annotated[str, llm.TypeInfo(description="Destino final")]):
        logging.info(f"Calculando la ruta a {destination}...")
        sio.emit("server_command", {"action": "calculate_route", "destination": destination})
        return f"Calculando la ruta a {destination}..."
    
    
