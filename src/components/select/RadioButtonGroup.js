import React from 'react';
import PropTypes from 'prop-types';
import "./RadioButtonGroup.css";
const propTypes={
	labels: PropTypes.arrayOf(PropTypes.string),
	onChange: PropTypes.func,
	value: PropTypes.string
};
const defaultProps={
	labels: [],
	onChange: (label) => {},
	value: null,
};
const RadioButtons = (props) => {
	/*** States and Variables ***/
	/*** Processing ***/
	/*** Sub Components ***/
	/*** Event Handlers ***/
	/*** Main Render ***/
	return <>
		{props.labels.map(label=>{
			const selected = label === props.value;
			return <div 
			key={label}
			className="radio-buttons-item-container"
			onClick={(e)=>{props.onChange(label)}}>
				<div className={selected?"radio-buttons-button-selected-container":"radio-buttons-button-container"}>
					<div className={selected?"radio-buttons-selected-button":"radio-buttons-button"} />
				</div>
				<label className="radio-buttons-label">{label}</label>
			</div>
		})}
	</>;
}
RadioButtons.propTypes = propTypes;
RadioButtons.defaultProps = defaultProps;
export default RadioButtons;