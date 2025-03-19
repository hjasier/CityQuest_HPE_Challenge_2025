import websocket
import json
import time

# URL de tu servidor WebSocket
server_url = "ws://localhost:5000/socket.io/?EIO=4&transport=websocket"

def on_message(ws, message):
    """Función que maneja los mensajes recibidos del servidor."""
    print(f"Mensaje recibido: {message}")
    ws.close()  # Cerrar conexión una vez recibimos el mensaje

def on_error(ws, error):
    """Función que maneja errores."""
    print(f"Error: {error}")

def on_close(ws, close_status_code, close_msg):
    """Función que maneja el cierre de la conexión."""
    print("Conexión cerrada")

def on_open(ws):
    """Función que se ejecuta cuando la conexión es exitosa."""
    print("Conexión establecida")
    
    # Enviar un mensaje de prueba al servidor
    test_data = {
    "type": "event",
    "name": "ALIVE",
    "args": [{"command": "alive"}]
    }
    ws.send(json.dumps(test_data))


# Crear una instancia de WebSocket
ws = websocket.WebSocketApp(
    server_url,
    on_message=on_message,
    on_error=on_error,
    on_close=on_close
)

# Intentar conectar y escuchar el WebSocket
ws.on_open = on_open
ws.run_forever()

