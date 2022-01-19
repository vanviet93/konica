import React from 'react';
import "./ModelPage.css";
import PropTypes from 'prop-types';
import {
	ChristmaxModel,
	SakuraModel
} from '../../components';
const propTypes={};
const defaultProps={};
const ComponentPage = (props) => {
	/*** States and Variables ***/
	/*** Processing ***/
	/*** Sub Components ***/
	///// Render Christmas Model /////
	const renderChristmasModel = () => {
		return <>
			<label className='model-page-label'>CHRISTMAX MODEL</label>
			<ChristmaxModel />
		</>
	}
	///// Render Sakura Model /////
	const renderSakuraModel = () => {
		return <>
			<label className='model-page-label'>SAKURA MODEL</label>
			<SakuraModel />
		</>
	}
	/*** Event Handlers ***/
	
	/*** Main Render ***/
	return <div className="model-page-page-container">
			<div className="model-page-page-subcontainer">
				{renderChristmasModel()}
				{renderSakuraModel()}
			</div>
		</div>;
}
ComponentPage.propTypes = propTypes;
ComponentPage.defaultProps = defaultProps;
export default ComponentPage;