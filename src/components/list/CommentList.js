import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './CommentList.css';

const propTypes = {
	isOpen: PropTypes.bool,
	comments: PropTypes.arrayOf(PropTypes.object), 
	onMessageClick: PropTypes.func,
	onMessageRemove: PropTypes.func
}
const defaultProps = {
	isOpen: true,
	comments:[],
	onMessageClick: (commentId, messageId)=>{},
	onMessageRemove: (commentId, messageId)=>{}
}
const CommentList = (props) => {
	/*** Variables and States ***/
	const [messages, setMessages] = React.useState([]);
	/*** Processing ***/
	React.useEffect(()=>{
		let allMessages = [];
		for(const comment of props.comments) {
			if(!comment.messages) continue;
			for(const message of comment.messages){
				message.commentId = comment.id;
			}
			allMessages = allMessages.concat(comment.messages);
		}
		allMessages.sort((m1, m2)=>m1.datetime<m2.datetime?1:-1)
		setMessages(allMessages);
	}, [props.comments])
	/*** Sub Components ***/
	const renderMessages = () => {
		return messages.map(message=><div 
			key={message.writer + message.datetime}
			onClick={(e)=>{props.onMessageClick(message.commentId, message.id)}}
			className="comment-list-message-container">
				<div className="comment-list-message-header">
					<label className="comment-list-message-writer">{message.writer}</label>
					<label className="comment-list-message-datetime">{moment(message.datetime).format("yyyy年MM月DD HH:mm")}</label>
				</div>
				<div className="comment-list-message-content-container">
					<label className="comment-list-message-content">{message.content}</label>
					<button 
					className="comment-list-message-remove-button"
					onClick={(e)=>{props.onMessageRemove(message.commentId, message.id)}}>
						<i className="fas fa-trash-alt"></i>
					</button>
				</div>
			</div>)
	}
	/*** Event Handlers ***/

	/*** Main Render ***/
	return <div 
	style={{width: props.isOpen? 320: 0}}
	className="comment-list-container">
		{renderMessages()}
	</div>
}
CommentList.propTypes = propTypes;
CommentList.defaultProps = defaultProps;
export default CommentList;