from livekit.agents import llm
from typing import Annotated
import logging
from socketio_instance import sio, emit_event

logger = logging.getLogger("AssistantFnc")
logger.setLevel(logging.INFO)



class AssistantFnc(llm.FunctionContext):
    
    @llm.ai_callable(description="Abre  la camara en el dispositivo del usuario para que pueda enseñarte el objeto , edificio , lugar que desea reconocer")
    async def open_camera(self):
        logging.info("Abriendo la cámara en tu móvil...")
        await emit_event("server_command", {"action": "show_camera"})
        return "Dame un momento , apunta la cámara al frente"

    @llm.ai_callable(description="Mostrar al usuario una ruta con los retos de por medio como puntos de interes")
    async def calculate_route(self, destination: Annotated[str, llm.TypeInfo(description="Destino final")]):
        logging.info(f"Calculando la ruta a {destination}...")
        await emit_event("server_command", {"calculate_route": "calculate_route", "destination": destination})
        return f"Calculando la ruta a {destination}..."
    
    
    
    
    
    
    
    
    
    # @llm.ai_callable(description="Pedir información sobre un lugar o edificio")
    # def ask_info(self, place: Annotated[str, llm.TypeInfo(description="Nombre del lugar o edificio")]):
    #     logging.info(f"Pidiendo información sobre {place}...")
    #     sio.emit("server_command", {"ask_info": "ask_info", "place": place})
    #     return f"Pidiendo información sobre {place}..."

    
    # @llm.ai_callable(description="Mostrar al usuario una imagen")
    # def show_image(self, image: Annotated[str, llm.TypeInfo(description="URL de la imagen")]):
    #     logging.info("Mostrando imagen...")
    #     sio.emit("server_command", {"show_image": "show_image", "image": image})
    #     return "Mostrando imagen..."
    
    # @llm.ai_callable(description="Pedir información sobre métodos de transporte")
    # def ask_transport_info(self, transport: Annotated[str, llm.TypeInfo(description="Nombre del medio de transporte")]):
    #     logging.info(f"Pidiendo información sobre {transport}...")
    #     sio.emit("server_command", {"ask_transport_info": "ask_transport_info", "transport": transport})
    #     return f"Pidiendo información sobre {transport}..."
    
    
    
    
    
    
