import React from 'react';
import imageDog1 from "./images/test_dog1.jpeg";
import imageDog2 from "./images/test_dog2.jpeg";
import imageDog3 from "./images/test_dog3.jpeg";
import imageDog4 from "./images/test_dog4.jpeg";
import imageDog5 from "./images/test_dog5.jpeg";
import imageDog6 from "./images/test_dog6.jpeg";
import imageDog7 from "./images/test_dog7.jpeg";
import {
  DialogBackground,
  DatePicker,
  TimePicker,
  ErrorDialog,
  InfoDialog,
  Toast,
  FoldingEffect,
  ImageBoard,
  DateInput,
  TimeInput,
  KeywordInput,
	KeywordSearchBox,
  DropMenuWrapper,
  PageMenu,
  DoubleClickableDiv,
  DottedLoadingIcon,
  FanLoadingIcon,
  FileProcessBar,
  ProgressBar,
  Checkbox,
  RadioButtonGroup,
	ScatteredFloatingEffect
} from './components';
import "./App.css";

function App() {
	/*** Sub Components ***/
	///// Render Page Menu /////
	const [pageMenuOpen, setPageMenuOpen] = React.useState(false);
	const [menuItems, setMenuItems] = React.useState([
		{
			id: "Animal",
			icon: "fas fa-paw",
			color: "#EB5757",
			text: "Animal",
			children: [
				{
					id: "Hippo",
					icon: "fas fa-hippo",
					color: "#7D81E7",
					text: "Hippo",
				},
				{
					id: "Otter",
					icon: "fas fa-otter",
					color: "#29D697",
					text: "Otter",
				},
				{
					id: "Dog",
					icon: "fas fa-dog",
					color: "#46CDFB",
					text: "Dog"
				}
			]
		}
	])
	const renderPageMenu = () => {
		return <PageMenu 
		isOpen={pageMenuOpen}
		onToggle={(e)=>{setPageMenuOpen(!pageMenuOpen)}}
		menuItems={menuItems}
		onMenuItemClick={(e)=>{console.log(e)}}/>
	}

	///// Render Page Menu /////
	const [images, setImages] = React.useState([
		{
			id: "001",
			source: imageDog1
		},
		{
			id: "002",
			source: imageDog2
		},
		{
			id: "003",
			source: imageDog3
		},
		{
			id: "004",
			source: imageDog4
		},
		{
			id: "005",
			source: imageDog5
		},
		{
			id: "006",
			source: imageDog6
		},
		{
			id: "007",
			source: imageDog7
		}
	]);
	const [selectedImages, setSelectedImages] = React.useState([]);
	const renderImageBoard = () => {
		return <>
			<label className="app-label">IMAGE BOARD</label>
			<div className="app-image-board-container">
				<ImageBoard 
				images={images}
				selectedImages={selectedImages}
				onClickImage={onSelectImage}/>
			</div>
		</>
	}
	const onSelectImage = (image) => {
		if(selectedImages.includes(image)){
			setSelectedImages(selectedImages.filter(e=>e!==image));
		}
		else{
			setSelectedImages(selectedImages.concat(image));
		}
	}

	///// Render Keyword Search /////
	const renderKeywordSearchBox = () => {
		return <>
			<label className="app-label">KEYWORD SEARCH BOX</label>
			<div className="app-keyword-searchbox-container">
				<KeywordSearchBox onSearch={(e)=>{console.log(e)}}/>
			</div>
		</>
	}

	///// Render Scattered Floating Effect /////
	const [scatteredFloatingEffectActive, setScatteredFloatingEffectActive] = React.useState(false)
	const renderScatterFloatingEffect = () => {
		return <>
			<label className="app-label">SCATTERED FLOATING EFFECT</label>
			<button 
			className="app-button"
			onClick={(e)=>{setScatteredFloatingEffectActive(true)}}>ACTIVATE</button>
			<div style={{width: "200px", height: "200px", minHeight: "200px", position: "relative"}}>
				<div style={{width: 0, height: 0, position: "relative", top: 150, left: 100}}>
					<ScatteredFloatingEffect 
					isActive={scatteredFloatingEffectActive}
					onEnd={(e)=>{setScatteredFloatingEffectActive(false)}}
					renderContent={()=><i 
					style={{fontSize: '20px', color: '#EB5757'}}
					className="fas fa-thumbs-up"></i>}/>
				</div>
			</div>
		</>
	}

	////// Render Folding Effect //////
	const renderFoldingEffect = () => {
		return <>
			<label className="app-label">FOLDING EFFECT</label>
			<div style={{width:"480px", height: "360px", minHeight: "360px", backgroundColor:"gray"}}>
				<FoldingEffect>
					<button>OK</button>
				</FoldingEffect>
			</div>
		</>
	}

	///// Render Date Picker /////
	const [datePickerOpen, setDatePickerOpen] = React.useState(false);
	const renderDatePicker = () => {
		return <>
		<label className="app-label">DATE PICKER</label>
		<DatePicker isOpen={datePickerOpen}
		onClose={(e)=>{setDatePickerOpen(false)}}/>
		<button 
		className="app-button"
		onClick={(e)=>{setDatePickerOpen(true)}}>
			SHOW DATE
		</button>
		</>
	}

	///// Render Time Picker /////
	const [timePickerOpen, setTimePickerOpen] = React.useState(false);
	const renderTimePicker = () => {
		return <>
		<label className="app-label">TIME PICKER</label>
		<TimePicker isOpen={timePickerOpen}
		onClose={(e)=>{setTimePickerOpen(false)}}/>
		<button 
		onClick={(e)=>{setTimePickerOpen(true)}}
		className="app-button">
			SHOW TIME
		</button>
		</>
	} 

	///// Render Radio Button Group ////
	const [radioLabels, setRadioLabels] = React.useState(["LABEL 1", "LABEL 2", "LABEL 3"])
	const [radioValue, setRadioValue] = React.useState("LABEL1");
	const renderRadioButtonGroup = () => {
		return <>
		<label className="app-label">RADIO BUTTON GROUP</label>
		<RadioButtonGroup 
			labels={radioLabels}
			onChange={(e)=>{setRadioValue(e)}}
			value={radioValue}/>
		</>
	} 

	///// Render Toast /////
	const [toastOpen, setToastOpen] = React.useState(false);
	const renderToast = () => {
		return <>
			<label className="app-label">TOAST</label>
			<button 
			onClick={(e)=>{setToastOpen(true)}}
			className="app-button">SHOW TOAST</button>
			<Toast 
			duration={3000}
			content="This is toast content"
			isOpen={toastOpen}
			onClose={() => {setToastOpen(false)}} />
		</>
	}

	///// Render Date/ Time Input /////
	const [dateTime, setDateTime] = React.useState(new Date());
	const renderDateTimeInput = () => {
		return <>
			<label className="app-label">DATE/TIME INPUT</label>
			<DateInput 
			date={dateTime }
			onClick={(e)=>{setDatePickerOpen(true)}}/>
			<TimeInput 
			time={dateTime }
			onClick={(e)=>{setTimePickerOpen(true)}}/>
		</>
	}
	///// Render Progress Bar /////
	const renderProgressBar = () => {
		return <>
			<label className="app-label">PROGRESS BAR</label>
			<ProgressBar progress={30}/>
		</>
	}

	///// Render Checkbox /////
	const [checked, setChecked] = React.useState(false);
	const renderCheckbox = () => {
		return <>
			<label className="app-label">CHECKBOX</label>
			<Checkbox 
			label="CHECKBOX"
			onCheck={()=>{setChecked(!checked)}}
			checked={checked}/>
		</>
	}
	///// Render Loading Icon /////
	const renderLoadingIcon = () => {
		return <>
			<label className="app-label">LOADING ICON</label>
			<FanLoadingIcon />
			<DottedLoadingIcon />
		</>
	}
	/*** Main Render ***/
	return <div className="app-page-container">
		{renderPageMenu()}
		<div className="app-page-subcontainer">
			{renderImageBoard()}
			{renderScatterFloatingEffect()}
			{renderKeywordSearchBox()}
			{renderFoldingEffect()}
			{renderDatePicker()}
			{renderTimePicker()}
			{renderRadioButtonGroup()}
			{renderToast()}
			{renderDateTimeInput()}
			{renderProgressBar()}
			{renderCheckbox()}
		</div>
	</div>
}

export default App;