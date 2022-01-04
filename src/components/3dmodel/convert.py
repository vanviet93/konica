import numpy as np

def load_data(obj_file, color_file):
	# load point positions
	f = open(obj_file)
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
			face = face[:, [0,2,1]]
			norm = vertex_norms[norm_id-1]
			norm = norm[[0,2,1]]
			current_obj.append({"face": face, "norm": norm})
	# load colors
	colors = {}
	if color_file:
		f = open(color_file, "r")
		elements = f.read()
		f.close()
		elements = elements.split("\n")
		for element in elements:
			object_name, r, g, b = element.split(" ")
			colors[object_name] = np.float32([r,g,b])
	for object_name in objs.keys():
		if object_name not in colors.keys():
			colors[object_name] = np.float32([255,255,255])
	return objs, colors

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

	# rotatet rx, ry : ry * rx
	# [cos(ry)  sin(rx)*sin(ry) cos(rx)*sin(ry)]
	# [0        cos(rx          -sin(rx)      ]
	# [-sin(ry) sin(rx)*cos(ry) cos(rx)*cos(ry)]
	# (0, 0, 1) => [cos(rx)*sin(ry), -sin(rx), cos(rx)*cos(ry)]


	# find rx and ry (rz=0) to rotate (0,0,1) to face_norm
	rx = np.arcsin(-face_norm[1])
	cos_rx = np.cos(rx)
	sin_ry = face_norm[0]/(cos_rx+1e-4)
	cos_ry = face_norm[2]/(cos_rx+1e-4)
	ry = np.arcsin(sin_ry)
	if cos_ry>0 and (ry<-np.pi/2 or ry>np.pi/2):
		ry = np.pi - ry
	elif cos_ry<0 and (ry>-np.pi/2 and ry<np.pi/2): 
		ry = np.pi - ry
	rt = np.matmul(make_rotation_matx(-rx), make_rotation_maty(-ry))
	r = np.linalg.inv(rt)
	return rt, r

def make_rodrigue_rotation_mat(vect, alpha):
	cos_a = np.cos(alpha)
	sin_a = np.sin(alpha)
	wx, wy, wz = vect
	return np.float32([
		[cos_a+wx**2*(1-cos_a), wx*wy*(1-cos_a)-wz*sin_a, wy*sin_a+wx*wz*(1-cos_a)],
		[wz*sin_a+wx*wy*(1-cos_a), cos_a+wy**2*(1-cos_a), -wx*sin_a+wy*wz*(1-cos_a)],
		[-wy*sin_a+wx*wz*(1-cos_a), wx*sin_a+wy*wz*(1-cos_a), cos_a+wz**2*(1-cos_a)]])

