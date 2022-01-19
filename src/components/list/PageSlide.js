import React from 'react';
import PropTypes from 'prop-types';
import "./PageSlide.css";
const propTypes={
	slides: PropTypes.array,
	currentSlide: PropTypes.any,
	renderSlide: PropTypes.func
};
const defaultProps={
	slides: [],
	currentSlide: undefined,
	renderSlide: (slide) => {}
};
const PageSlide = (props) => {
	/*** States and Variables ***/
	const  currentSlideRef = React.useRef(props.currentSlide);
	/*** Processing ***/
	React.useEffect(()=>{
		currentSlideRef.current = props.currentSlide;
	}, [props.currentSlide])
	/*** Sub Components ***/
	const renderSlides = () => {
		const currentSlidePos = props.slides.indexOf(props.currentSlide);
		return props.slides.map((slide, index)=>{
			if(index<currentSlidePos){
				return <div className='page-slide-left-page'
				style={{left: (index-currentSlidePos+1)*25 + '%'}}>
					{props.renderSlide(slide)}
				</div>
			}
			else if (index===currentSlidePos){
				return <div className='page-slide-center-page'>
					{props.renderSlide(slide)}
				</div>
			}
			else {
				return <div className='page-slide-right-page'
				style={{left: (index-currentSlidePos+2)*25 + '%'}}>
					{props.renderSlide(slide)}
				</div>
			}

		})
	}
	/*** Event Handlers ***/
	/*** Main Render ***/
	return <div className='page-slide-container'>
		{renderSlides()}
	</div>;
}
PageSlide.propTypes = propTypes;
PageSlide.defaultProps = defaultProps;
export default PageSlide;