import React from 'react';
import PropTypes from 'prop-types';
import "./VirtualKey.css";
const propTypes={
	inputKey: PropTypes.string,
	onClick: PropTypes.func
};
const defaultProps={
	inputKey: undefined,
	onClick: () => {}
};
const VirtualKey = (props) => {
	/*** States and Variables ***/
	/*** Processing ***/
	/*** Sub Components ***/
	/*** Event Handlers ***/
	/*** Main Render ***/
	return <div 
	onClick={props.onClick}
	inputkey={props.inputKey}
	className='virtual-key-container' />;
}
VirtualKey.propTypes = propTypes;
VirtualKey.defaultProps = defaultProps;
export default VirtualKey;