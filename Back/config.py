import os

class Config:
    """Clase de configuración para la aplicación."""
    
    # Configuración de MongoDB
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/tu_base_de_datos")

    # Otras configuraciones de Flask
    DEBUG = os.getenv("FLASK_DEBUG", "True") == "True"
    SECRET_KEY = os.getenv("SECRET_KEY", "tu_clave_secreta")  # Para la sesión y protección CSRF

    # Configuraciones adicionales (si es necesario)
    # Por ejemplo, para el manejo de CORS
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")  # Cambia "*" por dominios específicos si es necesario
    CORS_SUPPORTS_CREDENTIALS = True

# Cargar la configuración en la aplicación
def load_config(app):
    app.config.from_object(Config)
