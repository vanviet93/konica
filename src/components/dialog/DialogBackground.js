import React from 'react';
import PropTypes from 'prop-types';
import "./DialogBackground.css";

const propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
}
const defaultProps = {
	isOpen: false,
	onClose: () => {}
}
const DialogBackground = (props) => {
	/*** Event Handlers ***/
	const onBackGroundClick = (e) => {
		if(e.target.id==="dialog-background"){
			props.onClose();
		}
	}
	/*** Main Render ***/
	if(!props.isOpen) return null;
	return <div 
	id="dialog-background"
	className="dialog-background"
	onClick={onBackGroundClick}>
		{props.children}
	</div>;
}
DialogBackground.propTypes = propTypes;
DialogBackground.defaultProps = defaultProps;
export default DialogBackground;