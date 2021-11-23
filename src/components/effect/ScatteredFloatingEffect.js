import React from 'react';
import PropTypes from 'prop-types';
import "./ScatteredFloatingEffect.css"
import { max } from 'moment';

const propTypes={
	isActive: PropTypes.bool,
	onEnd: PropTypes.func,
	altitude: PropTypes.number,
	renderContent: PropTypes.func
};
const defaultProps={
	isActive: false,
	onEnd: () => {},
	altitude: 150,
	renderContent: ()=>null
};
const ScatteredFloatingEffect = (props) => {
	/*** States and Variables ***/
	const iconIds = React.useRef([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
	/*** Processing ***/
	/*** Sub Components ***/
	/*** Event Handlers ***/
	const renderElements = () => {
		const elements = [];
		let maxDuration = 0;
		for(let key=0; key<15;key++){
			const duration = Math.random() + 0.5;
			maxDuration = duration>maxDuration?duration: maxDuration;
			const effect = Math.random()-0.5;
			elements.push(<div key={key}
			style={{
				width: (Math.random()+0.5)*props.altitude+"px",
				left: (Math.random()-0.5)*props.altitude+"px",
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
			props.onEnd();
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