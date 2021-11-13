import React from 'react';
import PropTypes from 'prop-types';
import "./Checkbox.css";

const propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string,
  labelClickable: PropTypes.bool,
  onCheck: PropTypes.func,
};
const defaultProps = {
  checked: false,
  label: '',
  labelClickable: true,
  onCheck: () => {},
};
const Checkbox = (props) => {
  /*** Main Render ***/
  return <div className="checkbox-container">
    <div 
    onClick={props.onCheck}
    className={"align-row-full-center " + (props.checked?"checkbox-checked-icon-container":"checkbox-icon-container")}>
      {props.checked?<i className="fas fa-check"/>: null}
    </div>
    <label 
    className="checkbox-label"
    style={{cursor: props.labelClickable?"pointer":"default"}}
    onClick={props.labelClickable?props.onCheck: null}>
      {props.label}
    </label>
  </div>
}
Checkbox.propTypes = propTypes;
Checkbox.defaultProps = defaultProps;
export default Checkbox;