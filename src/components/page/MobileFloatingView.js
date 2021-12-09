import React from 'react';
import PropTypes from 'prop-types';
import "./FloatingView.css";
import { isIOS } from 'react-device-detect';

const NOTHING = 0;
const UP_ARROW = 1;
const DOWN_ARROW = 2;
const LEFT_ARROW = 3;
const RIGHT_ARROW = 4;
const FRESH_HEADER = 5; // header which is newly displayed
const HEADER = 6; // header which is being displayed

const DISPLAY_DURATION = 3000;

const propTypes = {
	isOpen: PropTypes.bool,
	minimized: PropTypes.bool,
	onButtonCloseClick: PropTypes.func,
	isButtonRestoreVisible: PropTypes.bool,
	onButtonRestoreClick: PropTypes.func,
	isButtonMinimizeVisible: PropTypes.bool,
	onButtonMinimizeClick: PropTypes.func,
	onButtonMaximizeClick: PropTypes.func,
	maximizeIcon: PropTypes.string
}
const defaultProps = {
	isOpen: true,
	minimized: false,
	onButtonCloseClick: () => {},
	isButtonRestoreVisible: true,
	onButtonRestoreClick: () => {},
	isButtonMinimizeVisible: true,
	onButtonMinimizeClick: () => {},
	onButtonMaximizeClick: () => {},
	maximizeIcon: "far fa-square"
}

