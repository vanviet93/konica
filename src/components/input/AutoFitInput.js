import React from 'react';
import PropTypes from 'prop-types';
const propTypes={
	className: PropTypes.string,
	onChange: PropTypes.func,
	onKeyDown: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	onCompositionStart: PropTypes.func,
	onCompositionEnd: PropTypes.func,
};
const defaultProps={
	className: '',
	onChange: (e) => {},
	onKeyDown: (e) => {},
	onFocus: (e) => {},
	onBlur: (e) => {},
	onCompositionStart: (e) => {},
	onCompositionEnd: (e) => {},
};
const AutoFitInput = (props) => {
	/*** States and Variables ***/
	/*** Processing ***/
	/*** Sub Components ***/
	/*** Event Handlers ***/
	/*** Main Render ***/
	return <>
	<input 
	type="text" />
	<canvas ></canvas>
	</>;
}
AutoFitInput.propTypes = propTypes;
AutoFitInput.defaultProps = defaultProps;
export default AutoFitInput;