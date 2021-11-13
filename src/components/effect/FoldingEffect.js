import React from 'react';
import PropTypes from 'prop-types';
import "./FoldingEffect.css";

const propTypes = {
	progress: PropTypes.number
}
const defaultProps = {
	progress: 30
}
const DEG2RAD = Math.PI / 180;
/*** this won't render singleton properly ***/
const FoldingEffect = (props) => {
	/*** States and Variables ***/
	const containerRef = React.useRef(null);
	const [pageConfig, setPageConfig] = React.useState({
		boundBack: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
		boundFront: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
		angleBack: "rotateX(0deg) rotateZ(0deg)"
	})
	/*** Processing ***/
	React.useEffect(()=>{
		const container = containerRef.current;
		fold(props.progress, container.clientWidth, container.clientHeight)
	}, [props.progress])
	const fold = (progress, width, height) => {
		progress = progress<0? 0: progress;
		progress = progress>100? 100: progress;
		const angle = progress * 0.9; // *90 / 100
		const paperAngle = Math.atan(width/height) / DEG2RAD;
		console.log("ANGLE", angle, paperAngle);
		if(angle>paperAngle){
			const splitY = width * Math.tan((90 - angle) * DEG2RAD);
			console.log("ANGLE", splitY);
			const splitYPercentage = splitY / height * 100;
			const boundBack = "polygon(0% 0%, 100% " + splitYPercentage + "%, 100% 100%, 0% 100%)";
			const boundFront = "polygon(0% 0%, 100% 0%, 100% " + splitYPercentage + "%)";
			const angleBack = "rotateX(180deg) rotateZ(-" + (180 - 2*angle) + "deg)"
			setPageConfig({
				boundBack,
				boundFront,
				angleBack
			})
		}
		else {
			const splitX = height * Math.tan(angle * DEG2RAD);
			const splitXPercentage = splitX / width * 100;
			const boundBack = "polygon(0% 0%, " + splitXPercentage + "% 100%, 0% 100%)";
			const boundFront = "polygon(0% 0%, 100% 0%, 100% 100%, " + splitXPercentage + "% 100%)";
			const angleBack = "rotateX(180deg) rotateZ(-" + (180 - 2*angle) + "deg)"
			setPageConfig({
				boundBack,
				boundFront,
				angleBack
			})
		}
	}
	/*** Main Render ***/
	return <div 
	className="folding-effect-container"
	ref={containerRef}>
		<div 
		key="fontside"
		style={{clipPath: pageConfig.boundFront}}
		className="folding-effect-frontside">
			{props.children}
		</div>
		<div 
		key="backside"
		style={{clipPath: pageConfig.boundBack, transform: pageConfig.angleBack}}
		className="folding-effect-backside">
			{props.children}
		</div>
	</div>
}
FoldingEffect.propTypes = propTypes;
FoldingEffect.defaultProps = defaultProps;
export default FoldingEffect;