import React from 'react';
import PropTypes from 'prop-types';
import BrowserFloatingView from './BrowserFloatingView';
import MobileFloatingView from './MobileFloatingView';
import { isMobile } from 'react-device-detect';

const propTypes = {
	isOpen: PropTypes.bool,
	minimized: PropTypes.bool,
	onButtonCloseClick: PropTypes.func,
	onButtonRestoreClick: PropTypes.func,
	onButtonMinimizeClick: PropTypes.func,
	onButtonMaximizeClick: PropTypes.func,
}
const defaultProps = {
	isOpen: false,
	minimized: false,
	onButtonCloseClick: ()=>{},
	onButtonRestoreClick: ()=>{},
	onButtonMinimizeClick: ()=>{},
	onButtonMaximizeClick: ()=>{},
}

const FloatView = (props) => {
	if (isMobile){
		return <MobileFloatingView
		isOpen={props.isOpen}
		minimized={props.minimized}
		isButtonRestoreVisible={true}
		isButtonMinimizeVisible={true}
		onButtonCloseClick={props.onButtonCloseClick}
		onButtonRestoreClick={props.onButtonRestoreClick}
		onButtonMinimizeClick={props.onButtonMinimizeClick}
		onButtonMaximizeClick={props.onButtonMaximizeClick}
		maximizeIcon="far fa-play-circle">
			{props.children}
		</MobileFloatingView>
	}
	return <BrowserFloatingView
	isOpen={props.isOpen}
	minimized={props.minimized}
	isButtonRestoreVisible={true}
	isButtonMinimizeVisible={true}
	onButtonCloseClick={props.onButtonCloseClick}
	onButtonRestoreClick={props.onButtonRestoreClick}
	onButtonMinimizeClick={props.onButtonMinimizeClick}
	onButtonMaximizeClick={props.onButtonMaximizeClick}
	maximizeIcon="far fa-play-circle">
		{props.children}
	</BrowserFloatingView>
}

FloatView.propTypes = propTypes;
FloatView.defaultProps = defaultProps;

export default FloatView;