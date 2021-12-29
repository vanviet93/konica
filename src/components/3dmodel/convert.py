import numpy as np

def load_data():
	f = open('plane.obj')
	s = f.read()
	f.close()
	elements = s.split('\n')
	elements = list(filter(lambda element: element.startswith("o ") or element.startswith("v ") or element.startswith("f ") or element.startswith("vn ") ,elements))
	objs = {}
	vertices = []
	vertex_norms = []
	current_obj = []
	for element in elements:
		if element.startswith("o "):
			current_obj = []
			parts = element.split(" ")
			parts = parts[1].split("_")
			objs[parts[0]] = current_obj
		elif element.startswith("v "):
			parts = element.split(" ")
			vertices.append(np.float32([float(parts[1]),float(parts[2]),float(parts[3])]))
		elif element.startswith("vn "):
			parts = element.split(" ")
			vertex_norms.append(np.float32([float(parts[1]),float(parts[2]),float(parts[3])]))
		elif element.startswith("f "):
			parts = element.split(" ")[1:]
			norm_id = int(parts[0].split("/")[2])
			parts = [int(x.split("/")[0])-1 for x in parts]
			face = np.float32([vertices[i] for i in parts])
			norm = vertex_norms[norm_id-1]
			current_obj.append({"face": face, "norm": norm})
	return objs

def make_rotation_matx(angle):
	return np.float32([
		[1, 0, 0],
		[0, np.cos(angle), -np.sin(angle)],
		[0, np.sin(angle),  np.cos(angle)]
	])

def make_rotation_maty(angle):
	return np.float32([
		[np.cos(angle), 0, np.sin(angle)],
		[0, 1, 0],
		[-np.sin(angle), 0, np.cos(angle)]
	])

def make_rotation_matz(angle):
	return np.float32([
		[np.cos(angle), -np.sin(angle), 0],
		[np.sin(angle), np.cos(angle), 0],
		[0, 0, 1]
	])

def compute_rotate(face_norm):
	# init norm : [0,0,1]
	# after rotate rx: 
	# [1        0         0       ]
	# [0        cos(rx)   -sin(rx)]
	# [0        sin(rx)   cos(rx) ]

	# after rotate ry: 
	# [cos(ry)   0         sin(ry)]
	# [0         1         0      ]
	# [-sin(ry)  0         cos(ry)]

	# after rotate rz: 
	# [cos(rz)   -sin(rz)  0]
	# [sin(rz)   cos(rz)   0]
	# [0         0         1]

	# rotatet ry, rz : rz * ry
	# [cos(rz)*cos(ry) -sin(rz) cos(rz)*sin(ry)]
	# [sin(rz)*cos(ry) cos(rz)  sin(rz)*sin(ry)]
	# [-sin(ry)        0        cos(ry)]
	# (1, 0, 0) => first column


	# find ry and rz (rz=0) to rotate (0,0,1) to face_norm
	ry = np.arcsin(-face_norm[2])
	cos_ry = np.cos(ry)
	sin_rz = face_norm[1]/cos_ry
	cos_rz = face_norm[0]/cos_ry
	rz = np.arcsin(sin_rz)
	if cos_rz>0 and (rz<-np.pi/2 or rz>np.pi/2):
		rz = np.pi - rz
	elif cos_rz<0 and (rz>-np.pi/2 and rz<np.pi/2): 
		rz = np.pi - rz
	rt = np.matmul(make_rotation_maty(-ry), make_rotation_matz(-rz))
	r = np.linalg.inv(rt)
	return rt, r


objs = load_data()
rt, r = compute_rotate(objs['Obj1'][0]['norm'])
#print(np.matmul(rt, r))
#print(np.matmul(rt, objs['Obj1'][0]['face'][0]))
face = objs['Obj1'][0]['face']
#print(face)
print(rt)