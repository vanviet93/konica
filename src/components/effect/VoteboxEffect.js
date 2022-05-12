import React from 'react';
import PropTypes from 'prop-types';
import "./VoteboxEffect.css";

const propTypes={
	currentTicketPosition: PropTypes.number,
	tickets: PropTypes.arrayOf(PropTypes.any),
	renderTicket: PropTypes.func,
};
const defaultProps={
	currentTicketPosition: 0,
	tickets: [],
	renderTicket: (ticket) => null,
};

const STEP_MOVE_VOTEBOX = 0;
const STEP_DROP_TICKET = 1;
const STEP_FIRST_TOUCH_TICKET = 2;
const STEP_TOUCH_TICKET = 3;
const VoteboxEffect = (props) => {
	/*** States and Variables ***/
	const [step, setStep] = React.useState(STEP_MOVE_VOTEBOX);
	const containerRef = React.useRef(null);
	/*** Processing ***/
	React.useEffect(()=>{
		if(step===STEP_DROP_TICKET){
			setStep(STEP_FIRST_TOUCH_TICKET)
		}
		return ()=>{
			if(props.currentTicketPosition===props.tickets.length-1){
				setStep(STEP_TOUCH_TICKET);
			}
		}
	}, [props.currentTicketPosition])
	/*** Sub Components ***/
	const renderTickets = () => {
		if (!props.tickets || step===STEP_MOVE_VOTEBOX) return null;
		const resultViews = [];
		for(let i=props.tickets.length-1; i>=0; i--){
			if(i>=props.currentTicketPosition){
				resultViews.push(
					<div 
					key={i} 
					className={(step===STEP_DROP_TICKET && 'votebox-effect-init-ticket-container') || 
					((step===STEP_FIRST_TOUCH_TICKET||i===props.tickets.length-1) && 'votebox-effect-init-outside-ticket-container') || 
					(step===STEP_TOUCH_TICKET && 'votebox-effect-outside-ticket-container')}>
						{props.renderTicket(props.tickets[i])}
					</div>);
			}
			else {
				resultViews.push(
					<div 
					key={i} 
					className={(step===STEP_DROP_TICKET && 'votebox-effect-init-ticket-container') || 
					((step===STEP_FIRST_TOUCH_TICKET || step===STEP_TOUCH_TICKET) && 'votebox-effect-inside-ticket-container')}>
						{props.renderTicket(props.tickets[i])}
					</div>);
			}
		}
		return resultViews;
	}
	console.log("VANVIET CUR", step, props.currentTicketPosition);
	/*** Event Handlers ***/
	const onAnimationEnd = (e)=>{
		if(e.target===e.currentTarget){
			setStep(STEP_DROP_TICKET);
		}
	}
	/*** Main Render ***/
	return <div className='votebox-effect-container'>
		<div 
		ref={containerRef}
		onAnimationEnd={onAnimationEnd}
		className='votebox-effect-subcontainer'>
			{renderTickets()}
			<div className='votebox-effect-box-top'>
				<div className='votebox-effect-box-hole' />
			</div>
			<div className='votebox-effect-box-front'>
				<label>投票箱</label>
			</div>
		</div>
	</div>;
}
VoteboxEffect.propTypes = propTypes;
VoteboxEffect.defaultProps = defaultProps;
export default VoteboxEffect;