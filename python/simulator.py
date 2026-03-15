from fastapi import FastAPI
import random
import numpy as np
from sklearn.ensemble import IsolationForest

app = FastAPI()

# Train simple anomaly model
normal_data = []

for _ in range(100):
    heart = random.randint(60, 100)
    spo2 = random.randint(95, 100)
    temp = random.uniform(36.0, 37.5)
    normal_data.append([heart, spo2, temp])

model = IsolationForest(contamination=0.1)
model.fit(normal_data)

@app.get("/vitals")
def generate_vitals():

    heart_rate = random.randint(60, 130)
    spo2 = random.randint(85, 100)
    temperature = round(random.uniform(36.0, 39.0), 1)

    sample = np.array([[heart_rate, spo2, temperature]])
    prediction = model.predict(sample)

    anomaly = True if prediction[0] == -1 else False

    return {
        "heart_rate": heart_rate,
        "spo2": spo2,
        "temperature": temperature,
        "anomaly": anomaly
    }