import React from 'react';
import PropTypes from 'prop-types';
import "./PageContentContainer.css";

const propTypes = {
	isShrunk: PropTypes.bool
}
const defaultProps = {
	isShrunk: false
}

const PageContentContainer = (props) => {
	/*** Main Render ***/
	return <div 
	className={props.isShrunk?"page-content-shrunk-container":"page-content-full-container"}>

	</div>
}

PageContentContainer.propTypes = propTypes;
PageContentContainer.defaultProps = defaultProps;

export default PageContentContainer;