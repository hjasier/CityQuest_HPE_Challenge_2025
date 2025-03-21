# pipeline.py
import asyncio
from dotenv import load_dotenv
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli, llm
from livekit.agents.voice_assistant import VoiceAssistant
from livekit.plugins import openai, silero
from api import AssistantFnc
from livekit.plugins import azure
import os
from prompts import WELCOME_MESSAGE, INSTRUCTIONS


load_dotenv()

azure_speech_key = os.getenv("AZURE_SPEECH_KEY")  
azure_region = os.getenv("AZURE_REGION")

    

async def entrypoint(ctx: JobContext):
    
    initial_ctx = llm.ChatContext().append(
        role="system",
        text=(INSTRUCTIONS),
    )
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    fnc_ctx = AssistantFnc()
    

    assitant = VoiceAssistant(
        vad=silero.VAD.load(), #Detector de voz
        stt=openai.STT(
            detect_language=False,
            language="es-ES",
        ),
        llm=openai.LLM.with_azure(),
        tts=azure.TTS(
            speech_key=azure_speech_key,      
            speech_region=azure_region,
            language="es-ES",                  
            voice="es-ES-LaiaNeural",                         
        ),
        chat_ctx=initial_ctx,
        fnc_ctx=fnc_ctx,
    )
    assitant.start(ctx.room)

    await asyncio.sleep(1)
    await assitant.say("¡Hola!, ¿Como te puedo ayudar hoy?", allow_interruptions=True)





if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
