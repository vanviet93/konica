import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './DateTimeInput.css';
const propTypes={
  date: PropTypes.instanceOf(Date),
  width: PropTypes.string,
  format: PropTypes.string,
  isEnabled: PropTypes.bool,
  onClick: PropTypes.func
};
const defaultProps={
  date: undefined,
  width: 'max-content',
  format: 'YYYY年MM月DD日',
  isEnabled: true,
  onClick: () => {}
};
const DateInput = (props) => {
  /*** States and Variables ***/
  const [date, setDate] = React.useState("");
  /*** Processing ***/
  React.useEffect(()=>{
    if(props.date) setDate(moment(props.date).format(props.format));
  }, [props.date, props.format])
  /*** Sub Components ***/
  /*** Event Handlers ***/
  /*** Main Render ***/
  return <div 
  style={{width: props.width}}
  className="date-time-input-container"
  onClick={(e)=>{if(props.isEnabled) props.onClick()}}>
    <label className={props.isEnabled?"date-time-input-enabled-label":"date-time-input-disabled-label"}>{date}</label>
    <i className={"far fa-calendar-alt " + (props.isEnabled?"date-time-input-enabled-icon": "date-time-input-disabled-icon")} />
  </div>;
}
DateInput.propTypes = propTypes;
DateInput.defaultProps = defaultProps;
export default DateInput;