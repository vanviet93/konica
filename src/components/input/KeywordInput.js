import React from 'react';
import PropTypes from 'prop-types';
import "./KeywordInput.css";
const propTypes={
	separator: PropTypes.string,
	width: PropTypes.string	,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	onPressKeyEnter: PropTypes.func
};
const defaultProps={
	separator: ',',
	width: '100%',
	onFocus: ()=>{},
	onBlur: ()=>{},
	onPressKeyEnter: (keywords) => {}
};
const KeywordInput = React.forwardRef((props, ref) => {
	/*** States and Variables ***/
	const [leftKeywords, setLeftKeywords] = React.useState([]);
	const [rightKeywords, setRightKeywords] = React.useState([]);
	const [text, setText] = React.useState('');
	const inputRef = React.useRef(null);
	const [inputWidth, setInputWidth] = React.useState("1ch");
	const containerRef = React.useRef(null);	
	const compositioningRef = React.useRef(false);
	/*** Processing ***/
	React.useImperativeHandle(ref, () => ({
    getKeywords: () => {
			if(!text) return leftKeywords.concat(rightKeywords);
			return [...leftKeywords, text, ...rightKeywords];
    }
  }));

	const configInputSize = () => {
		const inputNode = inputRef.current;
		if(inputNode.clientWidth<inputNode.scrollWidth){
			setInputWidth((inputNode.scrollWidth + 8) + "px");
		}
	}
	/*** Sub Components ***/
	const renderKeywords = () => {
		return <>
			{leftKeywords.map((keyword, i)=><div 
			key={i + "," + keyword}
			className="keyword-input-keyword-container">
				<label 
				onClick={(e)=>{onClickKeyword(true, i)}}
				className="keyword-input-keyword">{keyword}</label>
				<button 
				onClick={(e)=>{onDeleteKeyword(true, i)}}
				className="keyword-input-button-remove-keyword">
					<i className="fas fa-times"/>
				</button>
			</div>)}
			<input
			type="text"
			ref={inputRef}
			style={{width: inputWidth}}
			className="keyword-input-textbox"
			onChange={onTextChange}
			onKeyDown={onKeyDown}
			onCompositionStart={onCompositionStart}
			onCompositionEnd={onCompositionEnd}
			onFocus={props.onFocus}
			onBlur={props.onBlur}
			value={text}/>
			{rightKeywords.map((keyword, i)=><div 
			key={i + "," + keyword}
			className="keyword-input-keyword-container">
				<label 
				onClick={(e)=>{onClickKeyword(false, i)}}
				className="keyword-input-keyword">{keyword}</label>
				<button 
				onClick={(e)=>{onDeleteKeyword(false, i)}}
				className="keyword-input-button-remove-keyword">
					<i className="fas fa-times"/>
				</button>
			</div>)}
		</>;
	}
	/*** Event Handlers ***/
	const onTextChange = (e) => {
		if(compositioningRef.current){
			setText(e.target.value);
			configInputSize();
		}
		else{
			const newText = e.target.value;
			if(newText.endsWith(props.separator)){
				const leftKeyword = newText.replaceAll(props.separator, '');
				if(leftKeyword){
					setLeftKeywords(leftKeywords.concat(leftKeyword));
					setText('');
					setInputWidth('1ch');
				}
			}
			else{
				setText(newText);
				configInputSize();
			}
		}
	}
	const onClick = () => {
		inputRef.current.focus();
	}
	const onKeyDown = (e) => {
		if(compositioningRef.current) return;
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
			else if(e.key==="Enter"){
				props.onPressKeyEnter(leftKeywords.concat(rightKeywords));
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
				}, 50);
			}
			else if(e.key==="ArrowRight" && cursorPos===text.length && rightLen){
				setLeftKeywords(leftKeywords.concat([text]));
				const newText = rightKeywords[0];
				setText(newText);
				setRightKeywords(rightKeywords.slice(1, rightLen));
				setTimeout(()=>{
					inputRef.current.setSelectionRange(0,0);
				},50);
			}
			else if(e.key==="Enter"){
				const newLeftKeywords = leftKeywords.concat([text]);
				setLeftKeywords(newLeftKeywords);
				setText('');				
			}
		}
		// solve the problem when input tag is hidden
		setTimeout(()=>{
			const inputBounds = inputRef.current.getBoundingClientRect();
			const container = containerRef.current;
			const containerBounds = container.getBoundingClientRect();
			const dLeft = containerBounds.left - inputBounds.left;
			if(dLeft>0){
				container.scroll(-dLeft, 0);
			}
		}, 50);		
	}
	const onClickKeyword = (left, index) => {		
		const leftLen = leftKeywords.length;
		const rightLen = rightKeywords.length;
		if(left){
			setText(leftKeywords[index]);
			setLeftKeywords(leftKeywords.slice(0, index));
			if(rightLen){
				if(text){
					setRightKeywords([...leftKeywords.slice(index+1, leftLen), text, ...rightKeywords]);
				}
				else{
					setRightKeywords([...leftKeywords.slice(index+1, leftLen), ...rightKeywords]);
				}				
			}
			else{
				if(text){
					setRightKeywords([...leftKeywords.slice(index+1, leftLen), text]);
				}
				else{
					setRightKeywords(leftKeywords.slice(index+1, leftLen));
				}				
			}
		}
		else{
			setText(rightKeywords[index]);
			setRightKeywords(rightKeywords.slice(index+1,rightLen));
			if(leftLen){
				if(text){
					setLeftKeywords([...leftKeywords, text, ...rightKeywords.slice(0, index)]);
				}
				else{
					setLeftKeywords([...leftKeywords, ...rightKeywords.slice(0, index)]);
				}
			}
			else{
				if(text){
					setLeftKeywords([text, ...rightKeywords.slice(0, index)]);
				}
				else{
					setLeftKeywords(rightKeywords.slice(0, index));
				}
			}
		}
	}
	const onDeleteKeyword = (left, index) => {
		if(left){
			leftKeywords.splice(index,1);
			setLeftKeywords(Object.assign([], leftKeywords));
		}
		else{
			rightKeywords.splice(index,1);
			setRightKeywords(Object.assign([], rightKeywords));
		}
	}
	const onCompositionStart = () => {
		compositioningRef.current = true;
	}
	const onCompositionEnd = () => {
		compositioningRef.current = false;
	}
	/*** Main Render ***/
	return <div 
	style={{width:props.width}}
	ref={containerRef}
	className="keyword-input-container"
	onClick={onClick}>
		<div className="keyword-input-subcontainer">
			{renderKeywords()}
		</div>		
	</div>;
})
KeywordInput.propTypes = propTypes;
KeywordInput.defaultProps = defaultProps;
export default KeywordInput;