const MobileFloatingView = (props) => {
	/*** State ***/
	const startX = React.useRef(0);
	const startY = React.useRef(0);
	const currentX = React.useRef(0);
	const currentY = React.useRef(0);
	const currentWidth = React.useRef(200);
	const currentHeight = React.useRef(240);
	const [pageInfo, setPageInfo] = React.useState({
		top: startY.current,
		left: startX.current,
		width: currentWidth.current,
		height: currentHeight.current
	});
	const containerRef = React.useRef(null);
	const headerRef = React.useRef(null);
	const leftResizerRef = React.useRef(null);
	const rightResizerRef = React.useRef(null);
	const topResizerRef = React.useRef(null);
	const bottomResizerRef = React.useRef(null);
	const [displayArrow, setDisplayArrow] = React.useState(NOTHING);
	const [displayHeader, setDisplayHeader] = React.useState(NOTHING);
	const taskHideArrowRef = React.useRef({target: NOTHING, task: undefined});
	const taskHideHeaderRef = React.useRef({target: NOTHING, task: undefined});
	/*** Processing ***/
	React.useEffect(()=>{
		// register event listeners for header
		// it is safe to register event listeners here, because it does not exec any outside function in these functions
		const header = headerRef.current;
		header.addEventListener('touchstart', onTouchStartOnHeader, { passive: false });
		header.addEventListener('touchmove', onTouchMoveOnHeader, { passive: false });
		header.addEventListener('touchend', onTouchEndOnHeader, { passive: false });
		return () => {			
			header.removeEventListener('touchstart', onTouchStartOnHeader);
			header.removeEventListener('touchmove', onTouchMoveOnHeader);
			header.removeEventListener('touchend', onTouchEndOnHeader);
		}
	}, [])

	React.useEffect(()=>{
		let resizers = [];
		if(!props.minimized){
			// register event listeners for resizers
			resizers = [topResizerRef.current, bottomResizerRef.current, leftResizerRef.current, rightResizerRef.current];
			for(const resizer of resizers){
				resizer.addEventListener('touchstart', onTouchStartOnResizer, {passive: false});
				resizer.addEventListener('touchmove', onTouchMoveOnResizer, {passive: false});
				resizer.addEventListener('touchend', onTouchEndOnResizer, {passive: false});
			}
		}
		// fix page position
		fixPosition();

		// remove event listeners for header and resizers
		return () => {
			if(!props.minimized){
				for(const resizer of resizers){
					resizer.removeEventListener('touchstart', onTouchStartOnResizer);
					resizer.removeEventListener('touchmove', onTouchMoveOnResizer);
					resizer.removeEventListener('touchend', onTouchEndOnResizer);      
				}
			}
		}
	}, [props.minimized])

	React.useEffect(()=>{
		// add event listeners when orientation changes
		if(props.isOpen){
			if (isIOS) window.addEventListener('orientationchange', fixPosition);
			window.addEventListener('visibilitychange',fixPosition);
			window.addEventListener('blur', fixPosition);
			if (!isIOS) window.addEventListener('resize', fixPosition);

		}
		// remove event listeners when orientation changes
		return () => {
			if (isIOS) window.removeEventListener('orientationchange', fixPosition);
			window.removeEventListener('visibilitychange',fixPosition);
			window.removeEventListener('blur', fixPosition);
			if (!isIOS) window.removeEventListener('resize', fixPosition);
		}
	}, [props.isOpen])

	const fixPosition = React.useCallback((e)=>{
		setTimeout(()=>{
			const container = containerRef.current;
			if(!container) return;
			let needToFix = false;
			let targetX = container.getBoundingClientRect().left;
			if(targetX + container.clientWidth > window.innerWidth) {
				targetX = window.innerWidth - container.clientWidth;
				needToFix = true;
			}
			if(targetX < 0){
				targetX = 0;
				needToFix = true;
			}
			let targetY = container.getBoundingClientRect().top;
			if (targetY + container.clientHeight > window.innerHeight){
				targetY = window.innerHeight - container.clientHeight;
				needToFix = true;
			}
			if(targetY < 0){
				targetY = 0;
				needToFix = true;
			}
			currentX.current = targetX;
			currentY.current = targetY;
			if(needToFix){
				setPageInfo({
					top: targetY,
					left: targetX,
					width: currentWidth.current,
					height: currentHeight.current
				});
			}
		},100);
	}, [])
	/*** Event Handlers ***/
	const onTouchStartOnHeader = React.useCallback((e) => {
		startX.current = e.touches[0].clientX;
		startY.current = e.touches[0].clientY;
		const taskHideHeader = taskHideHeaderRef.current;
		if (taskHideHeader.task) clearTimeout(taskHideHeader.task);
		if(taskHideHeader.target===NOTHING){
			setDisplayHeader(FRESH_HEADER);
			taskHideHeaderRef.current = {
				target: FRESH_HEADER,
				task: null};
		}
		else {
			setDisplayHeader(HEADER);
			taskHideHeaderRef.current = {
				target: HEADER,
				task: null};
		}
	}, [])
	
	const onTouchStartOnResizer = React.useCallback((e) => {
		startX.current = e.touches[0].clientX;
		startY.current = e.touches[0].clientY;
		// display target 
		const targetId = e.target.id;
		const taskHideArrow = taskHideArrowRef.current;
		if(targetId.includes("top-resizer")){
			if(taskHideArrow.target === UP_ARROW){
				clearTimeout(taskHideArrow.task);
			}
			else{
				setDisplayArrow(UP_ARROW);
			}
		}
		else if(targetId.includes("bottom-resizer")){
			if(taskHideArrow.target===DOWN_ARROW){
				clearTimeout(taskHideArrow.task);
			}
			else{
				setDisplayArrow(DOWN_ARROW);
			}
		}
		else if(targetId.includes("left-resizer")){
			if(taskHideArrow.target === LEFT_ARROW){
				clearTimeout(taskHideArrow.task);
			}
			else{
				setDisplayArrow(LEFT_ARROW);
			}
		}
		else if(targetId.includes("right-resizer")){
			if(taskHideArrow.target === RIGHT_ARROW){
				clearTimeout(taskHideArrow.task);
			}
			else{
				setDisplayArrow(RIGHT_ARROW);
			}
		}
	}, [])
	
	const onTouchMoveOnHeader = React.useCallback((e) => {
		const container = containerRef.current;
		const x = e.touches[0].clientX;
		const y = e.touches[0].clientY;
		let targetX = x - startX.current + currentX.current;
		targetX = targetX < 0? 0: targetX;
		targetX = targetX > window.innerWidth - container.clientWidth? window.innerWidth - container.clientWidth: targetX;
		let targetY = y - startY.current + currentY.current;
		targetY = targetY<0? 0: targetY ;
		targetY = targetY > window.innerHeight - container.clientHeight? window.innerHeight - container.clientHeight: targetY;
		setPageInfo({
			top: targetY,
			left: targetX,
			width: currentWidth.current,
			height: currentHeight.current,
		});
		e.preventDefault();
	}, [])
	
	const onTouchMoveOnResizer = React.useCallback((e) => {
		const container = containerRef.current;
		const containerPos =  container.getBoundingClientRect();
		const x = e.touches[0].clientX;
		const y = e.touches[0].clientY;
		const targetId = e.target.id;
		// console.log("FLOAT TARGET", taskHideArrowRef.current.target)
		if(targetId.includes("top-resizer")){
			let targetY = y - startY.current + currentY.current;
			targetY = targetY < 0? 0: targetY;
			let targetHeight = currentHeight.current - (y - startY.current);
			targetHeight = targetHeight < 100? 100: targetHeight;
			targetHeight = containerPos.top + targetHeight > window.innerHeight? window.innerHeight - containerPos.top: targetHeight;
			setPageInfo({
				top: targetY,
				left: currentX.current,
				width: currentWidth.current,
				height: targetHeight
			});
		}
		else if(targetId.includes("bottom-resizer")){
			let targetHeight = currentHeight.current + (y - startY.current);
			targetHeight = targetHeight < 100? 100: targetHeight;
			targetHeight = containerPos.top + targetHeight > window.innerHeight? window.innerHeight - containerPos.top: targetHeight;
			setPageInfo({
				top: currentY.current,
				left: currentX.current,
				width: currentWidth.current,
				height: targetHeight
			})
		} 
		else if(targetId.includes("left-resizer")){
			let targetX = x - startX.current + currentX.current;
			targetX = targetX < 0? 0: targetX;
			let targetWidth = currentWidth.current - (x - startX.current);
			targetWidth = targetWidth <96? 96: targetWidth;
			targetWidth = containerPos.left + targetWidth > window.innerWidth ? window.innerWidth - containerPos.left: targetWidth;
			setPageInfo({
				top: currentY.current,
				left: targetX,
				width: targetWidth,
				height: currentHeight.current
			})
		}
		else if(targetId.includes("right-resizer")){
			let targetWidth = currentWidth.current + (x - startX.current);
			targetWidth = targetWidth <96? 96: targetWidth;
			targetWidth = containerPos.left + targetWidth > window.innerWidth ? window.innerWidth - containerPos.left: targetWidth;
			setPageInfo({
				top: currentY.current,
				left: currentX.current,
				width: targetWidth,
				height: currentHeight.current
			})
		}
		e.preventDefault();
	}, [])
	
	const onTouchEndOnHeader = React.useCallback((e) => {
		const container = containerRef.current;
		const x = e.changedTouches[0].clientX;
		const y = e.changedTouches[0].clientY;
		let targetX = x - startX.current + currentX.current;
		targetX = targetX < 0? 0: targetX;
		targetX = targetX > window.innerWidth - container.clientWidth? window.innerWidth -container.clientWidth: targetX;
		let targetY = y - startY.current + currentY.current;
		targetY = targetY<0? 0: targetY;
		targetY = targetY > window.innerHeight - container.clientHeight? window.innerHeight - container.clientHeight: targetY;
		currentY.current = targetY;
		currentX.current = targetX;
		// hide target
		taskHideHeaderRef.current = {target: taskHideHeaderRef.current.target, task: setTimeout(()=>{
			setDisplayHeader(NOTHING);
			taskHideHeaderRef.current = {
				target: NOTHING,
				task: null
			};
		},DISPLAY_DURATION)}; 
	}, [])
	
	const onTouchEndOnResizer = (e) => {
		const x = e.changedTouches[0].clientX;
		const y = e.changedTouches[0].clientY;
		const targetId = e.target.id;
		if(targetId.includes("top-resizer")){
			let targetY = y - startY.current + currentY.current;
			targetY = targetY < 0? 0: targetY;
			let targetHeight = currentHeight.current - (y - startY.current);
			targetHeight = targetHeight < 100? 100: targetHeight;
			currentY.current = targetY;
			currentHeight.current = targetHeight;
			// hide target
			taskHideArrowRef.current = {target: UP_ARROW, task: setTimeout(()=>{
				setDisplayArrow(NOTHING);
				taskHideArrowRef.current = {
					target: NOTHING,
					task: null};
			},DISPLAY_DURATION)}; 
		}
		else if(targetId.includes("bottom-resizer")){
			let targetHeight = currentHeight.current + (y - startY.current);
			targetHeight = targetHeight < 100? 100: targetHeight;
			currentHeight.current = targetHeight;
			// hide target
			taskHideArrowRef.current = {target: DOWN_ARROW, task: setTimeout(()=>{
				setDisplayArrow(NOTHING);
				taskHideArrowRef.current = {
					target: NOTHING,
					task: null};
			},DISPLAY_DURATION)}; 
		}
		else if(targetId.includes("left-resizer")){
			let targetX = x - startX.current + currentX.current;
			targetX = targetX < 0? 0: targetX;
			let targetWidth = currentWidth.current - (x - startX.current);
			targetWidth = targetWidth > window.innerWidth? window.innerWidth: targetWidth;
			currentX.current = targetX;
			currentWidth.current = targetWidth;
			// hide target
			taskHideArrowRef.current = {target: LEFT_ARROW, task: setTimeout(()=>{
				setDisplayArrow(NOTHING);
				taskHideArrowRef.current = {
					target: NOTHING,
					task: null};
			},DISPLAY_DURATION)}; 
		}
		else if(targetId.includes("right-resizer")){
			let targetWidth = currentWidth.current + (x - startX.current);
			targetWidth = targetWidth > window.innerWidth? window.innerWidth: targetWidth;
			currentWidth.current = targetWidth;
			// hide target
			taskHideArrowRef.current = {target: RIGHT_ARROW, task: setTimeout(()=>{
				setDisplayArrow(NOTHING);
				taskHideArrowRef.current = {
					target: NOTHING,
					task: null};
			},DISPLAY_DURATION)}; 
		}
	}

	const onButtonMinimizeClick = () => {
		if(taskHideHeaderRef.current.target===HEADER){
			props.onButtonMinimizeClick();
		}
	}

	const onButtonRestoreClick = () => {
		if(taskHideHeaderRef.current.target===HEADER){
			props.onButtonRestoreClick();
		}
	}

	const onButtonCloseClick = () => {
		if(taskHideHeaderRef.current.target===HEADER){
			props.onButtonCloseClick();
		}
	}
	
	/*** Main Render */
	return (<div 
		style={!props.minimized?{ 
		top: pageInfo.top + "px", 
		left: pageInfo.left + "px", 
		width: pageInfo.width + "px",
		height: pageInfo.height + "px",
		zIndex: props.isOpen? undefined: "-1"}: {
		top: pageInfo.top + "px",
		left: pageInfo.left + "px", 
		width: undefined,
		height: undefined,
		zIndex: props.isOpen? undefined: "-1"
		}}
		className={!props.minimized? 
			"floating-page-container": 
			"floating-page-minimized-container"}
		ref={containerRef}>
		<div 
			style={{opacity: displayHeader===NOTHING && !props.minimized?0: 1}}
			id="floating-page-header"
			className={!props.minimized?
				"floating-page-mobile-header":
				"floating-page-minimized-header"}
			ref={headerRef}>
			{!props.minimized?
				[props.isButtonMinimizeVisible?
					<button 
					type="button"
					className="floating-page-header-button"
					onClick={onButtonMinimizeClick}>
						<i className="fas fa-minus"></i>
					</button>: null,
				props.isButtonRestoreVisible?
					<button 
					type="button"
					className="floating-page-header-button"
					onClick={onButtonRestoreClick}>
						<i className="far fa-square"></i>
					</button>: null,
				<button 
				type="button"
				className="floating-page-header-button"
				onClick={onButtonCloseClick}>
					<i className="fas fa-times"></i>
				</button>]: 
				<button
				type="button"
				className="floating-page-header-button floating-page-minimized-button"
				onClick={props.onButtonMaximizeClick}>
					<i className={props.maximizeIcon}></i>
				</button>}
		</div>
		<div className="floating-page-content-container">
			{!props.minimized?
			[<div 
			id="left-resizer"
			style={displayArrow===LEFT_ARROW? {opacity: "1"}:{opacity: "0"}}
			className="floating-page-resizer floating-page-left-resizer"
			ref={leftResizerRef}>
				<i 
				id="left-resizer-arrow"
				className="far fa-arrow-alt-circle-left floating-page-arrow-icon"></i>
			</div>,
			<div 
			id="right-resizer"
			style={displayArrow===RIGHT_ARROW? {opacity: "1"}:{opacity: "0"}}
			className="floating-page-resizer floating-page-right-resizer"
			ref={rightResizerRef}>
				<i 
				id="right-resizer-arrow"
				className="far fa-arrow-alt-circle-right floating-page-arrow-icon"></i>
			</div>,
			<div
			id="top-resizer"
			style={displayArrow===UP_ARROW? {opacity: "1"}:{opacity: "0"}}
			className="floating-page-resizer floating-page-top-resizer"
			ref={topResizerRef}>
				<i 
				id="top-resizer-arrow"
				className="far fa-arrow-alt-circle-up floating-page-arrow-icon"></i>
			</div>,
			<div 
			id="bottom-resizer"
			style={displayArrow===DOWN_ARROW? {opacity: "1"}:{opacity: "0"}}
			className="floating-page-resizer floating-page-bottom-resizer"
			ref={bottomResizerRef}>
				<i 
				id="bottom-resizer-arrow"
				className="far fa-arrow-alt-circle-down floating-page-arrow-icon"></i>
			</div>] : null}
			{props.children}
		</div>
	</div>)
}
MobileFloatingView.propTypes = propTypes;
MobileFloatingView.defaultProps = defaultProps;
export default MobileFloatingView;