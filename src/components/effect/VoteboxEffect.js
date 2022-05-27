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

const STATE_VOTEBOX_MOVING = 0;
const STATE_VOTEBOX_STOPPED = 1;
const STATE_TICKET_ENTERING = 2;
const STATE_TICKET_STAY_STILL_DOWN = 3;
const STATE_TICKET_STAY_STILL_UP = 4;
const STATE_TICKET_MOVING_DOWN = 5;
const STATE_TICKET_MOVING_UP = 6;

const VoteboxEffect = (props) => {
	/*** States and Variables ***/
	const [boxState, setBoxState] = React.useState(STATE_VOTEBOX_MOVING);
	const [ticketStates, setTicketStates] = React.useState([]);
	const prevTicketPositionRef = React.useRef(-1);
	/*** Processing ***/
	React.useEffect(() => {
    const newStates = ticketStates.map((ticketState, count) => {
      // move next
      if (props.currentTicketPosition > prevTicketPositionRef.current) {
        if (count === props.currentTicketPosition - 1) {
          return STATE_TICKET_MOVING_DOWN
        } else if (count < props.currentTicketPosition) {
          return STATE_TICKET_STAY_STILL_DOWN
        } else {
          return STATE_TICKET_STAY_STILL_UP
        }
      }
      // move back
      else {
        if (count === props.currentTicketPosition) {
          return STATE_TICKET_MOVING_UP
        } else if (count < props.currentTicketPosition) {
          return STATE_TICKET_STAY_STILL_DOWN
        } else {
          return STATE_TICKET_STAY_STILL_UP
        }
      }
    });
    setTicketStates(newStates)
    return () => {
      prevTicketPositionRef.current = props.currentTicketPosition
    }
  }, [props.currentTicketPosition])
	/*** Sub Components ***/
	const renderTickets = () => {
		if (!props.tickets || boxState===STATE_VOTEBOX_MOVING) return null;
		const resultViews = [];
		for(let i=props.tickets.length-1; i>=0; i--){
			const ticketState = ticketStates[i];
			if (i > props.currentTicketPosition + 1 || i < props.currentTicketPosition - 1) continue;
			const dz = props.currentTicketPosition-i;
			resultViews.push(
				<div 
				key={i} 
				// disable mouse event on inactive tickets
				style={{pointerEvents: i !== props.currentTicketPosition ? "none" : undefined,
				transform: `translateZ(${dz}px)`}}
				className={(ticketState===STATE_TICKET_ENTERING && 'votebox-effect-entering-ticket-container') || 
				(ticketState===STATE_TICKET_STAY_STILL_UP && 'votebox-effect-stay-still-up-ticket-container') || 
				(ticketState===STATE_TICKET_STAY_STILL_DOWN && 'votebox-effect-stay-still-down-ticket-container') || 
				(ticketState===STATE_TICKET_MOVING_UP && 'votebox-effect-moving-up-ticket-container') ||
				(ticketState===STATE_TICKET_MOVING_DOWN && 'votebox-effect-moving-down-ticket-container')}>
					{props.renderTicket(props.tickets[i])}
				</div>);
		}
		return resultViews;
	}
	/*** Event Handlers ***/
	const onAnimationEnd = (e)=>{
		if(e.target===e.currentTarget){
			setBoxState(STATE_VOTEBOX_STOPPED);
			setTicketStates(props.tickets.map(ticket=>STATE_TICKET_ENTERING));
		}
		else if(e.target===e.currentTarget.children[0] && ticketStates[0]===STATE_TICKET_ENTERING){
			setTicketStates(props.tickets.map(ticket=>STATE_TICKET_STAY_STILL_UP))
		}
	}
	/*** Main Render ***/
	return <div className='votebox-effect-container'>
		<div 
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