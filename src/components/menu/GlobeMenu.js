import React from 'react';
import "./GlobeMenu.css";
import PropTypes from 'prop-types';
const propTypes={
  size: PropTypes.number
};
const defaultProps={
  size: 480
};
const GlobeMenu = (props) => {
  /*** States and Variables ***/
  /*** Processing ***/
  /*** Sub Components ***/
  /*** Event Handlers ***/
  /*** Main Render ***/
  return <div 
  className='globe-menu-container'>
    <div 
    style={{width: props.size+"px"}}
    className='globe-menu-subcontainer'>
      <div 
      className='globe-menu-globe-background'></div>
    </div>
  </div>;
}
GlobeMenu.propTypes = propTypes;
GlobeMenu.defaultProps = defaultProps;
export default GlobeMenu;