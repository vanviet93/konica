import React from 'react';
import PropTypes from 'prop-types';
import "./MagicNavigationMenu.css";
import { renderIntoDocument } from 'react-dom/cjs/react-dom-test-utils.production.min';
const propTypes={
	items: PropTypes.arrayOf(PropTypes.object),
	values: PropTypes.object,
	onChange: PropTypes.func
};
const defaultProps={
	items: [],
	values: null,
	onChange: (items) => {} 
};
const MagicNavigationMenu = (props) => {
	/*** States and Variables ***/
	const [indicatorConfig, setIndicatorConfig] = React.useState({
		pos: 0,
		open: false,
	})
	/*** Processing ***/
	React.useEffect(()=>{
		if(props.values.length){
			setIndicatorConfig({
				pos: (props.items.indexOf(props.values[0]) + 0.5)/ props.items.length * 100,
				open: true
			});
		}
		else {
			setIndicatorConfig({
				pos: indicatorConfig.pos,
				open: false
			});
		}
	}, [props.values])
	/*** Sub Components ***/
	const onItemClick = (item) => {
		if(props.values.includes(item)){
			props.onChange([]);
		}
		else {
			props.onChange([item]);
		}
	}
	/*** Event Handlers ***/
	const renderIndicator = () => {
		return <div 
		style={{
			left: indicatorConfig.pos + "%", 
			width: indicatorConfig.open? 40: 0,
			height: indicatorConfig.open? 40: 0}}
		className='magic-navigation-menu-indicator' />
	}
	const renderTopFillers = () => {
		const leftSize = indicatorConfig.pos + indicatorConfig.open?150/props.items.length: 50/props.items.length;
		return <>
			<div 
			style={{width: leftSize + "%"}}
			className='magic-navigation-menu-top-left-filler' />
			<div 
			style={{width: (100 - leftSize) + "%"}}
			className='magic-navigation-menu-top-right-filler' />
		</>
	}
	const renderButtons = () => {
		return <div className='magic-navigation-menu-buttons-container'>
			{props.items.map(item=>{
				const selected = props.values.includes(item);
				return <button 
				onClick={(e)=>{onItemClick(item)}}
				className={selected?'magic-navigation-menu-selected-button': 'magic-navigation-menu-button'}>
					<i className={item.icon} />
				</button>
			})}
		</div>
	}
	/*** Main Render ***/
	return <div className='magic-navigation-menu-anchor'>
		<div className='magic-navigation-menu-bottom-filler' />
		{renderTopFillers()}
		{renderIndicator()}
		{renderButtons()}
	</div>;
}
MagicNavigationMenu.propTypes = propTypes;
MagicNavigationMenu.defaultProps = defaultProps;
export default MagicNavigationMenu;