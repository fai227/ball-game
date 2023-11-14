from PIL import Image
import numpy as np
import json

fileName = "_other/python/shape.png"
size = 350
secondSize = 240

image = np.array(Image.open(fileName))

imageArray = []
for y in image:
    row = []
    for x in y:
        row.append(x[3] > 128)
    imageArray.append(row)

eightVertices = []
forteenVertices = []
for y in range(len(imageArray)):
    previous = False
    for x in range(len(imageArray[y])):
        if imageArray[y][x] != previous:
            previous = imageArray[y][x]
            eightVertices.append({
                "x": (x-25) * size / 50,
                "y": (y-25) * size / 50,
            })
            forteenVertices.append({
                "x": (x-25) * secondSize / 50,
                "y": (y-25) * secondSize / 50,
            })

with open("_src/vertices.js", "w") as f:
    f.write("const eightVertices = " + json.dumps(eightVertices) + ";" +
            "const forteenVertices = " + json.dumps(forteenVertices) + ";")
