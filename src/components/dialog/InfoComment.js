import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './InfoComment.css';

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
	position: null,
	messages: [],
	onClick: (commentId) => {},
	onSelect: (commentId) => {},
	onMessageSend: (commentId, x, y, message) => {},
	onMessageRemove: (commentId, messageId) => {}
}

const InfoComment = (props)=>{
	/*** States and Variables ***/
	const startPosRef = React.useRef(null);
	const currentPosRef = React.useRef(null);
	const iconRef = React.useRef(null);
	const messageContainerRef = React.useRef(null);
	const [position, setPosition] = React.useState(null);
	const [message, setMessage] = React.useState("");
	/*** Processing ***/
	React.useEffect(()=>{
		setPosition(props.position);
		currentPosRef.current = props.position;
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
		const onMouseDown = (e) => {
			startPosRef.current = {
				x: e.clientX,
				y: e.clientY};
		}
		const onMouseMove = (e) => {
			if(!startPosRef.current) return;
			const x = e.clientX;
			const y = e.clientY;
			let targetX = x - startPosRef.current.x + currentPosRef.current.x;
			targetX = targetX<0? 0: targetX;
			let targetY = y - startPosRef.current.y + currentPosRef.current.y;
			targetY = targetY<0? 0: targetY;
			if(iconRef.current){
				const parentNode = iconRef.current.parentNode;
				targetX = targetX>parentNode.clientWidth? parentNode.clientWidth: targetX;
				targetY = targetY>parentNode.clientHeight? parentNode.clientHeight: targetY;
			}
			setPosition({
				x: targetX,
				y: targetY
			})
		}
		const onRightClick = () => {
			startPosRef.current = null;
		}
		const onMouseLeave = (e) => {
			if(!startPosRef.current) return;
			const x = e.clientX;
			const y = e.clientY;
			let targetX = x - startPosRef.current.x + currentPosRef.current.x;
			targetX = targetX<0? 0: targetX;
			let targetY = y - startPosRef.current.y + currentPosRef.current.y;
			targetY = targetY<0? 0: targetY;
			if(iconRef.current){
				const parentNode = iconRef.current.parentNode;
				targetX = targetX>parentNode.clientWidth? parentNode.clientWidth: targetX;
				targetY = targetY>parentNode.clientHeight? parentNode.clientHeight: targetY;
			}
			const dx = Math.abs(x - targetX);
			const dy = Math.abs(y - targetY);
			if(dx > 16 || dy > 16) {
				startPosRef.current = null;
				currentPosRef.current = {
					x: targetX,
					y: targetY
				}
			}
			setPosition({
				x: targetX,
				y: targetY
			})
		}
		iconRef.current.addEventListener('contextmenu', onRightClick);
		iconRef.current.addEventListener('mousedown', onMouseDown);
		iconRef.current.addEventListener('mousemove', onMouseMove);
		iconRef.current.addEventListener('mouseleave', onMouseLeave);
		return () => {
			if(iconRef.current){
				iconRef.current.removeEventListener('contextmenu', onRightClick);
				iconRef.current.removeEventListener('mousedown', onMouseDown);
				iconRef.current.removeEventListener('mousemove', onMouseMove);
				iconRef.current.removeEventListener('mouseleave', onMouseLeave);
			}
		}
	}, [])

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
	const onMouseUp = (e) => {
		if(!startPosRef.current) return;
		const x = e.clientX;
		const y = e.clientY;
		let targetX = x - startPosRef.current.x + currentPosRef.current.x;
		targetX = targetX<0? 0: targetX;
		let targetY = y - startPosRef.current.y + currentPosRef.current.y;
		targetY = targetY<0? 0: targetY;
		if(iconRef.current){
			const parentNode = iconRef.current.parentNode;
			targetX = targetX>parentNode.clientWidth? parentNode.clientWidth: targetX;
			targetY = targetY>parentNode.clientHeight? parentNode.clientHeight: targetY;
		}
		currentPosRef.current = {
			x: targetX,
			y: targetY
		}
		if(Math.abs(x - startPosRef.current.x) < 5 && Math.abs(y - startPosRef.current.y) < 5) {
			props.onClick(props.id);
		}
		setPosition({
			x: currentPosRef.current.x,
			y: currentPosRef.current.y
		})
		startPosRef.current = null;
	}

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
	
	/*** Main Render ***/
	const style = {};
	if(position){
		style.left = position.x;
		style.top = position.y;
		style.opacity = 1;
	}
	else{
		style.left = -16;
		style.top = -16;
		style.opacity = 0;
	}
	if(props.isSelected){
		style.zIndex=1;
	}
	else{
		style.zIndex = undefined;
	}
	return <>
		<div 
		style={style}
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
		<div 
		style={style}
		ref={iconRef}
		className="info-comment-icon-container"
		onMouseUp={onMouseUp}>
			<i className={"fas fa-comment-dots info-comment-anchor-icon " + (props.isSelected? "info-comment-selected-anchor-icon": "")}/>
			<i className={(props.isOpen?"fas fa-minus-circle":"fas fa-plus-circle") + " info-comment-status-icon " + (props.isSelected? "info-comment-selected-status-icon": "")}/>
		</div>
	</>
}

InfoComment.propTypes = propTypes;
InfoComment.defaultProps = defaultProps;
export default InfoComment;