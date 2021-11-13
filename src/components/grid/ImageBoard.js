import React from "react";
import PropTypes from "prop-types";
import DoubleClickableDiv from "../page/DoubleClickableDiv";
import "./ImageBoard.css";

const propTypes = {
  images: PropTypes.array,
  selectedImages: PropTypes.array,
  minColumnWidth: PropTypes.number,
  rowHeight: PropTypes.number,
  onDoubleClickOnImage: PropTypes.func
};
const defaultProps = {
  images: [],
  selectedImages: [], 
  minColumnWidth: 192,
  rowHeight: 192,
  onDoubleClickOnImage: (image) => {}
};
const ImageBoard = (props) => {
  /*** Variables and States ***/
  const containerRef = React.useRef(null);
  const containerWidthRef = React.useRef(0);
  const [containerWidth, setContainerWidth] = React.useState(containerWidthRef.current);
  /*** Processing ***/
  React.useEffect(()=>{
    const container = containerRef.current;
    const resizeObserver = new ResizeObserver((entries)=>{
      if(containerWidthRef.current!==container.clientWidth){
        containerWidthRef.current = container.clientWidth;
        setContainerWidth(containerWidthRef.current);
      }
    });
    resizeObserver.observe(container);
    return ()=>{
      resizeObserver.disconnect();
    }
  }, [])
  /*** Sub Components ***/
  const renderRows = () => {
    if(containerWidth && props.images && props.images.length){
      const nCols = Math.floor(containerWidth / props.minColumnWidth);
      const nRows = Math.ceil(props.images.length/nCols);
      const result = [];
      for(let row=0;row<nRows;row++){
        const imageSet = props.images.slice(row*nCols, row*nCols+nCols);
        result.push(<div 
        style={{height: props.rowHeight}}
        className="image-board-row">
          {imageSet.map(image=>{
          const selected = props.selectedImages.includes(image);
          return <DoubleClickableDiv 
          onDoubleClick={(e)=>props.onDoubleClickOnImage(image)}
          style={{width:100/nCols+"%", backgroundColor: selected?"#4285F4": "transparent"}}
          className="image-board-cell">
            <img 
            className="image-board-cell-image"
            src={image.source} />
            <label 
            style={{color:selected?"#FFF": undefined}}
            className="image-board-cell-label">{image.name}</label>
          </DoubleClickableDiv>})}
        </div>)
      }
      return result;
    }
    return null;
  }
  /*** Main Render ***/
  return <div 
  ref={containerRef}
  style={{minWidth: props.minColumnWidth}}
  className="image-board-container">
    <div className="image-board-subcontainer">
      {renderRows()}
    </div>
  </div>
}
ImageBoard.propTypes = propTypes;
ImageBoard.defaultProps = defaultProps;
export default ImageBoard;