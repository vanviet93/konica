import React from 'react';
import PropTypes from 'prop-types';
import "./PageMenu.css";
const propTypes = {
	isOpen: PropTypes.bool,
	onToggle: PropTypes.func,
	menuItems: PropTypes.array,
	onMenuItemClick: PropTypes.func
};
const defaultProps = {
	isOpen: false,
	onToggle: () => {},
	menuItems: [],
	onMenuItemClick: (itemId) => {}
};
const PageMenu = (props) => {
	/*** Variables and States ***/
	const [openState, setOpenState] = React.useState({});
	/*** Processing ***/
	React.useEffect(()=>{
		const opens = {};
		const initOpenState = (items) => {
			for(const item of items){
				if(item.children){
					opens[item.id] = false;
				}
			}
		}
		initOpenState(props.menuItems);
		setOpenState(opens);
	}, [props.menuItems])
	/*** Sub Components ***/
	const renderItems = (items, level=0) => {
		return items.map(item=><>
			<div 
			className="page-menu-item-container"
			style={{paddingLeft: props.isOpen?level*15: 0}}
			onClick={(e)=>{onMenuItemClick(item)}}>
				<i 
				style={{color: item.color}}
				className={item.icon + " page-menu-item-icon"}></i>
				<label className="page-menu-item-text">{item.text}</label>
			</div>
			{item.children?
			<div 
			style={{height: openState[item.id]? item.children.length*49 + "px": "0px"}}
			className="page-menu-items-container">
				{renderItems(item.children, level+1)}
			</div>:null}
		</>)
	}
	/*** Event Handlers ***/
	const onMenuItemClick = (item) => {
		if(item.children){
			openState[item.id] = !openState[item.id];
			setOpenState(Object.assign([], openState));
		}
		else {
			props.onMenuItemClick(item);
		}
	}
	/*** Main Render ***/
	return <div 
	id="menu"
	className="page-menu-container"
	style={{width: props.isOpen? undefined:"48px"}}>
		<div 
		className="page-menu-item-header-container"
		onClick={props.onToggle}>
			<i className="fas fa-bars page-menu-item-icon"></i>
		</div>
		{renderItems(props.menuItems)}
	</div>
}
PageMenu.propTypes = propTypes;
PageMenu.defaultProps = defaultProps;
export default PageMenu;