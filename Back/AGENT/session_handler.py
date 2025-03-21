# session_handler.py
import logging


class SessionManager:
    def __init__(self):
        self.session = None

    def set_session(self, session):
        logging.info("[SESSION MANAGER] Session set.")
        self.session = session

    def get_session(self):
        if self.session is None:
            raise ValueError("Session is not set yet.")
        return self.session

session_manager = SessionManager()


