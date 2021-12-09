import React from 'react';
import "./FloatingPointer.css";
import PropTypes from 'prop-types';
const propTypes={
	position: PropTypes.object,
	onMove: PropTypes.func,
	onMoved: PropTypes.func
};
const defaultProps={
	position: {x: 0, y: 0},
	onMove: ({x,y}) => {},
	onMoved: ({x,y}) => {}
};
const FloatingPointer = (props) => {
	/*** States and Variables ***/
	const movingRef = React.useRef(false);
	const [moving, setMoving] = React.useState(movingRef.current);
	const startMouseRef = React.useRef({x: 0, y: 0});
	const startPosRef = React.useRef({x: 0, y: 0});
	const  containerRef = React.useRef(null);
	/*** Processing ***/
	React.useEffect(() => {
		const container = containerRef.current;
		const onTouchEnd = (e) => {
			movingRef.current = false;
			setMoving(movingRef.current);
			props.onMoved({x: e.changedTouches[0].clientX - startMouseRef.current.x + startPosRef.current.x, y: e.changedTouches[0].clientY - startMouseRef.current.y + startPosRef.current.y});
		}
		const onMouseUp = (e) => {
			e.preventDefault();
			e.stopImmediatePropagation();
			movingRef.current = false;
			setMoving(movingRef.current);
			props.onMoved({x: e.clientX - startMouseRef.current.x + startPosRef.current.x, y: e.clientY - startMouseRef.current.y + startPosRef.current.y});
		}
		container.addEventListener('touchend', onTouchEnd, {passive: false});
		container.addEventListener('mouseup', onMouseUp, {passive: false});
		return () => {
			container.removeEventListener('touchend', onTouchEnd);
			container.removeEventListener('mouseup', onMouseUp);
		}
	}, [props.onMoved]);
	React.useEffect(()=>{
		const container = containerRef.current;
		const onMouseDown = (e) => {
			startMouseRef.current = {
				x: e.clientX,
				y: e.clientY
			}
			startPosRef.current = {
				x: props.position.x,
				y: props.position.y
			}
			movingRef.current = true;
			setMoving(movingRef.current);
			e.preventDefault();
		}
		const onTouchStart = (e) => {
			startMouseRef.current = {
				x: e.touches[0].clientX,
				y: e.touches[0].clientY
			}
			startPosRef.current = {
				x: props.position.x,
				y: props.position.y
			}
			movingRef.current = true;
			setMoving(movingRef.current);
			e.preventDefault();
		}
		container.addEventListener('mousedown', onMouseDown, {passive: false});
		container.addEventListener('touchstart', onTouchStart, {passive: false});
		return () => {
			container.removeEventListener('mousedown', onMouseDown);
			container.removeEventListener('touchstart', onTouchStart);
		}
	}, [props.position])

	React.useEffect(()=>{
		const container = containerRef.current;
		const onMouseMove = (e) => {
			e.preventDefault();
			if(movingRef.current){
				props.onMove({
					x: e.clientX - startMouseRef.current.x + startPosRef.current.x,
					y: e.clientY - startMouseRef.current.y + startPosRef.current.y
				})
			}
		}
		const onTouchMove = (e) => {
			e.preventDefault();
			if(movingRef.current){
				props.onMove({
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
	}, [props.onMove])
	/*** Sub Components ***/
	/*** Event Handlers ***/
	
	
	
	/*** Main Render ***/
	return <div 
	className="floating-pointer-container"
	id="floating-pointer-container"
	style={{left: props.position.x, top: props.position.y, width: moving? 300: undefined, height: moving? 300: undefined}}
	ref={containerRef}>
		<div className="floating-pointer-children-anchor">
			{props.children}
		</div>
	</div>;
}
FloatingPointer.propTypes = propTypes;
FloatingPointer.defaultProps = defaultProps;
export default FloatingPointer;