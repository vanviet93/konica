import React from 'react';
import PropTypes from 'prop-types';
import FileProcessBar from './FileProcessBar';
import "./FileDownUploadPanel.css";

const propTypes = {
	processes: PropTypes.arrayOf(PropTypes.object),
	onResume: PropTypes.func,
	onPause: PropTypes.func,
	onStop: PropTypes.func,
	onClose: PropTypes.func,
	pauseEnabled: PropTypes.bool,
	stopEnabled: PropTypes.bool,
};
const defaultProps = {
	processes: [
		{
			fileName: 'https://www.youtube.com/watch?v=uODq_PnYIA0',
			progress: 50
		},
		{
			fileName: 'https://www.youtube.com/watch?v=uODq_PnYIA1',
			progress: 30
		},
		{
			fileName: 'https://www.youtube.com/watch?v=uODq_PnYIA2',
			progress: 40
		},
	],
	onResume:  (file) => {},
	onPause:  (file) => {},
	onStop: (file) => {},
	onClose: () => {},
	pauseEnabled: false,
	stopEnabled: false
};

const FileDownUploadPanel = (props) => {
	/*** Main Render */
	return <div className="file-down-upload-panel-container">
		<div  className="file-down-upload-panel-header">
			<button 
			type="button"
			className="file-down-upload-panel-header-button"
			onClick={props.onClose}>
				<i className="fas fa-times"></i>
			</button>
		</div>
		<div className="file-down-upload-panel-file-container">
			<div className="file-down-upload-panel-file-subcontainer">
				{props.processes.map(file=>{
				return <>
					<FileProcessBar
					key={file.fileName}
					fileName={file.fileName}
					progress={file.progress}
					pauseEnabled={props.pauseEnabled}
					stopEnabled={props.stopEnabled}
					onResume={()=>{props.onResume(file)}}
					onPause={()=>{props.onPause(file)}}
					onStop={()=>{props.onStop(file)}} />
					<div className="file-down-upload-panel-separator"/>
				</>
				})}
			</div>
		</div>
	</div>
}
FileDownUploadPanel.propTypes = propTypes;
FileDownUploadPanel.defaultProps = defaultProps;
export default FileDownUploadPanel;