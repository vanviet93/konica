import React from 'react';
import PropTypes from 'prop-types';
import "./PyramidModel.css";
const propTypes={};
const defaultProps={};
const PyramidModel = (props) => {
	/*** States and Variables ***/
	/*** Processing ***/
	/*** Sub Components ***/
	/*** Event Handlers ***/
	/*** Main Render ***/
	return <div className='model3d-pyramid-model-container'>
		<div className='model3d-pyramid-model-subcontainer'>
			<div className='model3d-pyramid-model-side1'/>
			<div className='model3d-pyramid-model-side2'/>
			<div className='model3d-pyramid-model-side3'/>
			<div className='model3d-pyramid-model-side4'/>
		</div>
	</div>;
}
PyramidModel.propTypes = propTypes;
PyramidModel.defaultProps = defaultProps;
export default PyramidModel;