import React from 'react';
import PropTypes from 'prop-types';
import "./DialogBackground.css";
import { Dialog } from '@material-ui/core';

const propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
}
const defaultProps = {
	isOpen: false,
	onClose: () => {}
}
const DialogBackground = (props) => {
	/*** Variables ***/
	// TODO: fix: stop using Dialog, and settimeout
	/*** Processing ***/
	/*** Main Render ***/
	return <Dialog
			open={props.isOpen}
			onClose={props.onClose}>
				<div style={container}>
					{props.children}
				</div>
		</Dialog>;
}

const container = {
	backgroundColor: "#FFF",
	borderRadius: "4px",
	display:"flex",
	flexDirection:"column",
	padding:"8px"
}
DialogBackground.propTypes = propTypes;
DialogBackground.defaultProps = defaultProps;
export default DialogBackground;