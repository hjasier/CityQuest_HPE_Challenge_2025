from livekit.agents import llm
from typing import Annotated
import logging
from socketio_instance import sio

logger = logging.getLogger("AssistantFnc")
logger.setLevel(logging.INFO)



class AssistantFnc(llm.FunctionContext):
    
    @llm.ai_callable(description="Abre  la camara en el dispositivo del usuario para que pueda enseñarte el objeto , edificio , lugar que desea reconocer")
    def open_camera(self):
        logging.info("Abriendo la cámara en tu móvil...")
        sio.emit("server_command", {"show_camera": "open_camera"})
        return "Dame un momento , apunta la cámara al frente"

    @llm.ai_callable(description="Mostrar al usuario una ruta con los retos de por medio como puntos de interes")
    def calculate_route(self, destination: Annotated[str, llm.TypeInfo(description="Destino final")]):
        logging.info(f"Calculando la ruta a {destination}...")
        sio.emit("server_command", {"calculate_route": "calculate_route", "destination": destination})
        return f"Calculando la ruta a {destination}..."
    
    
