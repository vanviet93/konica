import React from 'react';
import "./RotationPage.css";
import PropTypes from 'prop-types';
const propTypes={
	pages: PropTypes.array,
	currentPage: PropTypes.any,
	renderPage: PropTypes.func
};
const defaultProps={
	pages: [],
	currentPage: undefined,
	renderPage: (page) => null
};
const dRate = 1/Math.sqrt(3)/2;
const RotationPage = (props) => {
	/*** States and Variables ***/
	const containerRef = React.useRef(null);
	const widthRef = React.useRef(0);
	const [width, setWidth] = React.useState(widthRef.current);
	const configRef = React.useRef({
		angle: 0,
		page: props.pages.indexOf(props.currentPage)
	})
	const [config, setConfig] = React.useState(0);
	/*** Processing ***/
	React.useEffect(()=>{
		const container = containerRef.current;
		const onContainerResized = () => {
			const containerSize = container.getBoundingClientRect();
			if(containerSize.width!==widthRef.current){
				widthRef.current = containerSize.width;
				setWidth(widthRef.current);
			}
		}
		const observer = new ResizeObserver((entries)=>{
			onContainerResized();
		});
		observer.observe(container);
		onContainerResized();
		return () => {
			observer.disconnect();
		}
	}, [])
	React.useEffect(()=>{
		const currentConfig = configRef.current;
		const currentPagePos = props.pages.indexOf(props.currentPage);
		if(currentPagePos===(currentConfig.page+1)%props.pages.length){
			currentConfig.angle = (currentConfig.angle - 120);
		}
		
		else if(currentPagePos===(currentConfig.page-1 + props.pages.length)%props.pages.length){
			currentConfig.angle = (currentConfig.angle + 120);
		}
		currentConfig.page = currentPagePos;
		configRef.current = Object.assign({}, currentConfig);
		setConfig(configRef.current);
		console.log("VANVIET ", currentConfig)
	}, [props.currentPage, props.pages])
	/*** Sub Components ***/
	const renderPages = () => {
		const ids = ["front", "right", "left"];
		const currentPagePos = props.pages.indexOf(config.page);
		return ids.map((id, count)=>{
			const refactoredAngle = (config.angle + 360 + count * 120) % 360;
			const page = refactoredAngle===0?props.pages[currentPagePos]:
			(refactoredAngle===120)?props.pages[(currentPagePos+1)%props.pages.length]:
			props.pages[(currentPagePos+props.pages.length-1)%props.pages.length];
			return <div 
			key={id}
			style={{
				transform: `translateZ(${-width*dRate}px) rotateY(${(config.angle + count * 120)}deg) translateZ(${width*dRate}px)`
			}}
			className='rotation-page-content-container'>
				{props.renderPage(page)}
			</div>
		});
	}
	/*** Event Handlers ***/
	/*** Main Render ***/
	return <div className='rotation-page-container'
	ref={containerRef}>
		{renderPages()}
	</div>;
}
RotationPage.propTypes = propTypes;
RotationPage.defaultProps = defaultProps;
export default RotationPage;