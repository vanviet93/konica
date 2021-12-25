import React from 'react';
import PropTypes from 'prop-types';
import "./DropDownSelect.css";
const propTypes={
	maxVisibleItems: PropTypes.number,
	items: PropTypes.arrayOf(PropTypes.string),
	onChange: PropTypes.func,
	value: PropTypes.string
};
const defaultProps={
	maxVisibleItems: 5,
	items: [],
	onChange: (item) => {},
	value: undefined
};
const DropDownSelect = (props) => {
	/*** States and Variables ***/
	const [isOpen, setIsOpen] = React.useState(false);
	/*** Processing ***/
	/*** Sub Components ***/
	const renderItems = () => {
		if (!isOpen) return null;
		return <div 
		style={{
			maxHeight: props.maxVisibleItems * 36
		}}
		className='drop-down-select-items-container'>
			<div className='drop-down-select-items-subcontainer'>
				{props.items.map(item=>{
					return <div 
					key={item}
					onClick={(e)=>{props.onChange(item)}}
					className={item===props.value?'drop-down-select-selected-item-container': 'drop-down-select-item-container'}>
						<label className={item===props.value?'drop-down-selected-item-text': 'drop-down-select-item-text'}>
							{item}
						</label>
					</div>
				})}
			</div>
		</div>
	}
	/*** Event Handlers ***/
	/*** Main Render ***/
	return <div 
	tabIndex={100}
	onClick={(e)=>{setIsOpen(!isOpen)}}
	onBlur={(e)=>{setIsOpen(false)}}
	className={isOpen?'drop-down-select-open-container':'drop-down-select-container'}>
		<div className='drop-down-select-value'>
			<label className={'drop-down-select-item-text'}>
				{props.value}
			</label>
		</div>
		<button className='drop-down-select-button-drop'>
			<i className="fas fa-chevron-down"></i>
		</button>
		{renderItems()}
	</div>;
}
DropDownSelect.propTypes = propTypes;
DropDownSelect.defaultProps = defaultProps;
export default DropDownSelect;