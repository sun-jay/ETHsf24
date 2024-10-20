ADDR =  '0x77d8e62424085b142631CA8B3c17684Bcfd722bE'



from fastapi import FastAPI, File, UploadFile, Header
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from PIL import Image
import cv2
import pandas as pd
import numpy as np


from call_gpt import gpt
from clipModel import ClipModel
from walrus import upload, get
from run_contract import send_to_chain

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins; adjust this for specific domains
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

UPLOAD_DIR = "uploads/"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # Create directory if it doesn't exist

clip_model = ClipModel()
# open upload_attempts.csv
df = pd.read_csv('upload_attempts.csv')

def parse_video(path, classes = ["regular image", "inappropriate threat"]):
    # test if it is vid
    if not (path[-4:] == ".mp4" or path[-4:] == ".avi" or path[-4:] == ".mov"):
        print("Not a video file")
        return False
    # open video file
    cap = cv2.VideoCapture(path)
    # get the number of frames
    length = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    rate = int(cap.get(cv2.CAP_PROP_FPS))
    res = []

    ims = []
    # sample a frame 4 times a second and classify it
    for i in range(0, length, rate//4):
        cap.set(1, i)
        ret, frame = cap.read()
        if ret:
            img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            ims.append(img)
            res.append(clip_model.classify_image(img, classes))

    return zip(res, ims)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...), wallet_address: str = Header(None)):
    if wallet_address:
        print(f"Wallet address received: {wallet_address}")


    file_location = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_location, "wb") as buffer:
        buffer.write(await file.read())

    # classes = ["regular image", 'rude hand gesture', 'violent weapon']
    # res = parse_video(file_location, classes)

    # for r in res:
    #     print(r)
    #     if not (r[classes[0]] < r[classes[1]] and r[classes[0]] < r[classes[2]]):
    #         print("Inappropriate content detected!")

    #         df = pd.read_csv('upload_attempts.csv')
    #         new_row = pd.DataFrame([{'filename': file.filename, 'status': 'False'}])
    #         df = pd.concat([df, new_row], ignore_index=True)
    #         df.to_csv('upload_attempts.csv', index=False)

    #         message = "Rude gesture detected!" if r[classes[1]] > r[classes[2]] else "Violent weapon detected!"
           
    #         return JSONResponse(content={"filename": file.filename, "message": message, 'status': 'False'})
        
    classes = ["regular image or nice person", "rude gesture or threat"]
    res = parse_video(file_location, classes)

    addr = ADDR

    for r,im in res:

        if r[classes[1]] > 0.5:
            print("Inappropriate content detected!")
            # im.show()
            mes = gpt("What is the threat or innapropriate action in this image? In one sentence, describe the threat.", [im])
            
            new_row = pd.DataFrame([{'filename': file.filename, 'status': 'False', 'wallet_address': wallet_address, 'message': mes}])
            df = pd.read_csv('upload_attempts.csv')
            df = pd.concat([df, new_row], ignore_index=True)
            df.to_csv('upload_attempts.csv', index=False)
            # send_to_chain(filename, status, key, message):
            send_to_chain(file.filename, False, '', mes, addr = addr)

            # im = Image.open(file_location)
           
            return JSONResponse(content={"filename": file.filename, "message": mes, 'status': 'False'})
    
    print("No inappropriate content detected.")
    print("Uploading to Walrus...")
    id = upload(file_location)
    print(f"Uploaded to Walrus with ID: {id}")


    # filename,status,key add to upload_attempts.csv 
    df = pd.read_csv('upload_attempts.csv')
    new_row = pd.DataFrame([{'filename': file.filename, 'status': 'True', 'key': id, 'wallet_address': wallet_address}])
    df = pd.concat([df, new_row], ignore_index=True)
    df.to_csv('upload_attempts.csv', index=False)
    # send_to_chain(filename, status, key, message):
    send_to_chain(file.filename, True, id, '', addr = addr)

    # add to upload_attempts.csv
    return JSONResponse(content={"filename": file.filename, "message": "No inappropriate content detected, upload sucessful", 'status': 'True'})

# endpoint get_items will return upload_attempts.csv as a json, but only ones with the status 'True'
@app.get("/get_items")
async def get_items():
    df = pd.read_csv('upload_attempts.csv')
    df = df[df['status'] == True]
    print(df)
    return JSONResponse(content=df.to_json(orient='records'))


"""
uvicorn main:app --reload
"""
