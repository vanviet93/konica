import React from 'react';
import PropTypes from 'prop-types';
import RoundPageOpenEffect from '../../components/effect/RoundPageOpenEffect';
import "./EffectPage.css";

const propTypes={};
const defaultProps={};
const MenuPage = (props) => {
	/*** States and Variables ***/
	/*** Processing ***/
	/*** Sub Components ***/
	const [roundPageEffectPages, setRoundPageEffectPages] = React.useState([0,1,2,3,4]);
	const [currentRoundPageEffectPage, setCurrentRoundPageEffectPage] = React.useState(0);
	const renderRoundPageEffectPage = (page) => {
		return <div className='effect-page-effect-content-container'>
			<label>{page}</label>
			<div className='effect-page-effect-buttons-container'>
				{roundPageEffectPages.map((value, index)=>{
					return <button 
					className={value===currentRoundPageEffectPage?'effect-page-effect-selected-button': 'effect-page-effect-button'}
					onClick={(e)=>{setCurrentRoundPageEffectPage(value)}}>
						{value}
					</button>
				})}
			</div>
		</div>
	}

	const renderRoundPageOpenEffect = () => {
		return <>
			<label className='effect-page-label'>ROUND PAGE OPEN EFFECT</label>
			<div className='effect-page-effect-container'>
				<RoundPageOpenEffect 
				pages={roundPageEffectPages}
				currentPage={currentRoundPageEffectPage}
				renderPage={renderRoundPageEffectPage}/>
			</div>
		</>
	}
	/*** Event Handlers ***/
	/*** Main Render ***/
	return <div className='effect-page-container'>
		<div className='effect-page-subcontainer'>
			{renderRoundPageOpenEffect()}
		</div>
	</div>;
}
MenuPage.propTypes = propTypes;
MenuPage.defaultProps = defaultProps;
export default MenuPage;