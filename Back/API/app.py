from flask import Flask
from flask_cors import CORS
import os
import dotenv


dotenv.load_dotenv()


app = Flask(__name__)
CORS(app)


# Importar rutas
from api.Auth import auth_bp

# Registrar blueprints
app.register_blueprint(auth_bp)



if __name__ == '__main__':
    app.run(debug=True)
