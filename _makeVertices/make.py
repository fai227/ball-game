from PIL import Image
import numpy as np
import json

fileName = "_makeVertices/shape.png"

image = np.array(Image.open(fileName))

imageArray = []
for y in image:
    row = []
    for x in y:
        row.append(x[3] > 128)
    imageArray.append(row)

vertices = []
for y in range(len(imageArray)):
    previous = False
    for x in range(len(imageArray[y])):
        if imageArray[y][x] != previous:
            previous = imageArray[y][x]
            vertices.append({
                "x": (x-25) * 180 / 25,
                "y": (y-25) * 180 / 25,
            })

with open("src/vertices.js", "w") as f:
    f.write("const eightVertices = " + json.dumps(vertices) + ";")
