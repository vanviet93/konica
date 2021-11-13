import React from 'react';
import PropTypes from 'prop-types';
import "./InfiniteList.css";

const propTypes = {
	items: PropTypes.array,
	renderItem: PropTypes.func,
	onScrollToTop: PropTypes.func,
	onScrollToBottom: PropTypes.func
};
const defaultProps = {
	items: [],
	renderItem: (item) => {},
	onScrollToTop: () => {},
	onScrollToBottom: () => {}
};

const InfiniteList = React.forwardRef((props, ref) => {
	/*** States and Variables ***/
	const containerRef = React.useRef(null);
	const prevFirstItem = React.useRef(null);
	const prevLastItem = React.useRef(null);
	/*** Processing ***/
	React.useEffect(()=>{
		const container = containerRef.current;
		container.addEventListener('scroll', onListScroll);
		return ()=>{
			// remove event listener
			container.removeEventListener('scroll', onListScroll);
			if(props.items && props.items.length>0){
				prevFirstItem.current = props.items[0];
				prevLastItem.current = props.items[props.items.length-1];
			}
		}
	}, [props.items])
	React.useImperativeHandle(ref, ()=>({
		getScrollPosition: () => {
			const container = containerRef.current;
			return {before: container.scrollTop,
			after: container.scrollHeight - container.scrollTop - container.clientHeight}
		},
		scroll: (pos, smooth) => {
			const container = containerRef.current;
			container.scrollTo({
				left: 0,
				top: pos,
				behavior: smooth?"smooth": undefined
			})
		}
	}))
	/*** Event Handlers ***/
	const onListScroll = (e) => {
		const container = containerRef.current;
		if(props.items && props.items.length>0){
			// if one scrolls near to the top and the 1st element in previous comment list is different from the first element in current comment list then download more comments
			if(prevFirstItem.current!==props.items[0] && container.scrollTop<32){
				props.onScrollToTop();
			}
			else if (prevLastItem.current!==props.items[props.items.length-1] && container.scrollHeight - container.scrollTop - container.clientHeight<32){
				props.onScrollToBottom();
			}
		}
	}
	/*** Main Render ***/
	return <div 
	ref={containerRef}
	className="infinite-list-container">
		<div className="infinite-list-subcontainer">
			{props.items.map(item=>props.renderItem(item))}
		</div>
	</div>
})
InfiniteList.propTypes = propTypes;
InfiniteList.defaultProps = defaultProps;
export default InfiniteList;