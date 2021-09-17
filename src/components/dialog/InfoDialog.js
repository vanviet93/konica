import React from 'react';
import PropTypes from 'prop-types';
import DialogBackground from './DialogBackground2';
import "./CommonDialog.css";
const propTypes = {
	title: PropTypes.string,
	content: PropTypes.string,
	button: PropTypes.string,
	onClose: PropTypes.func
}
const defaultProps = {
	title: null,
	content: null,
	button: null,
	onClose: () => {}
}
const InfoDialog = (props) => {
  /*** Main Render ***/
	return <DialogBackground
	isOpen={!!props.content}
	onClose={props.onClose}>
		<div id="target_compo" className="common-dialog-container">
			<div className="common-dialog-header">
				<div className="common-dialog-header-text">
					{props.title}
				</div>
			</div>
			<div className="common-dialog-body">
				<label className="common-dialog-content-text">
					{props.content}
				</label>
				<button 
				className="common-dialog-button"
				onClick={props.onClose}>
					{props.button}
				</button>
			</div>
		</div>
	</DialogBackground>
}
InfoDialog.propTypes = propTypes;
InfoDialog.defaultProps = defaultProps;
export default InfoDialog;