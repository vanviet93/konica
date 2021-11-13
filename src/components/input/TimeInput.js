import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './DateTimeInput.css';
const propTypes={
  time: PropTypes.instanceOf(Date),
  width: PropTypes.string,
  format: PropTypes.string,
  isEnabled: PropTypes.bool,
  onClick: PropTypes.func
};
const defaultProps={
  time: undefined,
  width: 'max-content',
  format: 'hh:mm',
  isEnabled: true,
  onClick: () => {}
};
const TimeInput = (props) => {
  /*** States and Variables ***/
  const [time, setTime] = React.useState("");
  /*** Processing ***/
  React.useEffect(()=>{
    if(props.time) setTime(moment(props.time).format(props.format));
  }, [props.time, props.format])
  /*** Sub Components ***/
  /*** Event Handlers ***/
  /*** Main Render ***/
  return <div 
  style={{width: props.width}}
  className="date-time-input-container"
  onClick={(e)=>{if(props.isEnabled) props.onClick()}}>
    <label className={props.isEnabled?"date-time-input-enabled-label":"date-time-input-disabled-label"}>{time}</label>
    <i className={"far fa-clock " + (props.isEnabled?"date-time-input-enabled-icon": "date-time-input-disabled-icon")} />
  </div>;
}
TimeInput.propTypes = propTypes;
TimeInput.defaultProps = defaultProps;
export default TimeInput;