import React from 'react';
import PropTypes from 'prop-types';
import { isBrowser } from 'react-device-detect';
import './MouseEventReactor.css';

const propTypes={
	onMouseMoving: PropTypes.func,
	onMouseMoved: PropTypes.func
};
const defaultProps={
	onMouseMoving: (x, y) => {},
	onMouseMoved: (x, y) => {}
};
const MouseEventReactor = (props) => {
	/*** States and Variables ***/
	const containerRef = React.useRef(null);
	const startMouseRef = React.useRef({x: 0, y: 0});
	const startPosRef = React.useRef({x: 0, y: 0});
	const positionRef = React.useRef({x:0, y:0});
	const pointerInfoRef = React.useRef({x: 0, y:0, moving: false})
	const [pointerInfo, setPointerInfo] = React.useState(pointerInfoRef.current);
	/*** Processing ***/
	React.useEffect(()=>{
		const container = containerRef.current;
		const onMouseDown = (e)=> {
			const targetName = e.target?.tagName?.toLowerCase();
			if(targetName==='button' || targetName==='label') return;
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
			const targetName = e.target?.tagName?.toLowerCase();
			if(targetName==='button' || targetName==='label') return;
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
		if(isBrowser) container.addEventListener('mousedown', onMouseDown);
		else container.addEventListener('touchstart', onTouchStart);
		return () => {
			if (isBrowser) container.removeEventListener('mousedown', onMouseDown);
			else container.removeEventListener('touchstart', onTouchStart);
		}
	}, [])
	React.useEffect(()=>{
		const container = containerRef.current;
		const onMouseMove = (e) => {
			e.preventDefault();
			if(pointerInfoRef.current.moving){
				props.onMouseMoving({
					x: e.clientX - startMouseRef.current.x + startPosRef.current.x,
					y: e.clientY - startMouseRef.current.y + startPosRef.current.y
				})
			}
		}
		const onTouchMove = (e) => {
			e.preventDefault();
			if(pointerInfoRef.current.moving){
				props.onMouseMoving({
					x: e.touches[0].clientX - startMouseRef.current.x + startPosRef.current.x,
					y: e.touches[0].clientY - startMouseRef.current.y + startPosRef.current.y
				});
			}
		}
		if(isBrowser) container.addEventListener('mousemove', onMouseMove, {passive: false});
		else container.addEventListener('touchmove', onTouchMove, {passive: false});
		return () => {
			if(isBrowser) container.removeEventListener('mousemove', onMouseMove);
			else container.removeEventListener('touchmove', onTouchMove);
		}
	}, [props.onMouseMoving])

	React.useEffect(()=>{
		const container = containerRef.current;
		const onMouseUp = (e) => {
			pointerInfoRef.current.moving = false;
			pointerInfoRef.current = Object.assign({}, pointerInfoRef.current);
			setPointerInfo(pointerInfoRef.current);
			props.onMouseMoved({x: e.clientX - startMouseRef.current.x + startPosRef.current.x, y: e.clientY - startMouseRef.current.y + startPosRef.current.y});
		}
		const onTouchEnd = (e) => {
			pointerInfoRef.current.moving = false;
			pointerInfoRef.current = Object.assign({}, pointerInfoRef.current);
			setPointerInfo(pointerInfoRef.current);
			props.onMouseMoved({x: e.changedTouches[0].clientX - startMouseRef.current.x + startPosRef.current.x, y: e.changedTouches[0].clientY - startMouseRef.current.y + startPosRef.current.y});
		}
		if(isBrowser) container.addEventListener('mouseup', onMouseUp);
		else container.addEventListener('touchend', onTouchEnd);
		return () => {
			if(isBrowser) container.removeEventListener('mouseup', onMouseUp);
			else container.removeEventListener('touchend', onTouchEnd);
		}
	}, [props.onMouseMoved])
	/*** Sub Components ***/
	/*** Event Handlers ***/
	/*** Main Render ***/
	return <div 
	ref={containerRef}
	className='mouse-event-reactor-container'>
		{props.children}
		{/* this is a big pointer to make sure mouse won't move out of the element */}
		<div 
		style={{
			left: pointerInfo.x,
			top: pointerInfo.y,
			width: pointerInfo.moving? 160: 0, 
			height: pointerInfo.moving? 160: 0
		}}
		className="mouse-event-reactor-pointer"/>
	</div>;
}
MouseEventReactor.propTypes = propTypes;
MouseEventReactor.defaultProps = defaultProps;
export default MouseEventReactor;