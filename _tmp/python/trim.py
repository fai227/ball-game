from PIL import Image
import numpy as np
import os

directory_name = "_tmp/python/before_trim/"

for file in os.listdir(directory_name):
    img = Image.open(directory_name + file)

    _, _, _, alpha_list = img.split() 
    numpy_alpha_list = np.array(alpha_list)

    flag = False
    upper, lower = 0, 0
    for y in range(1000):
        if flag == False:
            if not np.all(numpy_alpha_list[y] == 0):
                upper = y
                flag = True
        else:
            if np.all(numpy_alpha_list[y] == 0):
                lower = y
                break

    flag = False
    left, right = 0, 0
    for x in range(1000):
        if flag == False:
            if not np.all(numpy_alpha_list[:, x] == 0):
                left = x
                flag = True
        else:
            if np.all(numpy_alpha_list[:, x] == 0):
                right = x
                break

    img = img.crop((left, upper, right, lower))
    img.save("_python/after_trim/" + file)