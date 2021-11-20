import React from 'react';
import PropTypes from 'prop-types';
import KeywordInput from './KeywordInput';
import './KeywordSearchbox.css';

const propTypes = {
	onSearch: PropTypes.func
};
const defaultProps = {
	onSearch: (keywords) => {}
};

const KeywordSearchbox = (props)=>{
	/*** States and Variables ***/
	const inputRef = React.useRef(null);
	const [active, setActive] = React.useState(false);
	/*** Event Handlers ***/
	/*** Main Render ***/
	return <div 
	className={active?"keyword-searchbox-active-container":"keyword-searchbox-container"}>
		<KeywordInput 
		ref={inputRef}
		width="calc(100% - 36px)"
		onFocus={(e)=>{setActive(true)}}
		onBlur={(e)=>{setActive(false)}}
		onPressKeyEnter={(e)=>{props.onSearch(e)}}/>
		<button 
		onClick={(e)=>{props.onSearch(inputRef.current.getKeywords())}}
		className="keyword-searchbox-button-search">
			<i className="fas fa-search"/>
		</button>
	</div>
}
KeywordSearchbox.propTypes = propTypes;
KeywordSearchbox.defaultProps = defaultProps;
export default KeywordSearchbox;