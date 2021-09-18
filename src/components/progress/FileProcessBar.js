import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from './ProgressBar';
import "./FileProcessBar.css";

const propTypes = {
	progress: PropTypes.number,
	fileName: PropTypes.string,
	onResume: PropTypes.func,
	onPause: PropTypes.func,
	onStop: PropTypes.func,
};
const defaultProps = {
	progress: 10,
	fileName: 'https://www.youtube.com/',
	onResume:  () => {},
	onPause:  () => {},
	onStop: () => {},
};

const FileProcessBar = (props) => {
	/*** States and Variables ***/
	const [processing, setProcessing] = React.useState(true);
	/*** Event Handler ***/
	const onButtonResumePauseClick = (e) => {
		if(processing){
			setProcessing(false);
			props.onPause();
		}
		else{
			setProcessing(true);
			props.onResume();
		}
	}
	/*** Main Render ***/
	console.log("FILE NAME", props.fileName, props.progress);
	return <div className="file-process-bar-container">
		<div className="file-process-bar-action-container">
			<div className="file-process-bar-progress-bar-container">
				<ProgressBar progress={props.progress}/>
			</div>
			<div className="file-process-bar-button-container"
				onClick={onButtonResumePauseClick}>
				<i className={processing?"far fa-pause-circle":"far fa-play-circle"}/>
			</div>
			<div className="file-process-bar-button-container">
				<i className="far fa-times-circle"></i>
			</div>
		</div>
		<label className="file-process-bar-filename">
			{props.fileName}
		</label>
	</div>
}

FileProcessBar.propTypes = propTypes;
FileProcessBar.defaultProps = defaultProps;
export default FileProcessBar;