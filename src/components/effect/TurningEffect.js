import React from 'react';
import PropTypes from 'prop-types';
import "./TurningEffect.css";
const propTypes = {};
const defaultProps = {};
const DEG2RAD = Math.PI / 180;
const ID_ARRAY = [0,1,2,3,4,5,6,7,8,9,10,11];
const ANGLES = [Math.PI/2*0/12, 
	Math.PI/2*1/12,
	Math.PI/2*2/12,
	Math.PI/2*3/12,
	Math.PI/2*4/12,
	Math.PI/2*5/12,
	Math.PI/2*6/12,
	Math.PI/2*7/12,
	Math.PI/2*8/12,
	Math.PI/2*9/12,
	Math.PI/2*10/12,
	Math.PI/2*11/12]
const TurningEffect = (props) => {
	/*** States and Variables ***/
	const containerRef = React.useRef(null);
	const [configs, setConfigs] = React.useState(
		ID_ARRAY.map(ID=>{
			return {bound: "none"}
		})
	)
	/*** Processing ***/
	React.useEffect(()=>{
		const container = containerRef.current;
		const width = container.clientWidth;
		const height = container.clientHeight;
		divide(width, height);
	}, []);
	const divide = (width, height) => {
		const bounds = [];
		for(let i=0;i<12;i++){
			if(i!==11){
				let startY = Math.tan(Math.PI /2 * i / 12) * width;
				let endY = Math.tan(Math.PI /2 * (i + 1) / 12) * width;
				if (endY>=height){
					if (startY>=height){
						let startX = height/ endY * width;
						let endX = height / startY * width;
						startY = Math.floor(startY);
						endY = Math.ceil(endY);
						startX = Math.floor(startX);
						endX  = Math.ceil(endX);
						bounds.push({bound: "polygon(0px -1px," + endX + "px " + height + "px," + startX + "px " + height + "px, -1px 0px)"});
					}
					else {
						let startX = height/ endY * width;
						startY = Math.floor(startY);
						endY = Math.ceil(endY);
						startX = Math.floor(startX);
						bounds.push({bound: "polygon(0px -1px," + width + "px " + startY + "px," + width + "px " + height + "px," + startX + "px " + height + "px, -1px 0px)"});
					}
				}
				else{
					startY = Math.floor(startY);
					endY = Math.ceil(endY);
					bounds.push({bound: "polygon(0px -1px," + width + "px " + startY + "px," + width + "px " + endY + "px, -1px 0px)"});
				}
			}
			else {
				let Y = Math.tan(Math.PI /2 * i / 12) * width;
				let endX = height / Y * width;
				endX = Math.ceil(endX);
				bounds.push({bound: "polygon(0px -1px," + endX + "px " + height + "px, 0px " + height + "px, -1px 0px)"})
			}
		}
		setConfigs(bounds)
	}
	const turn = (progress) => {
		
	}
	/*** Sub Components ***/
	const renderParts = () => {
		const parts = [];
		for(let i=0;i<12;i++){
			parts.push(<div 
			style={{clipPath:configs[i].bound}}
			key={"turning-effect-part-" + i}
			className="turning-effect-part">
				{props.children}
			</div>)
		}
		return parts;
	}
	/*** Main Render ***/
	return <div 
	ref={containerRef}
	className="turning-effect-container">
		{renderParts()}
	</div>
}
TurningEffect.propTypes = propTypes;
TurningEffect.defaultProps = defaultProps;
export default TurningEffect;