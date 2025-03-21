#ImageHandler.py
from livekit.agents import (AutoSubscribe, JobContext, WorkerOptions, cli, llm)
from livekit.agents.multimodal import MultimodalAgent
from livekit.plugins import openai
import logging
from session_handler import session_manager
from livekit.agents.llm import ChatMessage, ChatImage


# al final esto creo que no se va a usar pero bueno ya se eliminara si on
class ImageHandler:
    def __init__(self):
        self.image_available = False
        self.image_data = None

    def set_image(self, image_data):
        self.image_data = image_data
        self.image_available = True
        logging.info("[IMAGE HANDLER] Imagen recibida y lista para usar.")
    
    def reset_image(self):
        self.image_available = False
        self.image_data = None
        logging.info("[IMAGE HANDLER] Imagen reseteada.")
        


image_handler = ImageHandler()



    
def handle_image(image_data):
    logging.info("[IMAGE HANDLER] Insertando imagen en la conversación...")
    
    image_content = [ChatImage(image=image_data)]
    session_manager.get_session().conversation.item.create(
    llm.ChatMessage(
        role="user",
        content=image_content
    )
    )
    logging.info("[IMAGE HANDLER] Added latest frame to conversation context")
    