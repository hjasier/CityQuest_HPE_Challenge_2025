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
            """Eres un asistente virtual para turistas en GreenLake Village. Tu objetivo es ayudar a los usuarios con cualquier consulta relacionada con los retos, premios, rutas, lugares de interés.
                Comienza siempre dando una bienvenida amigable y guiando al turista según sus necesidades. Si el turista pregunta por los retos, las rutas o los premios, debes buscar los datos correspondientes en la base de datos y ofrecer recomendaciones o respuestas personalizadas.
                Si el usuario tiene una consulta específica sobre algún reto o premio, debes preguntar por más detalles o buscar los retos y premios asociados a su consulta.
            """
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
