import React from 'react';
import PropTypes from 'prop-types';
import { isBrowser } from 'react-device-detect';
import "./SwipeableMultiImageViewer.css";
import MouseEventReactor from '../page/MouseEventReactor';
const propTypes={
	srcs: PropTypes.arrayOf(PropTypes.any),
	currentPos: PropTypes.number,
	onChange: PropTypes.func,
	isFullScreen: PropTypes.bool,
	isButtonFullscreenVisible: PropTypes.bool,
	onButtonFullscreenClick: PropTypes.func
};
const defaultProps={
	srcs: [],
	currentPos: 0,
	onChange: (newPos) => {},
	isFullScreen: false,
	isButtonFullscreenVisible: true,
	onButtonFullscreenClick: () => {}
};

const SwipeableMultiImageViewer = (props) => {
	/*** States and Variables ***/
	const [imageState, setImageState] = React.useState({
		swiping: false,
		progress: 0
	});
	/*** Processing ***/
	/*** Sub Components ***/
	const renderImages = () => {
		return props.srcs.map((src, pos)=>{
			const className=pos===props.currentPos?'swipeable-multi-image-viewer-center-image-container': 
			(pos===props.currentPos-1?'swipeable-multi-image-viewer-left-image-container':
			(pos===props.currentPos+1?'swipeable-multi-image-viewer-right-image-container':
			'swipeable-multi-image-viewer-hidden-image-container'));
			return <div 
			key={src}
			className={className}>
				<img 
				src={src}
				className='swipeable-multi-image-viewer-image'/>
			</div>
		});
	}

	const renderImageSelector = () => {
		return <div className='swipeable-multi-image-viewer-image-selector-container'>
			<div className='swipeable-multi-image-viewer-image-selector-subcontainer'>
				{props.srcs.map((src,pos)=>{
					return <button 
					key={src}
					onClick={(e)=>{props.onChange(pos)}}
					className='swipeable-multi-image-viewer-image-selector-button'>
						<div className={pos===props.currentPos?'swipeable-multi-image-viewer-selected-image-selector-icon': 'swipeable-multi-image-viewer-image-selector-icon'}/>
					</button>
				})}
			</div>
		</div>
	}
	/*** Event Handlers ***/
	const onMoveForward = () => {
		if(props.currentPos<props.srcs.length-1){
			props.onChange(props.currentPos+1);
		}
		else {
			props.onChange(0);
		}
	}
	const  onMoveBack = () => {
		if(props.currentPos>0){
			props.onChange(props.currentPos-1);
		}
		else {
			props.onChange(props.srcs.length-1);
		}
	}
	const onSwipingImage = (e) => {
		setImageState({
			swiping: true,
			progress: e.dx/40
		});
	}
	const onSwipedImage = (e) => {
		if(e.dx>=40){
			onMoveBack();
		}
		else if(e.dx<=-40){
			onMoveForward();
		}
		setImageState({
			swiping: false,
			progress: 0
		});
	}
	const onClickImage = (e)=>{
		if(e.x<e.w/2) {
			onMoveBack();
		}
		else {
			onMoveForward();
		}
	}
	/*** Main Render ***/
	return <div className='swipeable-multi-image-viewer-container'>
		<MouseEventReactor
		onMouseMoving={onSwipingImage}
		onMouseMoved={onSwipedImage}
		onClick={onClickImage}>
			{renderImages()}
			<button 
			onClick={onMoveBack}
			className={isBrowser?'swipeable-multi-image-viewer-browser-left-swiper': 'swipeable-multi-image-viewer-mobile-left-swiper'}>
				<i className="fas fa-chevron-left" />
			</button>
			<button 
			onClick={onMoveForward}
			className={isBrowser?'swipeable-multi-image-viewer-browser-right-swiper': 'swipeable-multi-image-viewer-mobile-right-swiper'}>
				<i className="fas fa-chevron-right" />
			</button>
			{imageState.swiping?<div 
			style={{
				opacity: Math.abs(imageState.progress)
			}}
			className='swipeable-multi-image-viewer-arrow-container'>
				<i className={imageState.progress<0?"fas fa-arrow-alt-circle-right":"fas fa-arrow-alt-circle-left"} />
			</div>: null}
			{renderImageSelector()}
		</MouseEventReactor>
		{props.isButtonFullscreenVisible?
		<button 
		onClick={props.onButtonFullscreenClick}
		className='swipeable-multi-image-viewer-button-fullscreen'>
			{props.isFullScreen?
			<i className="fas fa-compress" />:
			<i className="fas fa-expand" />}	
		</button>: null}
	</div>;
}
SwipeableMultiImageViewer.propTypes = propTypes;
SwipeableMultiImageViewer.defaultProps = defaultProps;
export default SwipeableMultiImageViewer;