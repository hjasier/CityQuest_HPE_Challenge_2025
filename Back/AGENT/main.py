import argparse
from livekit.agents import WorkerOptions, cli
from multimodal import entrypoint as multimodal_entrypoint
from pipeline import entrypoint as pipeline_entrypoint

def main():
    # Configurar el parser de argumentos
    parser = argparse.ArgumentParser(description="Selecciona el modelo a ejecutar")
    
    parser.add_argument(
        'mode', 
        nargs='?',  # hace que el argumento sea opcional
        default='dev',  # valor por defecto
        help="Modo de ejecución (por defecto: 'dev')"
    )

    # Aquí se maneja el argumento --modelo
    parser.add_argument(
        "--modelo", 
        choices=["pipeline", "multimodal"], 
        required=False, 
        default="pipeline",
        help="El modelo que se debe ejecutar: 'pipeline' o 'multimodal'"
    )
    
    # Parsear los argumentos
    args = parser.parse_args()

    # Asignar el entrypoint según el modelo elegido
    if args.modelo == "pipeline":
        entrypoint = pipeline_entrypoint
    elif args.modelo == "multimodal":
        entrypoint = multimodal_entrypoint

    # Ejecutar la app con el entrypoint adecuado
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))

if __name__ == "__main__":
    main()
