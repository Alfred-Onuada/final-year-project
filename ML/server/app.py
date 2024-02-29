from flask import Flask, request, jsonify
import tensorflow as tf
import cv2
import numpy as np
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = Flask(__name__)

# Load the model
multiclass_model = tf.keras.models.load_model('./../tumor-multiclass-model.h5')

import cv2
import numpy as np

# Function to preprocess the image
def preprocess_image(file_storage, target_size=(256, 256)):
    # Convert file storage to numpy array
    nparr = np.frombuffer(file_storage.read(), np.uint8)
    # Decode image
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    # Resize the image
    img = cv2.resize(img, target_size)
    # Expand the dimensions to match the model input shape
    img = np.expand_dims(img, axis=0)
    # Normalize pixel values to the range [0, 1]
    img = img / 255.0
    return img

@app.route("/predict", methods=["POST"])
def predict():
    # Check if the request contains an image file
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"})
    
    file = request.files["image"]
    
    # Check if the file is empty
    if file.filename == "":
        return jsonify({"error": "No selected file"})
    
    # Check if the file is an image
    if file and file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        # Preprocess the image
        image = preprocess_image(file)
        
        # Make prediction
        prediction = multiclass_model.predict(image)

        # format response
        response = {
           'meningioma': None,
           'glioma': None,
           'pituitary': None
        }

        keys = list(response.keys())
        for idx, val in enumerate(prediction[0]):
            response[keys[idx]] = float(val)
        
        # Return the prediction result
        return jsonify({"prediction": response})
    
    else:
        return jsonify({"error": "Invalid file format"})

if __name__ == '__main__':
    PORT = os.getenv('PORT') if os.getenv('PORT') else 3025
    app.run(debug=True, port=PORT, host="0.0.0.0")
