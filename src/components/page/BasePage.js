import React from 'react';
import PropTypes from 'prop-types';
import ErrorDialog from '../dialog/ErrorDialog';
import InfoDialog from '../dialog/InfoDialog';
import ConfirmDialog from '../dialog/ConfirmDialog';
import "./BasePage.css";
import Toast from '../dialog/Toast';

const propTypes = {
	isOpen: PropTypes.bool
}
const defaultProps = {
	isOpen: false
}

const BasePage = React.forwardRef((props, ref) => {
	/*** States and Variables  ***/
	const [errorContent, setErrorContent] = React.useState(null);
	const [infoContent, setInfoContent] = React.useState({
		title: null,
		content: null,
		button: null
	})
	const [confirmContent, setConfirmContent] = React.useState({
		title: null,
		content: null
	})
	const [toastContent, setToastContent] = React.useState({
		content: null,
		duration: 3000
	})
	/*** Processing ***/
	React.useImperativeHandle(ref, ()=>({
		error: (errorMessage) => {
			setErrorContent(errorMessage);
		},
		info: (title, content, button) => {
			setInfoContent({
				title,
				content,
				button
			})
		},
		confirm: (title, content) => {
			setConfirmContent({
				title,
				content
			})
		},
		toast: (message, duration=3000)=>{
			setToastContent({
				content: message,
				duration
			})
		}
	}))
	
	/*** Main Render ***/
	if(!props.isOpen) return null;
	return <>
		<div className="base-page-container">
			{props.children}
		</div>
		<ErrorDialog 
			errorContent={errorContent}
			onButtonOKClick={(e)=>{setErrorContent(null)}}/>
		<InfoDialog 
			{...infoContent}
			onClose={(e)=>{setInfoContent({})}} />
		<ConfirmDialog 
			{...confirmContent}
			onButtonAcceptClick={(e)=>{setConfirmContent({})}}
			onButtonCancelClick={(e)=>{setConfirmContent({})}} />
		<Toast
			{...toastContent} />
	</>;
})

BasePage.propTypes = propTypes;
BasePage.defaultProps = defaultProps;
export default BasePage;