def compute_css_rotate(face_points, face_norm):
	cos_rx = face_norm[2]/ np.sqrt(face_norm[1]**2+face_norm[2]**2 + 1e-8)
	sin_rx = -face_norm[1]/ np.sqrt(face_norm[1]**2+face_norm[2]**2 + 1e-8)
	rx = np.arcsin(sin_rx)
	if cos_rx>0 and (rx<-np.pi/2 or rx>np.pi/2):
		rx = np.pi - rx
	elif cos_rx<0 and (rx>-np.pi/2 and rx<np.pi/2): 
		rx = np.pi - rx
	cos_ry = np.sqrt(face_norm[1]**2 + face_norm[2]**2)
	sin_ry = face_norm[0]
	ry = np.arcsin(sin_ry)
	if cos_ry>0 and (ry<-np.pi/2 or ry>np.pi/2):
		ry = np.pi - ry
	elif cos_ry<0 and (ry>-np.pi/2 and ry<np.pi/2): 
		ry = np.pi - ry
	mat_rx = make_rodrigue_rotation_mat([1, 0, 0], rx)
	mat_ry = make_rodrigue_rotation_mat([0, np.cos(rx), np.sin(rx)], ry)
	mat_r_xy = np.matmul(mat_ry, mat_rx)
	rt, r = compute_rotate(face_norm)
	ori_points = np.matmul(rt, face_points.T)
	dz = np.mean(ori_points[2])
	bounds = ori_points.T[:,:2]
	mat_rz = np.matmul(r, np.linalg.inv(mat_r_xy)) # mat_rz
	wx, wy, wz = face_norm
	try:
		a = np.float32([[wz, -wx*wy],[-wy, -wx*wz]])
		b = np.float32([mat_rz[1,0]-wx*wy, mat_rz[2,0]-wx*wz])
		temp_sin_rz, temp_cos_rz = np.linalg.solve(a, b)
		sin_rz = temp_sin_rz/np.sqrt(temp_sin_rz**2 + temp_cos_rz**2)
		cos_rz = temp_cos_rz/np.sqrt(temp_sin_rz**2 + temp_cos_rz**2)
		rz = np.arcsin(sin_rz)
		if cos_rz>0 and (rz<-np.pi/2 or rz>np.pi/2):
			rz = np.pi - rz
		elif cos_rz<0 and (rz>-np.pi/2 and rz<np.pi/2): 
			rz = np.pi - rz
	except:
		rz = 0
	mat_rz = make_rodrigue_rotation_mat(face_norm, rz)
	r_css = np.matmul(mat_rz, mat_r_xy)
	return {
		"transform_mat": r_css,
		"bounds": bounds,
		"z": dz, 
		"rotation":{
			"x": rx, 
			"y": ry,
			"z": rz
		}
	}

