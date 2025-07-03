from PIL import Image
import numpy as np
import os

directory_name = "_other/python/before_trim/"

for file in os.listdir(directory_name):
    img = Image.open(directory_name + file)

    # 画像のトリミング
    _, _, _, alpha_list = img.split()
    numpy_alpha_list = np.array(alpha_list)

    upper, lower = 0, 0
    for y in range(1000):
        if not np.all(numpy_alpha_list[y] == 0):
            upper = y
            break

    for y in range(999, 0, -1):
        if not np.all(numpy_alpha_list[y] == 0):
            lower = y
            break

    flag = False
    left, right = 0, 0
    for x in range(1000):
        if not np.all(numpy_alpha_list[:, x] == 0):
            left = x
            break

    for x in range(999, 0, -1):
        if not np.all(numpy_alpha_list[:, x] == 0):
            right = x
            break

    img = img.crop((left, upper, right, lower))

    # 画像のリサイズ
    img = img.resize((500, 500), Image.BILINEAR)

    # 画像のトリミング
    img.save("_other/python/after_trim/" + file)