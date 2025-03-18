from flask import Flask
from flask_cors import CORS
import os
import dotenv

# Inicializa dotenv
dotenv.load_dotenv()

# Configuración de la aplicación
app = Flask(__name__)
CORS(app)
# app.config["MONGO_URI"] = os.getenv("MONGO_URI")
# mongo = PyMongo(app)



# Importar rutas
from api.Subtitles import subtitles_bp
from api.TextComposer import text_composer_bp


# Registrar blueprints
app.register_blueprint(subtitles_bp)
app.register_blueprint(text_composer_bp)

if __name__ == '__main__':
    app.run(debug=True)
