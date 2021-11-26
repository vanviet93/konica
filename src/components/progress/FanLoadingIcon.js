import React from 'react';
import PropTypes from 'prop-types';
import "./LoadingIcon.css";

const propTypes = {
	size: PropTypes.number,
	color: PropTypes.string,
	strokeWidth: PropTypes.number,
	duration: PropTypes.number,
};
const defaultProps = {
	size: 40,
	color: "#AAA",
	strokeWidth: 10, 
	duration: 2,// 2 seconds
};

const FanLoadingIcon = (props) => {
	/*** Main Render ***/
	return <div 
	className="fan-loading-icon-container"
	style={{
		width: props.size+'px', 
		height: props.size+'px',
		top: `calc(50% - ${props.size/2}px)`,
		left: `calc(50% - ${props.size/2}px)`,
		border: 'solid ' + props.strokeWidth + 'px '+ props.color,
		animation: 'inifinite-rotation ' + props.duration +'s linear infinite'}}>
	</div>
}

FanLoadingIcon.propTypes = propTypes;
FanLoadingIcon.defaultProps = defaultProps;
export default FanLoadingIcon;