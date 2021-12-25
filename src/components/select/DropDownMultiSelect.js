import React from 'react';
import PropTypes from 'prop-types';
import "./DropDownSelect.css";
import "./DropDownMultiSelect.css";
const propTypes={
	maxVisibleItems: PropTypes.number,
	items: PropTypes.arrayOf(PropTypes.string),
	values: PropTypes.arrayOf(PropTypes.string),
	onChange: PropTypes.func,
};
const defaultProps={
	maxVisibleItems: 5,
	items: PropTypes.arrayOf(PropTypes.string),
	values: PropTypes.arrayOf(PropTypes.string),
	onChange: PropTypes.func,
};
const DropDownMultiSelect = (props) => {
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
					onClick={(e)=>{onChange(item)}}
					className={props.values.includes(item)?'drop-down-select-selected-item-container': 'drop-down-select-item-container'}>
						<label className={props.values.includes(item)?'drop-down-selected-item-text': 'drop-down-select-item-text'}>
							{item}
						</label>
					</div>
				})}
			</div>
		</div>
	}

	const renderSelectedValues = () => {
		return <div className='drop-down-multi-select-values-container'>
			<div className='drop-down-multi-select-values-subcontainer'>
				{props.values.map(value=>{
					return <div className='drop-down-multi-select-item-container'>
						<label className='drop-down-multi-select-item-text'>
							{value}
						</label>
						<button 
						onClick={(e)=>{onChange(value)}}
						data-buttonclose="true"
						className='drop-down-multi-select-item-button-close'>
							<i className='fas fa-times' />
						</button>
					</div>
				})}
			</div>
		</div>
	}
	/*** Event Handlers ***/
	const onChange = (item) => {
		if(props.values.includes(item)){
			props.onChange(props.values.filter(value=>value!==item));
		}
		else {
			props.onChange(props.values.concat(item));
		}
	}

	const onMenuClick = (e) => {
		let target = e.target;
		while(target && target.dataset && !target.dataset.buttonclose){
			target = target.parentNode;
		}
		if(!(target && target.dataset && target.dataset.buttonclose)){
			setIsOpen(!isOpen);
		}
	}
	/*** Main Render ***/
	return <div 
	tabIndex={100}
	onClick={onMenuClick}
	onBlur={(e)=>{setIsOpen(false)}}
	className={isOpen?'drop-down-select-open-container':'drop-down-select-container'}>
		{renderSelectedValues()}
		<button className='drop-down-select-button-drop'>
			<i className="fas fa-chevron-down"></i>
		</button>
		{renderItems()}
	</div>;
}
DropDownMultiSelect.propTypes = propTypes;
DropDownMultiSelect.defaultProps = defaultProps;
export default DropDownMultiSelect;