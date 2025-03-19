import enum
from typing import Annotated
from livekit.agents import llm
import logging

logger = logging.getLogger("building-recognition")
logger.setLevel(logging.INFO)


class AssistantFnc(llm.FunctionContext):
    def __init__(self) -> None:
        super().__init__()

    @llm.ai_callable(description="Activate the camera view to recognize the building in front of the user")
    def activate_camera_view(self):
        logger.info("Activating camera view to recognize the building")
        # Here you would add the code to activate the camera view
        # For example, you might call a function that opens the camera and starts image recognition
        # For now, we'll just return a message indicating the camera view is activated
        return "Camera view activated. Recognizing the building in front of you..."

    @llm.ai_callable(description="Get information about the building in front of the user")
    def get_building_info(self):
        logger.info("Getting information about the building")
        # Here you would add the code to recognize the building and get information about it
        # For now, we'll just return a placeholder message
        return "The building in front of you is the Empire State Building."
