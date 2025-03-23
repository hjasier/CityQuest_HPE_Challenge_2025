# MultiModal.py
from __future__ import annotations
from livekit.agents import (AutoSubscribe, JobContext, WorkerOptions, cli, llm)
from livekit.agents.multimodal import MultimodalAgent
from livekit.plugins import openai
from dotenv import load_dotenv
from api import AssistantFnc
from prompts import WELCOME_MESSAGE, INSTRUCTIONS
import os
import logging
from session_handler import session_manager
from socketio_instance import sio , connect_socket
import asyncio

load_dotenv()


async def entrypoint(ctx: JobContext):

    await connect_socket()
    await ctx.connect(auto_subscribe=AutoSubscribe.SUBSCRIBE_ALL)
    await ctx.wait_for_participant()
    
    model = openai.realtime.RealtimeModel(
        instructions=INSTRUCTIONS,
        voice="shimmer",
        temperature=0.8,
        modalities=["audio", "text"]
    )
    
    
    
    assistant_fnc = AssistantFnc()
    assistant = MultimodalAgent(
        model=model,
        fnc_ctx=assistant_fnc,
    )
    
    assistant.start(ctx.room)
    

    session = model.sessions[0] 
    # session_manager.set_session(session) 
    # session = session_manager.get_session()
        
    
    session.conversation.item.create(
        llm.ChatMessage(
            role="assistant",
            content=WELCOME_MESSAGE
        )
    )
    
    session.response.create()
    
    @session.on("user_speech_committed")
    def on_user_speech_committed(msg: llm.ChatMessage):
        # Si el contenido del mensaje es una lista, la convierte en una cadena donde cada elemento se separa por un
        # salto de línea (\n), y si el elemento es una imagen (ChatImage), lo reemplaza por la palabra [image].
        if isinstance(msg.content, list):
            msg.content = "\n".join("[image]" if isinstance(x, llm.ChatImage) else x for x in msg)
        handle_query(msg)


    def handle_query(msg: llm.ChatMessage):
        session.conversation.item.create(
            llm.ChatMessage(
                role="user",
                content=msg.content
            )
        )
        session.response.create()
        
    
    @sio.event
    async def agent_action_session(data):
        logging.info("Acción del agente recibida")
        action_type = data.get("type")
        
        if action_type == "photo":
            photo = data.get("image")
            if photo:
                logging.info("Photo: " + str(photo))
                image_content = [llm.ChatImage(image=photo)]
                logging.info("Imagen recibida y procesada")
                logging.info("image_content: " + str(image_content))
                await session.conversation.item.create(
                    llm.ChatMessage(
                        role="user",
                        content=image_content
                    )
                )
                await session.response.create()
                logging.info("Imagen recibida y procesada")
            else:
                logging.warning("No se recibió ninguna imagen en los datos")
        else:
            logging.info(f"Acción del agente recibida: {action_type}")



            
    






if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
