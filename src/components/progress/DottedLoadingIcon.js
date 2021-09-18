import React from 'react';
import PropTypes from 'prop-types';
import "./LoadingIcon.css";

const propTypes = {
	size: PropTypes.number,
	color: PropTypes.string,
	duration: PropTypes.number
};
const defaultProps = {
	size: 40,
	color: "#AAA",
	duration: 2, // 2 seconds
};

const DottedLoadingIcon = (props) => {
	/*** Main Render ***/
	return <div 
	className="dotted-loading-icon-container"
	style={{
		width: props.size+'px', 
		height: props.size+'px',
		color: props.color,
		animation: 'inifinite-rotation ' + props.duration + 's linear infinite'}}>
		<i className="fas fa-spinner" 
		style={{fontSize: props.size+'px'}}/>
	</div>
}

DottedLoadingIcon.propTypes = propTypes;
DottedLoadingIcon.defaultProps = defaultProps;
export default DottedLoadingIcon;