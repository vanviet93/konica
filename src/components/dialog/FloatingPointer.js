import React from 'react';
import "./FloatingPointer.css";
import PropTypes from 'prop-types';
const propTypes={
	position: PropTypes.object,
	onMoving: PropTypes.func,
	onMoved: PropTypes.func
};
const defaultProps={
	position: {x: 0, y: 0},
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
			e.preventDefault();
		}
		const onTouchStart = (e) => {
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
			e.preventDefault();
		}
		container.addEventListener('mousedown', onMouseDown, {passive: false});
		container.addEventListener('touchstart', onTouchStart, {passive: false});
		return () => {
			container.removeEventListener('mousedown', onMouseDown);
			container.removeEventListener('touchstart', onTouchStart);
		}
	}, [])

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
		container.addEventListener('mousemove', onMouseMove, {passive: false});
		container.addEventListener('touchmove', onTouchMove, {passive: false});
		return ()=>{
			container.removeEventListener('mousemove', onMouseMove);
			container.removeEventListener('touchmove', onTouchMove);
		}
	}, [props.onMoving])

	React.useEffect(() => {
		const container = containerRef.current;
		const onTouchEnd = (e) => {
			pointerInfoRef.current.moving = false;
			pointerInfoRef.current = Object.assign({}, pointerInfoRef.current);
			setPointerInfo(pointerInfoRef.current);
			props.onMoved({x: e.changedTouches[0].clientX - startMouseRef.current.x + startPosRef.current.x, y: e.changedTouches[0].clientY - startMouseRef.current.y + startPosRef.current.y});
		}
		const onMouseUp = (e) => {
			e.preventDefault();
			e.stopImmediatePropagation();
			pointerInfoRef.current.moving = false;
			pointerInfoRef.current = Object.assign({}, pointerInfoRef.current);
			setPointerInfo(pointerInfoRef.current);
			props.onMoved({x: e.clientX - startMouseRef.current.x + startPosRef.current.x, y: e.clientY - startMouseRef.current.y + startPosRef.current.y});
		}
		container.addEventListener('touchend', onTouchEnd, {passive: false});
		container.addEventListener('mouseup', onMouseUp, {passive: false});
		return () => {
			container.removeEventListener('touchend', onTouchEnd);
			container.removeEventListener('mouseup', onMouseUp);
		}
	}, [props.onMoved]);
	/*** Sub Components ***/
	/*** Event Handlers ***/
	/*** Main Render ***/
	console.log("VANVIET INFO", pointerInfo)
	return <div 
		ref={containerRef}
		className="floating-pointer-container-anchor"
		style={{
		left: props.position.x, 
		top: props.position.y}}>
			<div className="floating-pointer-children-anchor">
				{props.children}
			</div>
			{/* this is a big pointer to make sure mouse won't move out of the element */}
			<div 
			style={{
				left: pointerInfo.x,
				top: pointerInfo.y,
				width: pointerInfo.moving? 300: 0, 
				height: pointerInfo.moving? 300: 0
			}}
			className="floating-pointer-cover"/>
	</div>;
}
FloatingPointer.propTypes = propTypes;
FloatingPointer.defaultProps = defaultProps;
export default FloatingPointer;