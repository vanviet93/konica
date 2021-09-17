import React from 'react';
import PropTypes from 'prop-types';
import './DropMenuWrapper.css';

const propTypes = {
	menuItems: PropTypes.arrayOf(PropTypes.string),
	onMenuItemClick: PropTypes.func,
	onClickBackground: PropTypes.func,
	renderBackground: PropTypes.func
}
const defaultProps = {
	menuItems: [],
	onMenuItemClick: (menuX, menuY, menuItem) => {},
	onClickBackground: () => {},
	renderBackground: () => null
}
const DropMenuWrapper = (props)=>{
	/*** State and Variables ***/
	const containerRef = React.useRef(null);
	const backgroundRef = React.useRef(null);
	const [menuPos, setMenuPos] = React.useState(null);
	
	/*** Processing ***/
	React.useEffect(()=>{
		const displayMenu = (e) => {
			const background = backgroundRef.current;
			let currentElement = e.target;
			while(currentElement && currentElement!==background){
				currentElement = currentElement.parentNode;
			}
			const targetTag = e.target.tagName.toLowerCase();
			if(currentElement===background && (targetTag!=="input" || targetTag!=="textarea")){
				e.preventDefault();
				setMenuPos({x: e.offsetX, y: e.offsetY});
			}
		}
		containerRef.current.addEventListener('contextmenu', displayMenu);
	}, [props.menuItems])
	/*** Sub Components ***/
	const renderMenu = () => {
		if (!menuPos) return null;
		return <div 
		style={{top: menuPos.y, left: menuPos.x}}
		className="drop-menu-wrapper-menu-container">
			{props.menuItems.map(item=>{
				return <div 
				key={item}
				className="drop-menu-wrapper-menu-item"
				onClick={(e)=>props.onMenuItemClick(menuPos.x, menuPos.y, item)}>
					{item}
				</div>
			})}
		</div>
	}
	/*** Event Handler ***/
	const onClickOnContainer = (e) => {
		const background = backgroundRef.current;
			let currentElement = e.target;
			while(currentElement && currentElement!==background){
				currentElement = currentElement.parentNode;
			}
			if(currentElement===background){
				props.onClickBackground();
			}
		setMenuPos(null);		
	}
	/*** Main Render ***/
	return <div 
	className="drop-menu-wrapper-container"
	onClick={onClickOnContainer}
	ref={containerRef}>
		<div 
		className="drop-menu-wrapper-background"
		ref={backgroundRef}> 
			{props.renderBackground()}	
		</div>
		{props.children}
		{renderMenu()}
	</div>
}
DropMenuWrapper.propTypes = propTypes;
DropMenuWrapper.defaultProps = defaultProps;
export default DropMenuWrapper;