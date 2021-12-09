import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './InfoComment.css';
import { DistanceStrictButton, FloatingPointer } from '..';

const propTypes = {
	id: PropTypes.string,
	isOpen: PropTypes.bool,
	isSelected: PropTypes.bool,
	selectedMessageId: PropTypes.string,
	position: PropTypes.object,
	messages: PropTypes.arrayOf(PropTypes.object),
	onClick: PropTypes.func,
	onSelect: PropTypes.func,
	onMessageSend: PropTypes.func,
	onMessageRemove: PropTypes.func,
}
const defaultProps = {
	id: undefined,
	isOpen: false,
	isSelected: false,
	selectedMessageId: undefined,
	position: {x:0, y:0},
	messages: [],
	onClick: (commentId, x, y) => {},
	onSelect: (commentId, x, y) => {},
	onMessageSend: (commentId, x, y, message) => {},
	onMessageRemove: (commentId, messageId) => {}
}

const InfoComment = (props)=>{
	/*** States and Variables ***/
	const messageContainerRef = React.useRef(null);
	const [position, setPosition] = React.useState({x:0, y:0});
	const [message, setMessage] = React.useState("");
	/*** Processing ***/
	React.useEffect(()=>{
		setPosition(props.position);
	}, [props.position])

	React.useEffect(()=>{
		const messageContainer = messageContainerRef.current;
		if(messageContainer){
			const messageViews = messageContainer.childNodes;
			let hasSelectedMessage = false;
			let scrollLen = 0;
			if(props.selectedMessageId){
				for(let i=0; i<props.messages.length; i++){
					const message = props.messages[i];
					if(message.id===props.selectedMessageId){
						hasSelectedMessage = true;
						break;
					}
					else{
						scrollLen += messageViews[i].offsetHeight;
					}
				}
				if(hasSelectedMessage){
					messageContainer.scrollTo(0, scrollLen);
				}
			}
		}
	}, [props.selectedMessageId])

	React.useEffect(()=>{
		if(messageContainerRef.current){
			const messageContainer = messageContainerRef.current;
			messageContainer.scrollTo(0, messageContainer.scrollHeight - messageContainer.clientHeight);
		}
	}, [props.messages])
	/*** Sub Components ***/
	const renderMessages = () => {
		// message format {
		// writer : 
		// content : 
		// datetime : }
		return props.messages.map(message=><div 
		key={message.id}
		className="info-comment-message-container">
			<div className="info-comment-message-header">
				<label className="info-comment-message-writer">{message.writer}</label>
				<label className="info-comment-message-datetime">{moment(message.datetime).format("yyyy年MM月DD HH:mm")}</label>
			</div>
			<div className="info-comment-message-content-container">
				<label className="info-comment-message-content">{message.content}</label>
				<button 
				className="info-comment-message-remove-button"
				onClick={(e)=>{props.onMessageRemove(props.id, message.id)}}>
					<i className="fas fa-trash-alt"></i>
				</button>
			</div>
		</div>)
	}
	/*** Event Handlers ***/
	const onMessageSend = () => {
		if(message && message.trim()!==""){
			props.onMessageSend(props.id, position.x, position.y, message);
			setMessage("");	
		}
	}

	const onKeyDown = (e) => {
		if(e.key==="Enter" && e.ctrlKey){
			onMessageSend();
		}
	}
	
	const onMoved = (e) => {
		const parentNode = messageContainerRef.current && messageContainerRef.current.parentNode && messageContainerRef.current.parentNode.parentNode;
		if(parentNode){
			const targetX = e.x<0?0:(e.x>parentNode.clientWidth?parentNode.clientWidth:e.x);
			const targetY = e.y<0?0:(e.y>parentNode.clientHeight?parentNode.clientHeight:e.y);
			setPosition({x: targetX, y: targetY});
		}
	}
	/*** Main Render ***/
	return <>
		<div 
		style={{zIndex: props.isSelected? 1: undefined, left: position.x, top: position.y}}
		onClick={(e)=>props.onSelect(props.id)}
		className={props.isOpen?"info-comment-container-open": "info-comment-container-hidden"}>
			<div 
			ref={messageContainerRef}
			className="info-comment-comments-container">
				{renderMessages()}
			</div>
			<div className="info-comment-action-container">
				<textarea 
				className="info-comment-comment-box"
				value={message}
				onChange={(e)=>{setMessage(e.target.value)}}
				onKeyDown={onKeyDown}/>
				<button
				className="info-comment-button-send"
				type="button"
				onClick={onMessageSend}>
					<i className="fas fa-paper-plane"></i>
				</button>
			</div>
		</div>
		<FloatingPointer
		position={position}
		onMoving={(e)=>{setPosition(e);}}
		onMoved={onMoved}>
			<DistanceStrictButton 
			style={{zIndex: props.isSelected? 1: undefined}}
			className="info-comment-icon-container"
			onClick={props.onClick}>
				<i className={"fas fa-comment-dots info-comment-anchor-icon " + (props.isSelected? "info-comment-selected-anchor-icon": "")}/>
				<i className={(props.isOpen?"fas fa-minus-circle":"fas fa-plus-circle") + " info-comment-status-icon " + (props.isSelected? "info-comment-selected-status-icon": "")}/>
			</DistanceStrictButton>
		</FloatingPointer>
		
	</>
}

InfoComment.propTypes = propTypes;
InfoComment.defaultProps = defaultProps;
export default InfoComment;