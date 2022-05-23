import React from 'react';
import PropTypes from 'prop-types';
import "./UnboxGiftEffect.css";

const propTypes={};
const defaultProps={};

const COLOR_ORANGE = '#ea5415';
const COLOR_DARK_BLUE = '#155191';
const COLOR_YELLOW = '#fcdf02';
const COLOR_GREEN = '#1d7a21';
const COLORS = [COLOR_ORANGE, COLOR_DARK_BLUE, COLOR_YELLOW, COLOR_GREEN];
const UnboxGiftEffect = (props) => {
	/*** States and Variables ***/
	/*** Processing ***/
	/*** Sub Components ***/
	const renderPaper = () => {
		const elementViews = [];
		for(let i=0; i<4;i++){
			const targety = Math.cos(Math.PI/9)*96*i;
			const color=i%2===0?'#fcdf02': '#fdec67';
			const rotx = i%2===0?'-20deg': '20deg';
			elementViews.push(
				<div 
				style={{'--targety': `${targety}px`, '--rotx': rotx, '--color': color}}
				className='unbox-gift-box-paper'>
					{i===1? <label>100</label>: null}
					{i===2? <label>万円</label>: null}
					{i===3? <label>当選</label>: null}
				</div>
			);
		}
		return <div className='unbox-gift-box-paper-container'>
			{elementViews}
		</div>
	}
	const renderPaperPieces = () => {
		const resultViews = [];
		for(let i=0; i<30; i++){
			const targetx = Math.random() * 100;
			const targety = Math.random()* 100;
			const color = COLORS[Math.floor(Math.random() * COLORS.length)];
			const rotz = Math.random()*90 + 'deg';
			const classId = Math.random() * 3;
			const classname = (classId<1 && 'unbox-gift-effect-paper-square-piece') || (classId<2 && 'unbox-gift-effect-paper-round-piece') || 'unbox-gift-effect-paper-triangle-piece';
			resultViews.push(<div 
				style={{'--targetx': `${targetx}%`, '--targety': `${targety}%`, '--color': color, '--rotz': rotz }}
				className={classname}/>)
		}
		return resultViews;
	}
	/*** Event Handlers ***/
	/*** Main Render ***/
	return <div className='unbox-gift-effect-contaienr'>
		{renderPaper()}
		<div className='unbox-gift-box-effect-leftside' />
		<div className='unbox-gift-box-effect-rightside' />
		{renderPaperPieces()}
	</div>;
}
UnboxGiftEffect.propTypes = propTypes;
UnboxGiftEffect.defaultProps = defaultProps;
export default UnboxGiftEffect;