def write_files(objects, colors, file_name):
	VIEW_SIZE = 360
	css_text = '.model3d-' + file_name.lower() + '-model-container {\n'
	css_text += '\twidth: ' + str('{:.2f}'.format(VIEW_SIZE)) + 'px;\n'
	css_text += '\theight: ' + str('{:.2f}'.format(VIEW_SIZE)) + 'px;\n'
	css_text += '\tperspective: 10000px;\n'
	css_text += '\ttransform-style: preserve-3d;\n'
	css_text += '\tperspective-origin: 50% 50%;\n'
	css_text += '\tdisplay: flex;\n'
	css_text += '\tjustify-content: center;\n'
	css_text += '\talign-items: center;\n'
	css_text += '\ttransform-origin: 50% 50%;\n'
	css_text += '\tanimation: rotate360 10s infinite linear;\n'
	css_text += '}\n'
	css_text += '@keyframes rotate360 {\n'
	css_text += '\tfrom {\n'
	css_text += '\t\ttransform: rotateY(0deg);\n'
	css_text += '\t}\n'
	css_text += '\tto {\n'
	css_text += '\t\ttransform: rotateY(360deg);\n'
	css_text += '\t}\n'
	css_text += '}\n'
	js_text = 'import React from "react";\n'
	js_text += 'import PropTypes from "prop-types";\n'
	js_text += 'import "./' + file_name + '.css";\n'
	js_text += 'const propTypes={};\n'
	js_text += 'const defaultProps={};\n'
	js_text += 'const ' + file_name + ' = (props) => {\n'
	js_text += '\treturn <div className="model3d-' + file_name.lower() + '-model-container">\n'
	
	for object_name in objects.keys():
		object = objects[object_name]
		count = 0
		color = colors[object_name]
		for plane in object:
			norm = plane['norm']
			face = plane['face']
			
			para = compute_css_rotate(face, norm)
			classname = 'model3d-' + file_name.lower() + '-model-' + object_name.lower() + '-face' + str(count)
			count += 1
			js_text += '\t\t<div className="' + classname + '"/>\n'
			css_text += '.' + classname + ' {\n'
			css_text += '\tposition: absolute;\n'
			color_shade = (np.sum(np.float32([-1,-1,1])*norm)/np.sqrt(3) + 1) / 2
			color_shade = 0.6 + 0.35*color_shade
			r,g,b = color * color_shade
			css_text += '\tbackground-color: rgb(' + str('{:.2f}'.format(r)) + ',' +str('{:.2f}'.format(g)) + ',' +str('{:.2f}'.format(b)) + ');\n'
			min_x = np.min(para["bounds"][:,0])
			max_x = np.max(para["bounds"][:,0])
			min_y = np.min(para["bounds"][:,1])
			max_y = np.max(para["bounds"][:,1])
			
			center_x = (max_x + min_x)/2
			center_y = (max_y + min_y)/2
			ori_center = np.matmul(para["transform_mat"], [[center_x], [center_y], [para["z"]]])
			ori_center = np.reshape(ori_center, [3]) * VIEW_SIZE/2
			
			xs = (para["bounds"][:,0] - min_x) * (VIEW_SIZE/2)
			ys = (para["bounds"][:,1] - min_y) * (VIEW_SIZE/2)
			width = (max_x-min_x)*VIEW_SIZE/2
			height = (max_y-min_y)*VIEW_SIZE/2
			css_text += '\twidth: ' + str('{:.2f}'.format(width)) + 'px;\n'
			css_text += '\theight: ' + str('{:.2f}'.format(height)) + 'px;\n'
			bounds = list(zip(xs,ys))
			bounds = [str('{:.2f}'.format(point[0]))+'px ' + str('{:.2f}'.format(point[1]))+'px' for point in bounds]
			bounds = 'polygon(' + (', '.join(bounds)) + ')'
			css_text += '\tclip-path: ' + bounds + ';\n'
			css_text += '\ttop: 50%;\n'
			css_text += '\tleft: 50%;\n'
			transition = 'translateX(' + str('{:.2f}'.format(ori_center[0] - width/2)) + 'px) translateY('+ str('{:.2f}'.format(ori_center[1] - height/2)) + 'px) translateZ(' + str('{:.2f}'.format(ori_center[2])) + 'px)'
			rx, ry, rz = para["rotation"]["x"], para["rotation"]["y"], para["rotation"]["z"]
			rx = rx / np.pi * 180
			ry = ry / np.pi*180
			rz = rz / np.pi*180
			rotation = 'rotateX(' + str('{:.2f}'.format(rx)) + 'deg) rotateY(' + str('{:.2f}'.format(ry)) + 'deg) rotateZ(' + str('{:.2f}'.format(rz)) + 'deg)' 
			css_text += '\ttransform: ' + transition + ' ' + rotation + '\n'
			css_text += '}\n'

	js_text += '\t</div>\n'
	js_text += '}\n'
	js_text += file_name + '.propTypes = propTypes;\n'
	js_text += file_name + '.defaultProps = defaultProps;\n'
	js_text += 'export default ' + file_name + ';'
	
	js_file = open(file_name + ".js", "w")
	js_file.write(js_text)
	js_file.close()

	css_file = open(file_name + ".css", "w")
	css_file.write(css_text)
	css_file.close()

objs, colors = load_data('Christmax.obj', 'Christmax.txt')
# face = objs["Plane2"][0]["face"]
# norm = objs["Plane2"][0]["norm"]
# rt, r = compute_rotate(norm)
# print("----- R -----\n", r)
# print("----- RT -----\n", rt)
# print("----- POINTS -----\n", face.T)
# flat_points = np.matmul(rt, face.T)
# print("----- FLAT POINTS 1 -----\n", flat_points)
# recovered_points = np.matmul(r, flat_points)
# print("----- RECOVERED POINTS 1 -----\n", recovered_points)
# print("----- ROT MAT 1 -----\n", r)
# para = compute_css_rotate(face, norm)
# print("----- ROT MAT 2 -----\n", para["transform_mat"])
# print("----- ROT ANGLES -----\n", para["rotation"])

#print(colors)
write_files(objs, colors, "ChristmaxModel")