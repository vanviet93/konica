import React from 'react';
import PropTypes from 'prop-types';
import "./ScatteredFloatingEffect.css"


const propTypes={
	isActive: PropTypes.bool,
	onEnd: PropTypes.func,
	width: PropTypes.number,
	minAltitude: PropTypes.number,
	maxAltitude: PropTypes.number,
	renderContent: PropTypes.func,
	elementNumber: PropTypes.number
};
const defaultProps={
	isActive: false,
	onEnd: () => {},
	width: 150,
	minAltitude: 30, 
	maxAltitude: 80,
	renderContent: ()=>null,
	elementNumber: 15,
};
const ScatteredFloatingEffect = (props) => {
	/*** States and Variables ***/
	/*** Processing ***/
	/*** Sub Components ***/
	/*** Event Handlers ***/
	const renderElements = () => {
		const elements = [];
		let maxDuration = 0;
		for(let key=0; key<props.elementNumber;key++){
			const duration = Math.random() + 0.5;
			maxDuration = duration>maxDuration?duration: maxDuration;
			const effect = Math.random()-0.5;
			const left = (Math.random()-0.5)*props.width;
			elements.push(<div key={key}
			style={{
				width: ((props.maxAltitude - props.minAltitude)+props.minAltitude)+"px",
				left: left+"px",
				animationDuration: duration + "s"
			}}
			className="scattered-floating-effect-element-container">
				<div 
				style={{
					animationDuration: duration + "s"
				}}
				className={effect<0?"scattered-floating-opposite-effect-element": "scattered-floating-effect-element"}>
					{props.renderContent()}
				</div>
			</div>);
		}
		setTimeout(()=>{
			//props.onEnd();
		}, maxDuration*1000)
		return elements;
	}
	/*** Main Render ***/
	if(!props.isActive)return null;
	return <div className="scattered-floating-effect-container">
			{renderElements()}
	</div>
	;
}
ScatteredFloatingEffect.propTypes = propTypes;
ScatteredFloatingEffect.defaultProps = defaultProps;
export default ScatteredFloatingEffect;