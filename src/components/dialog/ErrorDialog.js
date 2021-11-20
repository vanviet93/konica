import React from 'react';
import PropTypes from 'prop-types';
import DialogBackground from './DialogBackground';
import "./CommonDialog.css";
import { props } from 'bluebird';

const propTypes = {
	errorContent: PropTypes.string,
	onButtonOKClick: PropTypes.func
};
const defaultProps = {
	errorContent: undefined,
	onButtonOKClick: ()=>{}
};
const ErrorDialog = (props) => {
	/*** Main Render ***/
	return <DialogBackground
	isOpen={!!props.errorContent}
	onClose={props.onButtonOKClick}>
		<div id="target_compo" className="common-dialog-container">
			<div className="common-dialog-header">
				<div className="common-dialog-header-text">
					エラー
				</div>
			</div>
			<div className="common-dialog-body">
				<label className="common-dialog-content-text">
					{props.errorContent}
				</label>
				<button 
				className="common-dialog-button"
				onClick={props.onButtonOKClick}>
					OK
				</button>
			</div>
		</div>
	</DialogBackground>
}
ErrorDialog.propTypes = propTypes;
ErrorDialog.defaultProps = defaultProps;
export default ErrorDialog;