import React from 'react';
import PropTypes from 'prop-types';
import "./RoundPageOpenEffect.css";

const propTypes={
	pages: PropTypes.array,
	currentPage: PropTypes.any,
	renderPage: PropTypes.func,
};
const defaultProps={
	pages: [],
	currentPage: undefined,
	renderPage: (page) => null,
};
const RoundPageOpenEffect = (props) => {
	/*** States and Variables ***/
	const configRef = React.useRef({
		prePage: props.currentPage,
		curPage: props.currentPage,
	})
	const [config, setConfig] = React.useState(configRef.current);
	const flipRef = React.useRef(true);
	const [flip,setFlip] = React.useState(flipRef.current);
	/*** Processing ***/
	React.useEffect(()=>{
		const currentConfig = configRef.current;
		if(currentConfig.curPage!==props.currentPage){
			currentConfig.prePage = currentConfig.curPage;
			currentConfig.curPage = props.currentPage;
			configRef.current = Object.assign({}, currentConfig);
			setConfig(configRef.current);
			flipRef.current = !flipRef.current;
			setFlip(flipRef.current);
		}
	}, [props.pages, props.currentPage]);
	/*** Sub Components ***/
	const renderPages = () => {
		return <>
			<div className={!flip?
			'round-page-open-effect-active-container':
			'round-page-open-effect-inactive-container'}>
				{!flip?
				props.renderPage(config.curPage):
				props.renderPage(config.prePage)}
			</div>
			<div className={flip?
			'round-page-open-effect-active-container':
			'round-page-open-effect-inactive-container'}>
				{flip?
				props.renderPage(config.curPage):
				props.renderPage(config.prePage)}
			</div>
		</>
	}
	/*** Event Handlers ***/
	/*** Main Render ***/
	return <div className='round-page-open-effect-container'>
		{renderPages()}
	</div>

}
RoundPageOpenEffect.propTypes = propTypes;
RoundPageOpenEffect.defaultProps = defaultProps;
export default RoundPageOpenEffect;