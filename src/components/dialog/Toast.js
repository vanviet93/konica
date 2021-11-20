import React from 'react';
import PropTypes from 'prop-types';
import "./Toast.css";

const MIN_DISPLAY_DURATION = 1000;
const MAX_DISPLAY_DURATION = 5000;
const propTypes = {
  duration: PropTypes.number,
  content: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
}
const defaultProps = {
  duration: 3000,
  content: null,
  isOpen: false,
  onClose: () => {}
}
const Toast = (props) => {
  /*** States ***/
  const hideTaskRef = React.useRef(null);
  /*** Processing ***/
  React.useEffect(()=>{
    if(props.isOpen) {
      if(hideTaskRef.current){
        clearTimeout(hideTaskRef.current);
        hideTaskRef.current = null;
      }
      hideTaskRef.current = setTimeout(()=>{
        props.onClose();
        hideTaskRef.current = null;
      }, props.duration)
    }
  }, [props.isOpen, props.duration, props.onClose])
  /*** Main Render ***/
  return <div 
  style={{opacity: props.isOpen? 1: 0, display: props.isOpen? "block": "none"}}
  className="toast-container">
    <label className="toast-text">
      {props.content}
    </label>
  </div>
}
Toast.propTypes = propTypes;
Toast.defaultProps = defaultProps;
export default Toast;