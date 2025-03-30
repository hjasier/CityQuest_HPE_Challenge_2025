# Dockerfile para el servicio API
FROM python:3.9-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de requisitos
COPY requirements.txt .

# Instalar las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código fuente de la API
COPY . .

# Exponer el puerto en el que la API escucha
EXPOSE 5000

# Comando para ejecutar la API
CMD ["python3", "app.py"]
