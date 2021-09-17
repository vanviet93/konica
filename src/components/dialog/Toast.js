import React from 'react';
import PropTypes from 'prop-types';
import "./Toast.css";

const MIN_DISPLAY_DURATION = 1000;
const MAX_DISPLAY_DURATION = 5000;
const propTypes = {
  duration: PropTypes.number,
  content: PropTypes.string
}
const defaultProps = {
  duration: 3000,
  content: null
}
const Toast = (props) => {
  /*** States ***/
  const hideToastTask = React.useRef(null);
  const [toastDisplayed, setToastDisplayed] = React.useState(false);
  const [toastVisible, setToastVisible] = React.useState(false);
  /*** Processing ***/
  React.useEffect(()=>{
    if(!props.content) return;
    if(hideToastTask.current){
      clearTimeout(hideToastTask.current);
    }
    setToastDisplayed(true);
    setToastVisible(true);
    let displayDuration = props.duration;
    displayDuration = displayDuration? displayDuration: MIN_DISPLAY_DURATION;
    displayDuration = displayDuration<MIN_DISPLAY_DURATION? MIN_DISPLAY_DURATION: displayDuration;
    displayDuration = displayDuration>MAX_DISPLAY_DURATION? MAX_DISPLAY_DURATION: displayDuration;
    hideToastTask.current = setTimeout(()=>{
      setToastVisible(false);
      setTimeout(()=>{
        setToastDisplayed(false);
      }, 200)
    }, [displayDuration])
  }, [props.content])
  /*** Main Render ***/
  return <div 
  style={{opacity: toastVisible? 1: 0, display: toastDisplayed? "block": "none"}}
  className="toast-container">
    <label className="toast-text">
      {props.content}
    </label>
  </div>
}
Toast.propTypes = propTypes;
Toast.defaultProps = defaultProps;
export default Toast;