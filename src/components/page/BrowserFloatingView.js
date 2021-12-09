import React from 'react';
import PropTypes from 'prop-types';
import FloatingPointer from '../dialog/FloatingPointer';
import "./FloatingView.css";

const NOTHING = 0;
const UP_ARROW = 1;
const DOWN_ARROW = 2;
const LEFT_ARROW = 3;
const RIGHT_ARROW = 4;
const HEADER = 5;

const propTypes = {
	isOpen: PropTypes.bool,
	minimized: PropTypes.bool,
  onButtonCloseClick: PropTypes.func,
	isButtonRestoreVisible: PropTypes.bool,
	onButtonRestoreClick: PropTypes.func,
	isButtonMinimizeVisible: PropTypes.bool,
	onButtonMinimizeClick: PropTypes.func,
	onButtonMaximizeClick: PropTypes.func,
	maximizeIcon: PropTypes.string,
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
	maximizeIcon: "far fa-square",
}

const BrowserFloatingView = (props) => {
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
	const taskHideArrowRef = React.useRef({arrow: undefined, task: undefined})
	const draggedObjRef = React.useRef(NOTHING);
	const deleteMouseClickTask = React.useRef(null);
	/*** Processing ***/
	React.useEffect(()=>{
		// register event listeners for header
		const header = headerRef.current;
		header.addEventListener('mousedown', onMouseDownOnHeader);
		header.addEventListener('mousemove', onMouseMoveOnHeader);
		header.addEventListener('mouseup', onMouseUpOnHeader);
		header.addEventListener('mouseenter', onMouseEnterOnHeader);
		header.addEventListener('mouseleave', onMouseLeaveOnHeader);
		//header.addEventListener('click', onClickOnHeader);
		
		// remove event listeners for header and resizers
		return () => {
			header.removeEventListener('mousedown', onMouseDownOnHeader);
			header.removeEventListener('mousemove', onMouseMoveOnHeader);
			header.removeEventListener('mouseup', onMouseUpOnHeader);
			header.removeEventListener('mouseenter', onMouseEnterOnHeader);
			header.removeEventListener('mouseleave', onMouseLeaveOnHeader);
		}
	}, [])

	React.useEffect(()=>{
		// register event listeners for resizers
		let resizers = [];
		if(!props.minimized){
			resizers = [topResizerRef.current, bottomResizerRef.current, leftResizerRef.current, rightResizerRef.current];
			for(const resizer of resizers){
				resizer.addEventListener('mousedown', onMouseDownOnResizer);
				resizer.addEventListener('mousemove', onMouseMoveOnResizer);
				resizer.addEventListener('mouseup', onMouseUpOnResizer);
				resizer.addEventListener('mouseenter', onMouseEnterOnResizer);
				resizer.addEventListener('mouseleave', onMouseLeaveOnResizer);
			}
		}
		return () => {
			if(!props.minimized){
				for(const resizer of resizers){
					resizer.removeEventListener('mousedown', onMouseDownOnResizer);
					resizer.removeEventListener('mousemove', onMouseMoveOnResizer);
					resizer.removeEventListener('mouseup', onMouseUpOnResizer);
					resizer.removeEventListener('mouseenter', onMouseEnterOnResizer);
					resizer.addEventListener('mouseleave', onMouseLeaveOnResizer);
				}
			}
		}
	}, [props.minimized])
	/*** Event Handlers ***/
	const onMouseDownOnHeader = React.useCallback((e) => {
		startX.current = e.clientX;
		startY.current = e.clientY;
		draggedObjRef.current = HEADER;
		if(deleteMouseClickTask.current){
			clearTimeout(deleteMouseClickTask.current);
		}
		deleteMouseClickTask.current = setTimeout(()=>{
			deleteMouseClickTask.current = null;
		}, 400);
	}, [])
	
	const onMouseDownOnResizer = React.useCallback((e) => {
		startX.current = e.clientX;
		startY.current = e.clientY;
		// display arrow 
		const targetId = e.target.id;
		const taskHideArrow = taskHideArrowRef.current;
		if(targetId.includes("top-resizer")){
			draggedObjRef.current = UP_ARROW;
		}
		else if(targetId.includes("bottom-resizer")){
			draggedObjRef.current = DOWN_ARROW;
		}
		else if(targetId.includes("left-resizer")){
			draggedObjRef.current = LEFT_ARROW;
		}
		else if(targetId.includes("right-resizer")){
			draggedObjRef.current = RIGHT_ARROW;
		}
	}, [])
	
	const onMouseMoveOnHeader = React.useCallback((e) => {
		const container = containerRef.current;
		const x = e.clientX;
		const y = e.clientY;
		let targetX = x - startX.current + currentX.current;
		if(draggedObjRef.current!==HEADER) return;
		targetX = targetX < 0? 0: targetX;
		targetX = targetX > window.innerWidth - container.clientWidth? window.innerWidth - container.clientWidth: targetX;
		let targetY = y - startY.current + currentY.current;
		targetY = targetY<0? 0: targetY ;
		targetY = targetY > window.innerHeight - container.clientHeight? window.innerHeight - container.clientHeight: targetY;
		setPageInfo({
			top: targetY,
			left: targetX,
			width: currentWidth.current,
			height: currentHeight.current
		});
		e.preventDefault();
	}, [])
	
	const onMouseMoveOnResizer = React.useCallback((e) => {
		const container = containerRef.current;
		const containerPos =  container.getBoundingClientRect();
		const x = e.clientX;
		const y = e.clientY;
		const targetId = e.target.id;
		if (draggedObjRef.current===NOTHING || draggedObjRef.current===HEADER) return;
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
			targetWidth = targetWidth > window.innerWidth? window.innerWidth: targetWidth;
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
			targetWidth = targetWidth > window.innerWidth? window.innerWidth: targetWidth;
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
	
	const onMouseUpOnHeader = React.useCallback((e) => {
		const container = containerRef.current;
		const x = e.clientX;
		const y = e.clientY;
		let targetX = x - startX.current + currentX.current;
		targetX = targetX < 0? 0: targetX;
		targetX = targetX > window.innerWidth - container.clientWidth? window.innerWidth -container.clientWidth: targetX;
		let targetY = y - startY.current + currentY.current;
		targetY = targetY<0? 0: targetY;
		targetY = targetY > window.innerHeight - container.clientHeight? window.innerHeight - container.clientHeight: targetY;
		currentY.current = targetY;
		currentX.current = targetX;
		draggedObjRef.current = NOTHING;
		const targetId = e.target.id;
		if(deleteMouseClickTask.current){
			if(targetId.includes("floating-page-header-button-minimize")){
				props.onButtonMinimizeClick();
			}
			else if(targetId.includes("floating-page-header-button-restore")){
				props.onButtonRestoreClick();
			}
			else if(targetId.includes("floating-page-header-button-close")){
				props.onButtonCloseClick();
			}
			else if(targetId.includes("floating-page-header-button-maximize")){
				props.onButtonMaximizeClick();
			}
		}
		clearTimeout(deleteMouseClickTask.current);
		deleteMouseClickTask.current = null;
	}, [])
	
	const onMouseUpOnResizer = (e) => {
		const x = e.clientX;
		const y = e.clientY;
		const targetId = e.target.id;
		if (draggedObjRef===HEADER||draggedObjRef.current===NOTHING) return;
		if(targetId.includes("top-resizer")){
			let targetY = y - startY.current + currentY.current;
			targetY = targetY < 0? 0: targetY;
			let targetHeight = currentHeight.current - (y - startY.current);
			targetHeight = targetHeight < 100? 100: targetHeight;
			currentY.current = targetY;
			currentHeight.current = targetHeight;
			// hide arrow
			taskHideArrowRef.current = {arrow: UP_ARROW, task: setTimeout(()=>{
				taskHideArrowRef.current.arrow = NOTHING;
			},500)}; 
		}
		else if(targetId.includes("bottom-resizer")){
			let targetHeight = currentHeight.current + (y - startY.current);
			targetHeight = targetHeight < 100? 100: targetHeight;
			currentHeight.current = targetHeight;
			// hide arrow
			taskHideArrowRef.current = {arrow: DOWN_ARROW, task: setTimeout(()=>{
				taskHideArrowRef.current.arrow = NOTHING;
			},500)}; 
		}
		else if(targetId.includes("left-resizer")){
			let targetX = x - startX.current + currentX.current;
			targetX = targetX < 0? 0: targetX;
			let targetWidth = currentWidth.current - (x - startX.current);
			targetWidth = targetWidth > window.innerWidth? window.innerWidth: targetWidth;
			currentX.current = targetX;
			currentWidth.current = targetWidth;
			// hide arrow
			taskHideArrowRef.current = {arrow: LEFT_ARROW, task: setTimeout(()=>{
				taskHideArrowRef.current.arrow = NOTHING;
			},500)}; 
		}
		else if(targetId.includes("right-resizer")){
			let targetWidth = currentWidth.current + (x - startX.current);
			targetWidth = targetWidth > window.innerWidth? window.innerWidth: targetWidth;
			currentWidth.current = targetWidth;
			// hide arrow
			taskHideArrowRef.current = {arrow: RIGHT_ARROW, task: setTimeout(()=>{
				taskHideArrowRef.current.arrow = NOTHING;
			},500)}; 
		}
		draggedObjRef.current = NOTHING;
	}

	const onMouseEnterOnHeader = React.useCallback((e) => {
		// if mouse enter without left button pressed
		if(e.buttons===0 || (e.which!==1 && e.button!==1) ){
			// and mouse does not release header yet
			if(draggedObjRef.current===HEADER){
				const containerExtents = containerRef.current.getBoundingClientRect();
				currentX.current = containerExtents.left;
				currentY.current = containerExtents.top;
				draggedObjRef.current = NOTHING;
			}
		}
	}, [])

	const onMouseEnterOnResizer = React.useCallback((e) => {
		// if mouse enter without left button pressed
		if(e.buttons===0 || (e.which!==1 && e.button!==1) ){
			// and mouse does not release header yet
			const targetId = e.target.id;
			const containerExtents = containerRef.current.getBoundingClientRect();
			if(draggedObjRef.current===LEFT_ARROW && targetId.includes("left-resizer")){
				currentX.current = containerExtents.left;
				currentWidth.current = containerExtents.width;
				draggedObjRef.current = NOTHING;
			}
			else if(draggedObjRef.current===RIGHT_ARROW && targetId.includes("right-resizer")){
				currentWidth.current = containerExtents.width;
				draggedObjRef.current = NOTHING;
			}
			else if(draggedObjRef.current===UP_ARROW && targetId.includes("top-resizer")){
				currentY.current = containerExtents.top;
				currentHeight.current = containerExtents.height;
				draggedObjRef.current = NOTHING;
			}
			else if(draggedObjRef.current===DOWN_ARROW && targetId.includes("bottom-resizer")){
				currentHeight.current = containerExtents.height;
				draggedObjRef.current = NOTHING;
			}
		}
	}, [])

	const onMouseLeaveOnHeader = React.useCallback((e) => {
		onMouseMoveOnHeader(e);
	}, [])

	const onMouseLeaveOnResizer = React.useCallback((e) => {
		onMouseMoveOnResizer(e);
	}, [])
	/*** Main Render */
	return (<div 
		style={!props.minimized?{ 
				top: pageInfo.top + "px", 
				left: pageInfo.left + "px", 
				width: pageInfo.width + "px",
				height: pageInfo.height + "px",
				zIndex: props.isOpen? undefined: "-1",
				opacity: props.isOpen? 1: 0}: 
				{top: pageInfo.top + "px",
				left: pageInfo.left + "px", 
				width: undefined,
				height: undefined,
				zIndex: props.isOpen? undefined: "-1",
				opacity: props.isOpen? 1: 0
			}
		}
		className={!props.minimized? 
			"floating-page-container": 
			"floating-page-minimized-container"}
		ref={containerRef}>
		<FloatingPointer
			position={0,0}>
			<div 
				id="floating-page-header"
				className={!props.minimized?
					"floating-page-browser-header":
					"floating-page-minimized-header"}
				ref={headerRef}>
				{!props.minimized?
					[props.isButtonMinimizeVisible?
						<button 
						id="floating-page-header-button-minimize"
						type="button"
						className="floating-page-header-button">
							<i 
							id="floating-page-header-button-minimize-icon"
							className="fas fa-minus"></i>
						</button>: null,
					props.isButtonRestoreVisible?
						<button 
						id="floating-page-header-button-restore"
						type="button"
						className="floating-page-header-button">
							<i 
							id="floating-page-header-button-restore-icon"
							className="far fa-square"></i>
						</button>: null,
					<button 
					id="floating-page-header-button-close"
					type="button"
					className="floating-page-header-button">
						<i 
						id="floating-page-header-button-close-icon"
						className="fas fa-times"></i>
					</button>]: 
					<button
					id="floating-page-header-button-maximize"
					type="button"
					className="floating-page-header-button floating-page-minimized-button">
						<i 
						id="floating-page-header-button-maximize-icon"
						className={props.maximizeIcon}></i>
					</button>}
			</div>
		</FloatingPointer>
		<div className="floating-page-content-container">
			{!props.minimized?
			[<div 
			id="left-resizer"
			className="floating-page-resizer floating-page-left-resizer"
			ref={leftResizerRef}>
				<i 
				id="left-resizer-arrow"
				className="far fa-arrow-alt-circle-left floating-page-arrow-icon"></i>
			</div>,
			<div 
			id="right-resizer"
			className="floating-page-resizer floating-page-right-resizer"
			ref={rightResizerRef}>
				<i 
				id="right-resizer-arrow"
				className="far fa-arrow-alt-circle-right floating-page-arrow-icon"></i>
			</div>,
			<div
			id="top-resizer"
			className="floating-page-resizer floating-page-top-resizer"
			ref={topResizerRef}>
				<i 
				id="top-resizer-arrow"
				className="far fa-arrow-alt-circle-up floating-page-arrow-icon"></i>
			</div>,
			<div 
			id="bottom-resizer"
			className="floating-page-resizer floating-page-bottom-resizer"
			ref={bottomResizerRef}>
				<i 
				id="bottom-resizer-arrow"
				className="far fa-arrow-alt-circle-down floating-page-arrow-icon"></i>
			</div>]: null}
			{props.children}
		</div>
	</div>)
}
BrowserFloatingView.propTypes = propTypes;
BrowserFloatingView.defaultProps = defaultProps;
export default BrowserFloatingView;