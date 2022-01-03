import numpy as np

def make_rodrigue_rotation_mat(vect, alpha):
	cos_a = np.cos(alpha)
	sin_a = np.sin(alpha)
	wx, wy, wz = vect
	return np.float32([
		[cos_a+wx**2*(1-cos_a), wx*wy*(1-cos_a)-wz*sin_a, wy*sin_a+wx*wz*(1-cos_a)],
		[wz*sin_a+wx*wy*(1-cos_a), cos_a+wy**2*(1-cos_a), -wx*sin_a+wy*wz*(1-cos_a)],
		[-wy*sin_a+wx*wz*(1-cos_a), wx*sin_a+wy*wz*(1-cos_a), cos_a+wz**2*(1-cos_a)]])

def compute_css_rotation_mat(rx, ry, rz):
  rx = rx / 180 * np.pi + np.pi
  ry = ry / 180 * np.pi
  rz = rz / 180 * np.pi
  mat_rx = make_rodrigue_rotation_mat([1, 0, 0], rx)
  oy = np.matmul(mat_rx, [[0],[1],[0]])
  oy = np.reshape(oy, [3])
  mat_ry = make_rodrigue_rotation_mat(oy, ry)
  mat_rxy = np.matmul(mat_ry, mat_rx)
  oz = np.matmul(mat_rxy, [[0],[0],[1]])
  oz = np.reshape(oz, [3])
  mat_rz = make_rodrigue_rotation_mat(oz, rz)
  mat_r = np.matmul(mat_rz, mat_rxy)
  print(mat_r)

compute_css_rotation_mat(-113.59794577216806, 24.771468827066492, -43.80732386465521)
