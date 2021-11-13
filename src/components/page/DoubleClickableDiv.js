import React from "react";
import PropTypes from "prop-types";
const propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  onDoubleClick: PropTypes.func
};
const defaultProps = {
  style: {},
  className: "",
  onDoubleClick: ()=>{}
};
const DoubleClickableDiv = (props) => {
  /*** States and Variables ***/
  const disableTaskRef = React.useRef(null);
  /*** Event Hanglers ***/
  const  onClick = (e) => {
    if(disableTaskRef.current){
      props.onDoubleClick();
      clearTimeout(disableTaskRef.current);
      disableTaskRef.current = null;
    }
    else{
      disableTaskRef.current = setTimeout(()=>{
        disableTaskRef.current = null;
      }, 400)
    }
  }
  /*** Main Render ***/
  return <div 
  style={props.style}
  className={props.className}
  onClick ={onClick}>
    {props.children}
  </div>
}
DoubleClickableDiv.propTypes = propTypes;
DoubleClickableDiv.defaultProps = defaultProps;
export default DoubleClickableDiv;