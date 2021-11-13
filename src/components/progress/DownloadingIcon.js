import PropTypes from 'prop-types';
import "./DownloadingIcon.css";

const propTypes = {
  size: PropTypes.number
};
const defaultProps = {
  size: 30
};

const DownloadingIcon = (props) => {
  const fontSize = props.size * 3/4;
  const subFontSize = props.size / 2;
  return <div
  className="downloading-icon-container"
  style={{width: props.size+'px', height: props.size+'px'}}>
    <div className="downloading-icon-subcontainer">
      <i 
      style={{fontSize: fontSize + 'px'}}
      className="fas fa-photo-video downloading-icon-up-main-icon"></i>
      <i 
      style={{fontSize: subFontSize + 'px'}}
      className="fas fa-angle-up downloading-icon-up-icon-cover"></i>
      <i 
      style={{fontSize: subFontSize + 'px'}}
      className="fas fa-angle-up downloading-icon-up-icon"></i>
    </div>
  </div>
}
DownloadingIcon.propTypes = propTypes;
DownloadingIcon.defaultProps = defaultProps;
export default DownloadingIcon;