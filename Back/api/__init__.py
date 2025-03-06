# api/__init__.py

from .Subtitles import subtitles_bp  # Importar el blueprint para items

# Aquí puedes realizar más configuraciones si es necesario
import logging

# Configurar el logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("El paquete api ha sido inicializado.")

