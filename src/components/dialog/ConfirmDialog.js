import React from 'react';
import PropTypes from 'prop-types';
import DialogBackground from './DialogBackground';
import "./CommonDialog.css";
const propTypes = {
	title: PropTypes.string,
	content: PropTypes.string,
	onButtonCancelClick: PropTypes.func,
	onButtonAcceptClick: PropTypes.func,
};
const defaultProps = {
	title: null,
	contnet: null,
	onButtonCancelClick: () => {},
	onButtonAcceptClick: () => {},
	onClose: () => {},
};
const ConfirmDialog = (props) => {
	/*** States and Variables ***/
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
				<div className="common-dialog-buttons-container">
					<button 
						className="common-dialog-button"
						onClick={props.onButtonCancelClick}>
						いいえ
					</button>
					<button 
					className="common-dialog-button"
					onClick={props.onButtonAcceptClick}>
						はい
					</button>
				</div>
			</div>
		</div>
	</DialogBackground>
}
ConfirmDialog.propTypes = propTypes;
ConfirmDialog.defaultProps = defaultProps;
export default ConfirmDialog;