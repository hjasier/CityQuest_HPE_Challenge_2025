from livekit.agents import WorkerOptions, cli
from agent import entrypoint

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))