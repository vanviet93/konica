import React from 'react';
import PropTypes from 'prop-types';
import "./ProductPage.css";
import VoteboxEffect from '../../components/effect/VoteboxEffect';
const propTypes={};
const defaultProps={};
const ProductPage = (props) => {
	/*** States and Variables ***/
	/*** Processing ***/
	/*** Sub Components ***/
	const [tickets, setTickets] = React.useState([0,1,2,3,4,5]);
	const [currentTicketPosition, setCurrentTicketPosition] = React.useState(0);
	const renderTicket = (ticket) => {
		return <div className='product-page-ticket-container'>
			<label>{ticket}</label>
			<div className='product-page-ticket-footer'>
				<button
				onClick={onButtonPrevClick}>
					Prev
				</button>
				<button
				onClick={onButtonNextClick}>
					Next
				</button>
			</div>
		</div>
	}
	const onButtonPrevClick = () => {
		console.log("VANVIET NEXT", currentTicketPosition-1);
		setCurrentTicketPosition(Math.max(currentTicketPosition-1, 0));
	}
	const onButtonNextClick = () => {
		console.log("VANVIET NEXT", currentTicketPosition+1, tickets.length-1);
		setCurrentTicketPosition(Math.min(currentTicketPosition+1, tickets.length-1));
	}
	const renderVotebox = () => {
		return <>
			<label className='component-page-label'>VOTEBOX EFFECT</label>
			<div className='product-page-votebox-effect-container'>
				<VoteboxEffect 
				tickets={tickets}
				currentTicketPosition={currentTicketPosition}
				renderTicket={renderTicket}/>
			</div>
		</>
	}
	/*** Event Handlers ***/
	/*** Main Render ***/
	return <div className='product-page-container'>
		<div className='product-page-subcontainer'>
			{renderVotebox()}
		</div>
	</div>;
}
ProductPage.propTypes = propTypes;
ProductPage.defaultProps = defaultProps;
export default ProductPage;