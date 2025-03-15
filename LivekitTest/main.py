import asyncio

from dotenv import load_dotenv
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli, llm
from livekit.agents.voice_assistant import VoiceAssistant
from livekit.plugins import openai, silero
from api import AssistantFnc

load_dotenv()


async def entrypoint(ctx: JobContext):
    initial_ctx = llm.ChatContext().append(
        role="system",
        text=(
            "Eres un asistente de voz creado por LiveKit. Tu interfaz con los usuarios será por voz. "
            "Debes usar respuestas cortas y concisas, y evitar el uso de puntuación que no se pueda pronunciar."
        ),
    )
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    fnc_ctx = AssistantFnc()
    
    

    assitant = VoiceAssistant(
        vad=silero.VAD.load(),
        stt=openai.STT(),
        llm=openai.LLM.with_azure(),
        tts=openai.TTS(),
        chat_ctx=initial_ctx,
        fnc_ctx=fnc_ctx,
    )
    assitant.start(ctx.room)

    await asyncio.sleep(1)
    await assitant.say("Hey, how can I help you today!", allow_interruptions=True)


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
