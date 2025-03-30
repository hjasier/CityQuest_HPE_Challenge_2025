# Dockerfile para el servicio AGENT
FROM python:3.9-slim

# Establecer el directorio de trabajo
WORKDIR /app


# Copiar los archivos de requisitos
COPY requirements.txt .

# Instalar las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código fuente del AGENT
COPY . .

# Exponer el puerto si se requiere, si no, omitir
EXPOSE 5001

# Comando para ejecutar el servicio AGENT
CMD ["python3", "multimodal.py", "dev"]
