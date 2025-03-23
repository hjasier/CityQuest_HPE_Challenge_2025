from openai import OpenAI
import os
import time

client = OpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key="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",
)

base64 = "https://media.discordapp.net/attachments/829496216807145502/1353344284258078750/vista-desde-la-ria-min.jpg?ex=67e14f95&is=67dffe15&hm=c6a9bcc0bb2ff5f634f6c9253b365627252ead1b6e1279233b0bee6837c808db&=&format=webp&width=923&height=923"

prompt = "Describe la imagen , acuerdate de dar los nombres de los edificios y lugares que veas en la imagen."
model = "gpt-4o-mini"

start_time = time.time()
response = client.chat.completions.create(
    model=model,
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": base64}},
        ],
    }],
)
end_time = time.time()

time_taken = end_time - start_time
answer = response.choices[0].message.content


log_filename = "consulta_log.txt"
with open(log_filename, "a", encoding="utf-8") as file:
    file.write(f"Tiempo: {time_taken:.2f} segundos\n")
    file.write(f"Modelo: {model}\n")
    file.write(f"Prompt: {prompt}\n")
    file.write(f"Respuesta: {answer}\n")
    file.write("-" * 50 + "\n")

print(answer)
