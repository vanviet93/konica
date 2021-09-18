import React from 'react';
import PropTypes from 'prop-types';
import "./ProgressBar.css";

const propTypes = {
	progress: PropTypes.number
};
const defaultProps = {
	progress: 50
};

const ProgressBar = (props) => {
	/*** Main Render ***/
	return <div 
	className="progress-bar-container">
		<div 
		style={{width: props.progress+'%'}}
		className="progress-bar-progress" />
		<div className="progress-bar-first-light"/>
		<div className="progress-bar-second-light"/>
	</div>
}

ProgressBar.propTypes = propTypes;
ProgressBar.defaultProps = defaultProps;
export default ProgressBar;