import React from 'react';
import PropTypes from 'prop-types';
import "./BookOpenEffect.css";
const propTypes={
	pages: PropTypes.array,
	currentPage: PropTypes.any,
	renderPage: PropTypes.func,
};
const defaultProps={
	pages: [],
	currentPage: undefined,
	renderPage: (page, left) => {}
};
const BookOpenEffect = (props) => {
	/*** States and Variables ***/
	/*** Processing ***/
	/*** Sub Components ***/
	const renderPages = () => {
		const currentPageIndex = props.pages.indexOf(props.currentPage);

		return props.pages.map((page, index)=>{
			if(index===currentPageIndex){
				return <>
				<div className='book-open-effect-left-page book-open-effect-left-active-page'>
					{props.renderPage(page, true)}
				</div>
				<div className='book-open-effect-right-page book-open-effect-right-active-page'>
					{props.renderPage(page, false)}
				</div>
				</>
			}
			else if(index===(currentPageIndex+1)%props.pages.length){
				return <>
					<div className='book-open-effect-left-page book-open-effect-left-right-inactive-page'>
						{props.renderPage(page, true)}
					</div>
					<div className='book-open-effect-right-page book-open-effect-right-right-inactive-page'>
						{props.renderPage(page, false)}
					</div>
				</>
			}
			else if(index===(currentPageIndex+props.pages.length-1)%props.pages.length) {
				return <>
					<div className='book-open-effect-left-page book-open-effect-left-left-inactive-page'>
						{props.renderPage(page, true)}
					</div>
					<div className='book-open-effect-right-page book-open-effect-right-left-inactive-page'>
						{props.renderPage(page, false)}
					</div>
				</>
			}
			else {
				return null;
			}
		});
	}
	/*** Event Handlers ***/
	/*** Main Render ***/
	return <div className='book-open-effect-container'>
		{renderPages()}
	</div>;
}
BookOpenEffect.propTypes = propTypes;
BookOpenEffect.defaultProps = defaultProps;
export default BookOpenEffect;