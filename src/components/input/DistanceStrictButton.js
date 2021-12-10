import React from 'react';
import { isBrowser } from 'react-device-detect';
import PropTypes from 'prop-types';
const propTypes={
	style: PropTypes.object,
	className: PropTypes.string,
	onClick: PropTypes.func
};
const defaultProps={
	style: {},
	className: {},
	onClick: (e)=>{}
};
const DistanceStrictButton = (props) => {
	/*** States and Variables ***/
	const buttonRef = React.useRef(null);
	const startPosRef = React.useRef(null);
	/*** Processing ***/
	React.useEffect(()=>{
		const buttonNode = buttonRef.current;
		const onMouseDown = (e) => {
			startPosRef.current = {
				x: e.clientX,
				y: e.clientY
			}
		}
		const onTouchStart = (e) => {
			startPosRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      }
		}
		if (isBrowser) {
			buttonNode.addEventListener('mousedown', onMouseDown);
		}
		else {
			buttonNode.addEventListener('touchstart', onTouchStart);	
		}
		return () => {
			if (isBrowser){
				buttonNode.removeEventListener('mousedown', onMouseDown);
			}
			else {
				buttonNode.removeEventListener('touchstart', onTouchStart);
			}
		}
	}, []);
	React.useEffect(()=>{
		const buttonNode = buttonRef.current;
		const onMouseUp = (e) => {
			if((e.clientX - startPosRef.current.x)**2+(e.clientY - startPosRef.current.y)**2<=225){
				props.onClick(e);
			}
		}
		const onTouchEnd = (e) => {
			if((e.changedTouches[0].clientX - startPosRef.current.x)**2+(e.changedTouches[0].clientY - startPosRef.current.y)**2<=225){
				props.onClick(e);
			}
		}
		if (isBrowser){
			buttonNode.addEventListener('mouseup', onMouseUp);
		}
		else{
			buttonNode.addEventListener('touchend', onTouchEnd);
		}
		return () => {
			if (isBrowser) {
				buttonNode.removeEventListener('mouseup', onMouseUp);
			}
			else {
				buttonNode.removeEventListener('touchend', onTouchEnd);
			}
		}
	}, [props.onClick])
	/*** Sub Components ***/
	/*** Event Handlers ***/
	/*** Main Render ***/
	return <button 
	ref={buttonRef}
	style={props.style}
	className={props.className}>
		{props.children}
	</button>;
}
DistanceStrictButton.propTypes = propTypes;
DistanceStrictButton.defaultProps = defaultProps;
export default DistanceStrictButton;