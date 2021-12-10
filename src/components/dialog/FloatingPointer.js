import React from 'react';
import { isBrowser } from 'react-device-detect';
import "./FloatingPointer.css";
import PropTypes from 'prop-types';
const propTypes={
	position: PropTypes.object,
	onMove: PropTypes.func,
	onMoving: PropTypes.func,
	onMoved: PropTypes.func
};
const defaultProps={
	position: {x: 0, y: 0},
	onMove: () => {},
	onMoving: ({x,y}) => {},
	onMoved: ({x,y}) => {}
};
const FloatingPointer = (props) => {
	/*** States and Variables ***/
	const startMouseRef = React.useRef({x: 0, y: 0});
	const startPosRef = React.useRef({x: 0, y: 0});
	const  containerRef = React.useRef(null);
	const positionRef = React.useRef({x:0, y:0});
	const pointerInfoRef = React.useRef({x: 0, y:0, moving: false})
	const [pointerInfo, setPointerInfo] = React.useState(pointerInfoRef.current);
	/*** Processing ***/
	React.useEffect(()=>{
		positionRef.current = props.position;
	}, [props.position])

	React.useEffect(()=>{
		const container = containerRef.current;
		const onMouseDown = (e) => {
			props.onMove();
			startMouseRef.current = {
				x: e.clientX,
				y: e.clientY
			}
			startPosRef.current = {
				x: positionRef.current.x,
				y: positionRef.current.y
			}
			const containerPos = container.getBoundingClientRect();
			pointerInfoRef.current = {
				x: e.clientX - containerPos.x,
				y: e.clientY - containerPos.y,
				moving: true
			}
			setPointerInfo(pointerInfoRef.current);
		}
		const onTouchStart = (e) => {
			props.onMove();
			startMouseRef.current = {
				x: e.touches[0].clientX,
				y: e.touches[0].clientY
			}
			startPosRef.current = {
				x: positionRef.current.x,
				y: positionRef.current.y
			}
			const containerPos = container.getBoundingClientRect();
			pointerInfoRef.current = {
				x: e.touches[0].clientX - containerPos.x,
				y: e.touches[0].clientY - containerPos.y,
				moving: true
			}
			setPointerInfo(pointerInfoRef.current);
		}
		if(isBrowser) {container.addEventListener('mousedown', onMouseDown);}
		else {container.addEventListener('touchstart', onTouchStart);}
		return () => {
			if(isBrowser){container.removeEventListener('mousedown', onMouseDown);}
			else {container.removeEventListener('touchstart', onTouchStart);}
		}
	}, [props.onMove])

	React.useEffect(()=>{
		const container = containerRef.current;
		const onMouseMove = (e) => {
			e.preventDefault();
			if(pointerInfoRef.current.moving){
				props.onMoving({
					x: e.clientX - startMouseRef.current.x + startPosRef.current.x,
					y: e.clientY - startMouseRef.current.y + startPosRef.current.y
				})
			}
		}
		const onTouchMove = (e) => {
			e.preventDefault();
			if(pointerInfoRef.current.moving){
				props.onMoving({
					x: e.touches[0].clientX - startMouseRef.current.x + startPosRef.current.x,
					y: e.touches[0].clientY - startMouseRef.current.y + startPosRef.current.y
				});
			}
		}
		if( isBrowser){container.addEventListener('mousemove', onMouseMove, {passive: false});}
		else {container.addEventListener('touchmove', onTouchMove, {passive: false});}
		return ()=>{
			if(isBrowser){container.removeEventListener('mousemove', onMouseMove);}
			else {container.removeEventListener('touchmove', onTouchMove);}
		}
	}, [props.onMoving])

	React.useEffect(() => {
		const container = containerRef.current;
		const onMouseUp = (e) => {
			pointerInfoRef.current.moving = false;
			pointerInfoRef.current = Object.assign({}, pointerInfoRef.current);
			setPointerInfo(pointerInfoRef.current);
			props.onMoved({x: e.clientX - startMouseRef.current.x + startPosRef.current.x, y: e.clientY - startMouseRef.current.y + startPosRef.current.y});
		}
		const onTouchEnd = (e) => {
			pointerInfoRef.current.moving = false;
			pointerInfoRef.current = Object.assign({}, pointerInfoRef.current);
			setPointerInfo(pointerInfoRef.current);
			props.onMoved({x: e.changedTouches[0].clientX - startMouseRef.current.x + startPosRef.current.x, y: e.changedTouches[0].clientY - startMouseRef.current.y + startPosRef.current.y});
		}
		if (isBrowser){container.addEventListener('mouseup', onMouseUp);}
		else {container.addEventListener('touchend', onTouchEnd);}
		return () => {
			if(isBrowser){container.removeEventListener('mouseup', onMouseUp);}
			else {container.removeEventListener('touchend', onTouchEnd);}
		}
	}, [props.onMoved]);
	/*** Sub Components ***/
	/*** Event Handlers ***/
	/*** Main Render ***/
	return <div 
		ref={containerRef}
		className="floating-pointer-container-anchor"
		style={{
		left: props.position.x, 
		top: props.position.y}}>
			{/* this is a big pointer to make sure mouse won't move out of the element */}
			<div 
			style={{
				left: pointerInfo.x,
				top: pointerInfo.y,
				width: pointerInfo.moving? 160: 0, 
				height: pointerInfo.moving? 160: 0
			}}
			className="floating-pointer-cover"/>
			<div className="floating-pointer-children-anchor">
				{props.children}
			</div>
	</div>;
}
FloatingPointer.propTypes = propTypes;
FloatingPointer.defaultProps = defaultProps;
export default FloatingPointer;