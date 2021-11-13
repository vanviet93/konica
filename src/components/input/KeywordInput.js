import React from 'react';
import PropTypes from 'prop-types';
import "./KeywordInput.css";
const propTypes={
	separator: PropTypes.string,
	width: PropTypes.string
};
const defaultProps={
	separator: ',',
	width: '100%'
};
const KeywordInput = (props) => {
	/*** States and Variables ***/
	const fullTextRef = React.useRef('');
	const [leftKeywords, setLeftKeywords] = React.useState([]);
	const [rightKeywords, setRightKeywords] = React.useState([]);
	const [text, setText] = React.useState('');
	const inputRef = React.useRef(null);
	/*** Processing ***/
	/*** Sub Components ***/
	const renderKeywords = () => {
		return <>
			{leftKeywords.map(keyword=><div className="keyword-input-keyword-container">
				<label className="keyword-input-keyword">{keyword}</label>
				<button className="keyword-input-button-remove-keyword">
					<i className="fas fa-times"/>
				</button>
			</div>)}
			<input
			type="text"
			ref={inputRef}
			style={{width: text.length + 'ch'}}
			className="keyword-input-textbox"
			onChange={onTextChange}
			onKeyDown={onKeyDown}
			value={text}/>
			{rightKeywords.map(keyword=><div className="keyword-input-keyword-container">
				<label className="keyword-input-keyword">{keyword}</label>
				<button className="keyword-input-button-remove-keyword">
					<i className="fas fa-times"/>
				</button>
			</div>)}
		</>;
	}
	/*** Event Handlers ***/
	const onTextChange = (e) => {
		const newText = e.target.value;
		if(newText.endsWith(props.separator)){
			const leftKeyword = newText.replaceAll(props.separator, '');
			if(leftKeyword){
				setLeftKeywords(leftKeywords.concat(leftKeyword));
				setText('');
			}
		}
		else{
			setText(newText);
		}
	}
	const onClick = () => {
		inputRef.current.focus();
	}
	const onKeyDown = (e) => {
		const leftLen = leftKeywords.length;
		const rightLen = rightKeywords.length;
		if(!text){
			if(e.key==="ArrowLeft" && leftLen){
				setRightKeywords([leftKeywords[leftLen-1]].concat(rightKeywords));
				setLeftKeywords(leftKeywords.slice(0, leftLen-1));
			}
			else if(e.key==="ArrowRight" && rightLen){
				setLeftKeywords(leftKeywords.concat(rightKeywords[0]));
				setRightKeywords(rightKeywords.slice(1, rightLen));
			}
			else if(e.key==="Backspace"){
				setLeftKeywords(leftKeywords.slice(0, leftLen-1));
			}
		}
		else{
			const cursorPos = e.target.selectionStart;
			if(e.key==="ArrowLeft" && cursorPos===0 && leftLen){
				setRightKeywords([text].concat(rightKeywords));
				const newText = leftKeywords[leftLen-1];
				setText(newText);
				setLeftKeywords(leftKeywords.slice(0,leftLen-1));
				setTimeout(()=>{
					inputRef.current.setSelectionRange(newText.length, newText.length);
				}, 100);
			}
			else if(e.key==="ArrowRight" && cursorPos===text.length && rightLen){
				setLeftKeywords(leftKeywords.concat([text]));
				const newText = rightKeywords[0];
				setText(newText);
				setRightKeywords(rightKeywords.slice(1, rightLen));
				setTimeout(()=>{
					inputRef.current.setSelectionRange(0,0);
				},100);
			}
		}
	}
	/*** Main Render ***/
	return <div 
	style={{width:props.width}}
	className="keyword-input-container"
	onClick={onClick}>
		{renderKeywords()}
	</div>;
}
KeywordInput.propTypes = propTypes;
KeywordInput.defaultProps = defaultProps;
export default KeywordInput;