import cv2
from PIL import Image
from clipModel import ClipModel
import numpy as np

clip_model = ClipModel()

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

    # sample a frame 4 times a second and classify it
    for i in range(0, length, rate//4):
        cap.set(1, i)
        ret, frame = cap.read()
        if ret:
            img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            class_labels = ["regular image", "inappropriate threat or rude gesture"]
            res.append(clip_model.classify_image(img, class_labels))

    return res

path = "./uploads/bad.mov"

res = parse_video(path)
print(res)
# matplot lib
import matplotlib.pyplot as plt
plot = plt.plot([r["inappropriate threat or rude gesture"] for r in res])
plt.show()
print([r for r in res if r["inappropriate threat or rude gesture"] > 0.5])
