import cv2
import numpy as np
img = cv2.imread("globe2.png")
img = cv2.resize(img, [200,100])
img = np.mean(img, axis=2)
img = np.where(img>50, 200, 0)
cv2.imwrite("small_globe.png", img)