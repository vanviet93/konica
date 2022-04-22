import React from 'react';
import PropTypes from 'prop-types';
import "./MultiImageChooser.css";

const propTypes={
	srcs: PropTypes.arrayOf(PropTypes.any),
	inputExtensions: PropTypes.array,
	onChange: PropTypes.func
};
const defaultProps={
	srcs: [],
	inputExtensions: ['png', 'jpeg', 'jpg', 'bmp', 'heif', 'heic'],
	onChange: (srcs) => {}
};
const MultiImageChooser = (props) => {
	/*** States and Variables ***/
	/*** Processing ***/
	/*** Sub Components ***/
	const renderImages = () => {
		if(!(props.srcs && props.srcs.length)){
			return <div 
			onDragOver={onDragOver}
			onDrop={onDrop}
			className='multi-image-chooser-empty-image-container'>
				<i className='far fa-image'/>
				<div className='multi-image-chooser-bottom-actions-container'>
					<button className='multi-image-chooser-add-button'>
						<input 
						type="file" 
						multiple={true}
						onChange={(e)=>{onImagesChange(e, 0)}}
						accept={props.inputExtensions.map(item=>'.'+item).join(',')}
						className='multi-image-chooser-input'/>
						<i className='fas fa-folder-open' />
					</button>
				</div>
			</div>
		}
		return <div className='multi-image-chooser-image-list-container'>
			{props.srcs.map((src, pos)=>{
				return <div 
				key={src} 
				className='multi-image-chooser-image-container'>
					<img 
					className='multi-image-chooser-image'
					src={src} />
					<div className='multi-image-chooser-bottom-actions-container'>
						{props.srcs.length!==pos+1? 
						<button 
						onClick={(e)=>{onImageMoveDown(pos)}}
						className='multi-image-chooser-move-right-button'>
							<i className="fas fa-chevron-right" />
						</button>: null}
						{pos!==0? 
						<button 
						onClick={(e)=>{onImageMoveUp(pos)}}
						className='multi-image-chooser-move-left-button'>
							<i className="fas fa-chevron-left" />
						</button>: null}
						<button className='multi-image-chooser-add-button'>
							<input 
							type="file" 
							multiple={true}
							onChange={(e)=>{onImagesChange(e, pos)}}
							accept={props.inputExtensions.map(item=>'.'+item).join(',')}
							className='multi-image-chooser-input'/>
							<i className='fas fa-folder-open' />
						</button>
					</div>
					<button 
					onClick={(e)=>{onImageRemove(pos)}}
					className='multi-image-chooser-remove-button'>
						<i className="fas fa-trash-alt"/>
					</button>
				</div>
			})}
		</div>;
	}
	/*** Event Handlers ***/
	const onImagesChange = (e, pos) => {
		try {
			const srcs = [];
			for(const file of e.target.files){
				srcs.push(URL.createObjectURL(file));
			}
			const newSrcs = props.srcs && props.srcs.length? [...props.srcs.slice(0, pos+1), ...srcs, ...props.srcs.slice(pos+1)]: srcs;
			props.onChange(newSrcs);
		}
		catch(err) {
			console.log("ERROR", err);
		}
	}

	const onImageRemove = (pos) => {
		const targetImage = props.srcs[pos];
		props.onChange([...props.srcs.slice(0, pos), ...props.srcs.slice(pos+1)]);
		URL.revokeObjectURL(targetImage);
	}

	const onImageMoveUp = (pos) => {
		const newSrcs = [...props.srcs.slice(0, pos-1), props.srcs[pos], props.srcs[pos-1], ...props.srcs.slice(pos+1)];
		props.onChange(newSrcs);
		
	}

	const onImageMoveDown = (pos) => {
		const newSrcs = [...props.srcs.slice(0, pos), props.srcs[pos+1], props.srcs[pos], ...props.srcs.slice(pos+2)];
		props.onChange(newSrcs);
	}

	const onDragOver = (e) => {
		e.nativeEvent.preventDefault();
		e.nativeEvent.stopPropagation();
	}
	const onDrop = (e) => {
		const items = e.dataTransfer.items;
		const srcs = [];
		if (items){
			for(const item of items) {
				if(item.kind==="file" && props.inputExtensions.includes(item.type.substr(1+item.type.indexOf('/')))){
					srcs.push(URL.createObjectURL(item.getAsFile()));
				}
			}
		}
		props.onChange(srcs);
		e.nativeEvent.preventDefault();
		e.nativeEvent.stopPropagation();
	}
	/*** Main Render ***/
	return <div className='multi-image-chooser-container'>
		{renderImages()}
	</div>;
}
MultiImageChooser.propTypes = propTypes;
MultiImageChooser.defaultProps = defaultProps;
export default MultiImageChooser;