import React from 'react';
import PropTypes from 'prop-types';
import "./TopPage.css";
const propTypes={};
const defaultProps={};
const TopPage = (props) => {
	/*** States and Variables ***/
	/*** Processing ***/
	/*** Sub Components ***/
	const renderRightSideButtons = () => {
		return <div className='top-page-right-side-buttons-container'>
			<button className='top-page-right-side-button top-page-button-menu'>
				<i className="fas fa-bars top-page-right-side-button-icon" />
				<label className='top-page-right-side-button-text'>MENU</label>
			</button>
			<button className='top-page-right-side-button top-page-button-comment'>
				<i className="fas fa-comment-dots top-page-right-side-button-icon"/>
				<label className='top-page-right-side-button-text'>COMMENT</label>
			</button>
		</div>
	}
	/*** Event Handlers ***/
	/*** Main Render ***/
	return <div className='top-page-container'>
		<div className='top-page-header'>

		</div>
		<div className='top-page-content-container'>
			{renderRightSideButtons()}
		</div>
		<div className='top-page-footer'>

		</div>
	</div>;
}
TopPage.propTypes = propTypes;
TopPage.defaultProps = defaultProps;
export default TopPage;