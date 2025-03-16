import asyncio

from dotenv import load_dotenv
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli, llm
from livekit.agents.voice_assistant import VoiceAssistant
from livekit.plugins import openai, silero
from api import AssistantFnc
from livekit.plugins import azure
import os

load_dotenv()




async def entrypoint(ctx: JobContext):
    initial_ctx = llm.ChatContext().append(
        role="system",
        text=(
            "Eres un asistente de voz creado por LiveKit. Tu interfaz con los usuarios será por voz. "
            "Debes usar respuestas cortas y concisas, y evitar el uso de puntuación que no se pueda pronunciar. "
            "TIENES QUE HABLAR EN ESPAÑOL CON ACENTO ESPAÑOL DE ESPAÑA. "
            "TODO LO QUE DIGAS DEBE ESTAR EN ESPAÑOL, NO DEBES HABLAR EN OTRO IDIOMA "
            "Si el usuario habla en español, responde siempre en español."
    ),
    )
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    fnc_ctx = AssistantFnc()
    
    azure_speech_key = os.getenv("AZURE_SPEECH_KEY")  # Tu clave de API
    azure_region = os.getenv("AZURE_REGION")
    
    

    assitant = VoiceAssistant(
        vad=silero.VAD.load(),
        stt=openai.STT(),
        llm=openai.LLM.with_azure(),
        tts=azure.TTS(
            speech_key=azure_speech_key,       # Clave de API de Azure
            speech_region=azure_region,        # Región de tu servicio Azure (ej. "westeurope")  # Si tienes un host personalizado
            language="es-ES",                  # Idioma español de España
            voice="es-ES-LaiaNeural",         # Configura la voz a usar (puedes cambiarla si quieres)                # Tasa de muestreo
        ),
        chat_ctx=initial_ctx,
        fnc_ctx=fnc_ctx,
    )
    assitant.start(ctx.room)

    await asyncio.sleep(1)
    await assitant.say("¡Hola!, ¿Como te puedo ayudar hoy?", allow_interruptions=True)


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
