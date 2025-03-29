from livekit.agents import llm
from typing import Annotated
import logging
from socketio_instance import sio, emit_event
import requests
from dotenv import load_dotenv
from db_driver import SupabaseDatabaseDriver
import os 


load_dotenv()


logger = logging.getLogger("AssistantFnc")
logger.setLevel(logging.INFO)


api_url = os.getenv("API_SERVER_URL")   




db_driver = SupabaseDatabaseDriver()



class AssistantFnc(llm.FunctionContext):
    
    @llm.ai_callable(description="Abre  la camara en el dispositivo del usuario para que pueda enseñarte el objeto , edificio , lugar que desea reconocer")
    async def open_camera(self):
        logging.info("[AGENT API] Abriendo la cámara en tu móvil...")
        await emit_event("server_command", {"action": "show_camera"})
        return "Dame un momento , apunta la cámara al frente"

    @llm.ai_callable(description="Mostrar al usuario una ruta con los retos de por medio como puntos de interes")
    async def calculate_route(self, destination: Annotated[str, llm.TypeInfo(description="Destino final")]):
        logging.info(f"[AGENT API] Calculando la ruta a {destination}...")
        await emit_event("server_command", {"action": "calculate_route", "destination": destination})
        return f"Calculando la ruta a {destination}..."
    
    
    @llm.ai_callable(description="Pide información a la base de datos sobre TODOS los retos activos disponibles : lista(nombre,descripción,premio,tipo)")
    async def ask_challenges(self):
        logging.info(f"[AGENT API] Buscando retos disponibles...")
        challenges = await db_driver.get_all_challenges()
        return f"Los retos disponibles son los siguientes: {challenges}"
    
    
    @llm.ai_callable(description="Pide información a la base de datos sobre TODOS los premios disponibles : lista (precio de premio , descripción)")
    async def ask_prizes(self):
        logging.info(f"[AGENT API] Buscando premios disponibles...")
        prizes = await db_driver.get_all_prizes()
        return f"La lista de premios disponibles es la siguiente: {prizes}"
    
    @llm.ai_callable(description="Acepta el reto que el usuario ha elegido")
    async def accept_challenge(self, challenge_id: Annotated[int, llm.TypeInfo(description="ID del reto")]):
        logging.info(f"[AGENT API] Aceptando el reto {challenge_id}...")
        await emit_event("server_command", {"action": "accept_challenge", "challenge_id": challenge_id})
        return f"Reto {challenge_id} aceptado, buena suerte!"
    
    
    
    #ESTA A MEDIAS , NO BORRAR , FALLA EN DETECTAR LA RESPUESTA DEL CLIENTE POR ALGÚN MOTIVO
    # @llm.ai_callable(description="Pide la localización del usuario para poder describir el lugar donde se encuentra")
    # async def get_user_location(self):
    #     logging.info("[AGENT API] Pidiendo la localización del usuario...")
    #     await emit_event("server_command", {"action": "get_location"})
    #     return "Esperando llegada de ubicación"
    
    
    
    
    
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
    
    
    
    
    
    
