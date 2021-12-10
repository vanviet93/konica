import React from 'react';
import PropTypes from 'prop-types';
import FloatingPointer from '../dialog/FloatingPointer';
import { isIOS } from 'react-device-detect';
import "./FloatingView.css";

const NOTHING = 0;
const UP_ARROW = 1;
const DOWN_ARROW = 2;
const LEFT_ARROW = 3;
const RIGHT_ARROW = 4;
const HEADER = 6; // header which is being displayed

const DISPLAY_DURATION = 1000;

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
	const containerRef = React.useRef(null);
	const positionRef = React.useRef({x: 0, y: 0})
	const [position, setPosition] = React.useState(positionRef.current);
	const sizeRef = React.useRef({width: 200, height: 200});
	const [size, setSize] = React.useState(sizeRef.current);
	const hideTaskRef = React.useRef(null);
	const displayingComponentRef = React.useRef(NOTHING);
	const [displayingComponent, setDisplayingComponent] = React.useState(displayingComponentRef.current);
	/*** Processing ***/
	React.useEffect(()=>{
		// add event listeners when orientation changes
		if(props.isOpen){
			if (isIOS) window.addEventListener('orientationchange', fixPosition);
			window.addEventListener('visibilitychange',fixPosition);
			window.addEventListener('blur', fixPosition);
			if (!isIOS) window.addEventListener('resize', fixPosition);
			displayingComponentRef.current = HEADER;
				setDisplayingComponent(displayingComponentRef.current);
			hideTaskRef.current = setTimeout(()=>{
				displayingComponentRef.current = NOTHING;
				setDisplayingComponent(displayingComponentRef.current);
				hideTaskRef.current = null;
			}, DISPLAY_DURATION)
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
			const containerPos = container.getBoundingClientRect();
			let changed = false;
			if(containerPos.x + positionRef.current.x<0){
				positionRef.current.x = -containerPos.x;
				changed = true;
			}
			if(positionRef.current.x + containerPos.x + sizeRef.current.width + positionRef.current.x>document.documentElement.clientWidth){
				positionRef.current.x = document.documentElement.clientWidth - sizeRef.current.width - positionRef.current.x - containerPos.x;
				changed = true;
			}
			if(positionRef.current.y + containerPos.y<0){
				positionRef.current.y = -containerPos.y;
				changed = true;
			}
			if(positionRef.current.y + sizeRef.current.height + 40 + containerPos.y>document.documentElement.clientHeight){
				positionRef.current.y = document.documentElement.clientHeight - sizeRef.current.height - 40 - containerPos.y;
				changed = true;
			}
			
			if(changed){
				positionRef.current = Object.assign({}, positionRef.current);
				setPosition(positionRef.current);
			}
		},100);
	}, [])
	/*** Event Handlers ***/
	const onHeaderMove = React.useCallback((e)=>{
		if(hideTaskRef.current){
			clearTimeout(hideTaskRef.current);
			hideTaskRef.current = null;
		}
		if(displayingComponentRef.current!==HEADER){
			displayingComponentRef.current = HEADER;
			setDisplayingComponent(HEADER);
		}
	}, [])
	
	const onHeaderMoving = React.useCallback((e)=>{
		setPosition({
			x: positionRef.current.x + e.x,
			y: positionRef.current.y + e.y
		});
	}, [])

	const onHeaderMoved = React.useCallback((e)=>{
		positionRef.current = {
			x: positionRef.current.x + e.x,
			y: positionRef.current.y + e.y
		}
		setPosition(positionRef.current);
		if(displayingComponentRef.current===HEADER){
			hideTaskRef.current = setTimeout(()=>{
				displayingComponentRef.current = NOTHING;
				setDisplayingComponent(displayingComponentRef.current);
				hideTaskRef.current = null;
			}, DISPLAY_DURATION)
		}
	}, [])

	const onLeftResizerMove = React.useCallback((e)=>{
		if(hideTaskRef.current){
			clearTimeout(hideTaskRef.current);
			hideTaskRef.current = null;
		}
		if(displayingComponentRef.current!==LEFT_ARROW){
			displayingComponentRef.current = LEFT_ARROW;
			setDisplayingComponent(LEFT_ARROW);
		}
	}, [])

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
		if(displayingComponentRef.current===LEFT_ARROW){
			hideTaskRef.current = setTimeout(()=>{
				displayingComponentRef.current = NOTHING;
				setDisplayingComponent(displayingComponentRef.current);
				hideTaskRef.current = null;
			}, DISPLAY_DURATION)
		}
	}, [])

	const onRightResizerMove = React.useCallback((e)=>{
		if(hideTaskRef.current){
			clearTimeout(hideTaskRef.current);
			hideTaskRef.current = null;
		}
		if(displayingComponentRef.current!==RIGHT_ARROW){
			displayingComponentRef.current = RIGHT_ARROW;
			setDisplayingComponent(RIGHT_ARROW);
		}
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
		if(displayingComponentRef.current===RIGHT_ARROW){
			hideTaskRef.current = setTimeout(()=>{
				displayingComponentRef.current = NOTHING;
				setDisplayingComponent(displayingComponentRef.current);
				hideTaskRef.current = null;
			}, DISPLAY_DURATION)
		}
	}, [])

	const onTopResizerMove = React.useCallback((e)=>{
		if(hideTaskRef.current){
			clearTimeout(hideTaskRef.current);
			hideTaskRef.current = null;
		}
		if(displayingComponentRef.current!==UP_ARROW){
			displayingComponentRef.current = UP_ARROW;
			setDisplayingComponent(UP_ARROW);
		}
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
	}, []);

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
		if(displayingComponentRef.current===UP_ARROW){
			hideTaskRef.current = setTimeout(()=>{
				displayingComponentRef.current = NOTHING;
				setDisplayingComponent(displayingComponentRef.current);
				hideTaskRef.current = null;
			}, DISPLAY_DURATION)
		}
	}, [])

	const onBottomResizerMove = React.useCallback((e)=>{
		if(hideTaskRef.current){
			clearTimeout(hideTaskRef.current);
			hideTaskRef.current = null;
		}
		if(displayingComponentRef.current!==DOWN_ARROW){
			displayingComponentRef.current = DOWN_ARROW;
			setDisplayingComponent(DOWN_ARROW);
		}
	}, [])

	const onBottomResizerMoving = React.useCallback((e)=>{
		setSize({
			width: sizeRef.current.width,
			height: sizeRef.current.height + e.y
		});
	}, [])

	const onBottomResizerMoved = React.useCallback((e) => {
		sizeRef.current = {
			width: sizeRef.current.width,
			height: sizeRef.current.height + e.y
		};
		setSize(sizeRef.current);
		if(displayingComponentRef.current===DOWN_ARROW){
			hideTaskRef.current = setTimeout(()=>{
				displayingComponentRef.current = NOTHING;
				setDisplayingComponent(displayingComponentRef.current);
				hideTaskRef.current = null;
			}, DISPLAY_DURATION)
		}
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
					onMove={onHeaderMove}
					onMoving={onHeaderMoving}
					onMoved={onHeaderMoved}>
					<div 
					style={{
						width: props.minimized? undefined: size.width,
						opacity: displayingComponent===HEADER || props.minimized? 1:0}}
					className={!props.minimized?"floating-page-browser-header":"floating-page-minimized-header"}>
						{!props.minimized?
							[props.isButtonMinimizeVisible?
								<button 
								type="button"
								className="floating-page-header-button"
								onClick={(e)=>{if(displayingComponent===HEADER){props.onButtonMinimizeClick(e)}}}>
									<i className="fas fa-minus"></i>
								</button>: null,
							props.isButtonRestoreVisible?
								<button 
								type="button"
								className="floating-page-header-button"
								onClick={(e)=>{if(displayingComponent===HEADER){props.onButtonRestoreClick(e)}}}>
									<i 
									className="far fa-square"></i>
								</button>: null,
							<button 
							type="button"
							className="floating-page-header-button"
							onClick={(e)=>{if(displayingComponent===HEADER){props.onButtonCloseClick(e)}}}>
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
					onMove={onLeftResizerMove}
					onMoving={onLeftResizerMoving}
					onMoved={onLeftResizerMoved}>
					<div 
					style={{
						display:props.minimized? "none": "flex", 
						height: size.height,
						opacity: displayingComponent===LEFT_ARROW? 1:0}}
					className="floating-page-resizer floating-page-left-resizer">
						<i className="far fa-arrow-alt-circle-left floating-page-arrow-icon"></i>
					</div>
				</FloatingPointer>
			</div>

			<div 
			style={{
				left: size.width-30
			}}
			className="floating-page-resizer-anchor">
				<FloatingPointer 
					onMove={onRightResizerMove}
					onMoving={onRightResizerMoving}
					onMoved={onRightResizerMoved}>
					<div 
					style={{
						display:props.minimized? "none": "flex", 
						height: size.height,
						opacity: displayingComponent===RIGHT_ARROW? 1:0}}
					className="floating-page-resizer floating-page-right-resizer">
						<i className="far fa-arrow-alt-circle-right floating-page-arrow-icon"></i>
					</div>
				</FloatingPointer>
			</div>

			<div 
			className="floating-page-resizer-anchor">
				<FloatingPointer 
					onMove={onTopResizerMove}
					onMoving={onTopResizerMoving}
					onMoved={onTopResizerMoved}>
					<div
					style={{
						display:props.minimized? "none": "flex", 
						width: size.width,
						opacity: displayingComponent===UP_ARROW? 1:0}}
					className="floating-page-resizer floating-page-top-resizer">
						<i className="far fa-arrow-alt-circle-up floating-page-arrow-icon"/>
					</div>
				</FloatingPointer>
			</div>

			<div 
			style={{top: size.height - 30}}
			className="floating-page-resizer-anchor">
				<FloatingPointer 
					onMove={onBottomResizerMove}
					onMoving={onBottomResizerMoving}
					onMoved={onBottomResizerMoved}>
					<div 
					style={{display:props.minimized? "none": "flex", 
					width: size.width,
					opacity: displayingComponent===DOWN_ARROW? 1:0}}
					className="floating-page-resizer floating-page-bottom-resizer">
						<i className="far fa-arrow-alt-circle-down floating-page-arrow-icon"/>
					</div>
				</FloatingPointer>
			</div>
		{props.children}
		</div>
	</div>)
}
MobileFloatingView.propTypes = propTypes;
MobileFloatingView.defaultProps = defaultProps;
export default MobileFloatingView;