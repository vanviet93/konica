import React from 'react';
import PropTypes from 'prop-types';
import './MultiImageViewer.css'
import { isBrowser, isMobile } from 'react-device-detect';

const propTypes={
	srcs: PropTypes.arrayOf(PropTypes.any),
	currentSource: PropTypes.number,
	onChange: PropTypes.func,
	isFullscreen: PropTypes.bool,
	isButtonFullscreenVisible: PropTypes.bool,
	onButtonFullscreenClick: PropTypes.func

};
const defaultProps={
	srcs: [],
	currentPos: 0,
	onChange: (newPos) => {},
	isFullscreen: false,
	isButtonFullscreenVisible: true,
	onButtonFullscreenClick: () => {}
};
const MultiImageViewer = (props) => {
	/*** States and Variables ***/
	/*** Processing ***/
	/*** Sub Components ***/
	const renderImages = () => {
		return props.srcs.map((src, pos)=>{
			const className=pos===props.currentPos?'multi-image-viewer-center-image-container': 
			(pos===props.currentPos-1?'multi-image-viewer-left-image-container':
			(pos===props.currentPos+1?'multi-image-viewer-right-image-container':
			'multi-image-viewer-hidden-image-container'));
			return <div 
			key={src}
			className={className}>
				<img 
				src={src}
				className='multi-image-viewer-image'/>
			</div>
		});
	}

	const renderImageSelector = () => {
		return <div className='multi-image-viewer-image-selector-container'>
			<div className='multi-image-viewer-image-selector-subcontainer'>
				{props.srcs.map((src,pos)=>{
					return <div 
					key={src}
					onClick={(e)=>{props.onChange(pos)}}
					className='multi-image-viewer-image-selector-button'>
						<div className={pos===props.currentPos?'multi-image-viewer-selected-image-selector-icon': 'multi-image-viewer-image-selector-icon'}/>
					</div>
				})}
			</div>
		</div>
	}
	/*** Event Handlers ***/
	const onMoveForward = () => {
		if(props.currentPos<props.srcs.length-1){
			props.onChange(props.currentPos+1);
		}
	}
	const  onMoveBack = () => {
		if(props.currentPos>0){
			props.onChange(props.currentPos-1);
		}
	}
	/*** Main Render ***/
	return <div className='multi-image-viewer-container'>
		{renderImages()}
		<div 
		onClick={onMoveBack}
		className={isBrowser?'multi-image-viewer-browser-left-swiper': 'multi-image-viewer-mobile-left-swiper'}>
			<i className="fas fa-chevron-left" />
		</div>
		<div 
		onClick={onMoveForward}
		className={isBrowser?'multi-image-viewer-browser-right-swiper': 'multi-image-viewer-mobile-right-swiper'}>
			<i className="fas fa-chevron-right" />
		</div>
		
		{renderImageSelector()}
	</div>;
}
MultiImageViewer.propTypes = propTypes;
MultiImageViewer.defaultProps = defaultProps;
export default MultiImageViewer;