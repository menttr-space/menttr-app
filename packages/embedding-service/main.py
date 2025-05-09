import pika
import json
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
channel = connection.channel()

channel.queue_declare(queue="embedding_queue", durable=True)

def callback(ch, method, properties, body):
    payload = json.loads(body)
    input_data = payload.get("data", {})
    text = input_data.get("text", "")
    
    embedding = model.encode(text, normalize_embeddings=True).tolist()
    response = json.dumps({"embedding": embedding})
    
    ch.basic_publish(
        exchange='',
        routing_key=properties.reply_to,
        properties=pika.BasicProperties(correlation_id=properties.correlation_id),
        body=response
    )
    
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue="embedding_queue", on_message_callback=callback)

if __name__ == "__main__":
    print(" [*] Waiting for messages. To exit press CTRL+C")
    channel.start_consuming()
