import numpy as np
import io
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import tensorflow as tf
import uvicorn

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:8000"
    "http://localhost:8080"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. Load the Model Once ---
# We load the model at the top level so it stays in memory.
# Do not load the model inside the function, or your server will be very slow.
MODEL_PATH = "flower_classifier.h5"

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("✅ Model loaded successfully.")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    # In production, you might want to exit here if model fails to load

# Configuration (MUST match your training)
IMG_SIZE = (150, 150) 
CLASS_NAMES = ["Flower", "Not Flower"] # Adjust based on 0 vs 1 from your training

@app.post("/predict-flower")
async def predict_info(file: UploadFile = File(...)):
    # 1. Validation: Check file type
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a JPEG or PNG.")

    try:
        # 2. Read the file bytes
        contents = await file.read()
        
        # 3. Convert bytes to PIL Image
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # 4. Resize the image to match model input
        image = image.resize(IMG_SIZE)
        
        # 5. Preprocessing
        img_array = np.array(image)
        img_array = np.expand_dims(img_array, axis=0)  # Shape becomes (1, 150, 150, 3)
        
        # CRITICAL: We do NOT divide by 255.0 here because your model 
        # has a Rescaling layer inside it. We send raw [0-255] values.
        
        # 6. Predict
        prediction = model.predict(img_array)
        score = float(prediction[0][0]) # Convert numpy float to python float
        
        # 7. Interpret Result
        # Assuming 0 = Flower, 1 = Not Flower (verify this with your class indices!)
        # If your training printed "Classes found: ['flower', 'no_flower']", then:
        # 0 -> flower
        # 1 -> no_flower
        
        if score > 0.5:
            result = "Not A Flower"
            confidence = score
        else:
            result = "Flower"
            confidence = 1 - score

        return {
            "filename": file.filename,
            "prediction": result,
            "confidence": f"{confidence:.2%}",
            "raw_score": score
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

port = 8001
if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=port, reload=True)
