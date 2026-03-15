from fastapi import FastAPI
import random

app = FastAPI()

@app.get("/vitals")
def generate_vitals():
    return {
        "heart_rate": random.randint(60, 120),
        "spo2": random.randint(90, 100),
        "temperature": round(random.uniform(36.0, 38.5), 1)
    }