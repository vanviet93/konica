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
	const leftResizerRef = React.useRef(null);
	const rightResizerRef = React.useRef(null);
	const topResizerRef = React.useRef(null);
	const bottomResizerRef = React.useRef(null);
	const taskHideArrowRef = React.useRef({arrow: undefined, task: undefined})
	const draggedObjRef = React.useRef(NOTHING);
	const deleteMouseClickTask = React.useRef(null);
	const positionRef = React.useRef({x: 0, y: 0})
	const [position, setPosition] = React.useState(positionRef.current);
	const sizeRef = React.useRef({width: 200, height: 200});
	const [size, setSize] = React.useState(sizeRef.current);

	/*** Processing ***/
	React.useEffect(()=>{
		// register event listeners for resizers
		let resizers = [];
		if(!props.minimized){
			resizers = [topResizerRef.current, bottomResizerRef.current, leftResizerRef.current, rightResizerRef.current];
			for(const resizer of resizers){
				// resizer.addEventListener('mousedown', onMouseDownOnResizer);
				// resizer.addEventListener('mousemove', onMouseMoveOnResizer);
				// resizer.addEventListener('mouseup', onMouseUpOnResizer);
				// resizer.addEventListener('mouseenter', onMouseEnterOnResizer);
				// resizer.addEventListener('mouseleave', onMouseLeaveOnResizer);
			}
		}
		return () => {
			if(!props.minimized){
				for(const resizer of resizers){
					// resizer.removeEventListener('mousedown', onMouseDownOnResizer);
					// resizer.removeEventListener('mousemove', onMouseMoveOnResizer);
					// resizer.removeEventListener('mouseup', onMouseUpOnResizer);
					// resizer.removeEventListener('mouseenter', onMouseEnterOnResizer);
					// resizer.addEventListener('mouseleave', onMouseLeaveOnResizer);
				}
			}
		}
	}, [props.minimized])
	/*** Event Handlers ***/
	const onLeftResizerMoving = React.useCallback((e) => {
		setPosition({
			x: positionRef.current.x + e.x,
			y: positionRef.current.y 
		});
		setSize({
			width: sizeRef.current.width - e.x,
			height: sizeRef.current.height
		});
	}, [])

	const onLeftResizerMoved = React.useCallback((e) => {
		positionRef.current = {
			x: positionRef.current.x + e.x,
			y: positionRef.current.y
		};
		setPosition(positionRef.current);
		sizeRef.current = {
			width: sizeRef.current.width - e.x,
			height: sizeRef.current.height
		};
		setSize(sizeRef.current);
	}, [])

	const onRightResizerMoving = React.useCallback((e)=>{
		setSize({
			width: sizeRef.current.width + e.x,
			height: sizeRef.current.height
		});
	}, [])

	const onRightResizerMoved = React.useCallback((e) => {
		sizeRef.current = {
			width: sizeRef.current.width + e.x,
			height: sizeRef.current.height
		};
		setSize(sizeRef.current);
	}, [])
	
	const onTopResizerMoving = React.useCallback((e)=>{
		setPosition({
			x: positionRef.current.x,
			y: positionRef.current.y + e.y
		});
		setSize({
			width: sizeRef.current.width,
			height: sizeRef.current.height - e.y
		});
	}, [])

	const onTopResizerMoved = React.useCallback((e) => {
		positionRef.current = {
			x: positionRef.current.x,
			y: positionRef.current.y + e.y
		};
		setPosition(positionRef.current);
		sizeRef.current = {
			width: sizeRef.current.width,
			height: sizeRef.current.height - e.y
		};
		setSize(sizeRef.current);
	}, [])

	const onBottomResizerMoving = React.useCallback((e)=>{
		setSize({
			width: sizeRef.current.width,
			height: sizeRef.current.height + e.y
		})
	}, [])

	const onBottomResizerMoved = React.useCallback((e) => {
		sizeRef.current = {
			width: sizeRef.current.width,
			height: sizeRef.current.height + e.y
		};
		setSize(sizeRef.current);
	}, [])
	

	
	/*** Main Render */
	return (<div 
		style={{
			zIndex: props.isOpen? undefined: -1,
			opacity: props.isOpen? 1: 0}}
		className="floating-page-anchor"
		ref={containerRef}>
		<div 
		style={{
			top: position.y + 40, 
			left: position.x,
			width: props.minimized? 0: size.width,
			height: props.minimized? 0: size.height
		}}
		className="floating-page-content-container">
			<div 
			className="floating-page-header-anchor">
					<FloatingPointer
					onMoving={(e)=>{setPosition(e);}}
					onMoved={(e)=>{positionRef.current=e; setPosition(positionRef.current);}}>
					<div 
					style={{width: props.minimized? undefined: size.width}}
					className={!props.minimized?"floating-page-browser-header":"floating-page-minimized-header"}>
						{!props.minimized?
							[props.isButtonMinimizeVisible?
								<button 
								type="button"
								className="floating-page-header-button"
								onClick={props.onButtonMinimizeClick}>
									<i className="fas fa-minus"></i>
								</button>: null,
							props.isButtonRestoreVisible?
								<button 
								type="button"
								className="floating-page-header-button"
								onClick={props.onButtonRestoreClick}>
									<i 
									className="far fa-square"></i>
								</button>: null,
							<button 
							type="button"
							className="floating-page-header-button"
							onClick={props.onButtonCloseClick}>
								<i 
								className="fas fa-times"></i>
							</button>]: 
							<button
							type="button"
							className="floating-page-header-button floating-page-minimized-button"
							onClick={props.onButtonMaximizeClick}>
								<i className={props.maximizeIcon}></i>
							</button>}
					</div>
				</FloatingPointer>
			</div>
			<div className="floating-page-resize-anchor">
				<FloatingPointer 
					onMoving={onLeftResizerMoving}
					onMoved={onLeftResizerMoved}>
					<div 
					id="left-resizer"
					style={{display:props.minimized? "none": "flex", height: size.height}}
					className="floating-page-resizer floating-page-left-resizer"
					ref={leftResizerRef}>
						<i 
						id="left-resizer-arrow"
						className="far fa-arrow-alt-circle-left floating-page-arrow-icon"></i>
					</div>
				</FloatingPointer>
			</div>

			<div 
			style={{
				left: size.width-30
			}}
			className="floating-page-resizer-anchor">
				<FloatingPointer 
					onMoving={onRightResizerMoving}
					onMoved={onRightResizerMoved}>
					<div 
					id="right-resizer"
					style={{display:props.minimized? "none": "flex", height: size.height}}
					className="floating-page-resizer floating-page-right-resizer"
					ref={rightResizerRef}>
						<i 
						id="right-resizer-arrow"
						className="far fa-arrow-alt-circle-right floating-page-arrow-icon"></i>
					</div>
				</FloatingPointer>
			</div>

			<div 
			className="floating-page-resizer-anchor">
				<FloatingPointer 
					onMoving={onTopResizerMoving}
					onMoved={onTopResizerMoved}>
					<div
					id="top-resizer"
					style={{display:props.minimized? "none": "flex", width: size.width}}
					className="floating-page-resizer floating-page-top-resizer"
					ref={topResizerRef}>
						<i className="far fa-arrow-alt-circle-up floating-page-arrow-icon"/>
					</div>
				</FloatingPointer>
			</div>

			<div 
			style={{top: size.height - 30}}
			className="floating-page-resizer-anchor">
				<FloatingPointer 
					onMoving={onBottomResizerMoving}
					onMoved={onBottomResizerMoved}>
					<div 
					style={{display:props.minimized? "none": "flex", width: size.width}}
					className="floating-page-resizer floating-page-bottom-resizer"
					ref={bottomResizerRef}>
						<i className="far fa-arrow-alt-circle-down floating-page-arrow-icon"/>
					</div>
				</FloatingPointer>
			</div>
		{props.children}
		</div>
	</div>)
}
BrowserFloatingView.propTypes = propTypes;
BrowserFloatingView.defaultProps = defaultProps;
export default BrowserFloatingView;