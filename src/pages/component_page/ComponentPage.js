import React from 'react';
import imageDog1 from "../../images/test_dog1.jpeg";
import imageDog2 from "../../images/test_dog2.jpeg";
import imageDog3 from "../../images/test_dog3.jpeg";
import imageDog4 from "../../images/test_dog4.jpeg";
import imageDog5 from "../../images/test_dog5.jpeg";
import imageDog6 from "../../images/test_dog6.jpeg";
import imageDog7 from "../../images/test_dog7.jpeg";
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
	ScatteredFloatingEffect,
	InfoComment,
	FloatingPointer,
	DistanceStrictButton,
	FloatView,
	DropDownSelect,
	VirtualKey,
	DropDownMultiSelect,
	MagicNavigationMenu,
	PageSlide,
	BookOpenEffect
} from '../../components';
import "./ComponentPage.css";

function ComponentPage() {
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
			<label className="component-page-label">IMAGE BOARD</label>
			<div className="component-page-image-board-container">
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
			<label className="component-page-label">KEYWORD SEARCH BOX</label>
			<div className="component-page-keyword-searchbox-container">
				<KeywordSearchBox onSearch={(e)=>{console.log(e)}}/>
			</div>
		</>
	}

	///// Render Scattered Floating Effect /////
	const [scatteredFloatingEffectActive, setScatteredFloatingEffectActive] = React.useState(false)
	const renderScatterFloatingEffect = () => {
		return <>
			<label className="component-page-label">SCATTERED FLOATING EFFECT</label>
			<button 
			className="component-page-button"
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
			<label className="component-page-label">FOLDING EFFECT</label>
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
		<label className="component-page-label">DATE PICKER</label>
		<DatePicker isOpen={datePickerOpen}
		onClose={(e)=>{setDatePickerOpen(false)}}/>
		<button 
		className="component-page-button"
		onClick={(e)=>{setDatePickerOpen(true)}}>
			SHOW DATE
		</button>
		</>
	}

	///// Render Time Picker /////
	const [timePickerOpen, setTimePickerOpen] = React.useState(false);
	const renderTimePicker = () => {
		return <>
		<label className="component-page-label">TIME PICKER</label>
		<TimePicker isOpen={timePickerOpen}
		onClose={(e)=>{setTimePickerOpen(false)}}/>
		<button 
		onClick={(e)=>{setTimePickerOpen(true)}}
		className="component-page-button">
			SHOW TIME
		</button>
		</>
	} 

	///// Render Radio Button Group ////
	const [radioLabels, setRadioLabels] = React.useState(["LABEL 1", "LABEL 2", "LABEL 3"])
	const [radioValue, setRadioValue] = React.useState("LABEL1");
	const renderRadioButtonGroup = () => {
		return <>
		<label className="component-page-label">RADIO BUTTON GROUP</label>
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
			<label className="component-page-label">TOAST</label>
			<button 
			onClick={(e)=>{setToastOpen(true)}}
			className="component-page-button">SHOW TOAST</button>
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
			<label className="component-page-label">DATE/TIME INPUT</label>
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
			<label className="component-page-label">PROGRESS BAR</label>
			<ProgressBar progress={30}/>
		</>
	}

	///// Render Checkbox /////
	const [checked, setChecked] = React.useState(false);
	const renderCheckbox = () => {
		return <>
			<label className="component-page-label">CHECKBOX</label>
			<Checkbox 
			label="CHECKBOX"
			onCheck={()=>{setChecked(!checked)}}
			checked={checked}/>
		</>
	}
	///// Render Loading Icon /////
	const renderLoadingIcon = () => {
		return <>
			<label className="component-page-label">LOADING ICON</label>
			<FanLoadingIcon />
			<DottedLoadingIcon />
		</>
	}
	///// Render Floating Pointer /////
	const [floatingPointerPosition, setFloatingPointerPosition] = React.useState({x:0, y:0});
	const onFloatingPointerMove = (e) => {
		setFloatingPointerPosition(e)
	}
	const renderFloatingPointer = () => {
		return <>
			<label className="component-page-label">FLOATING POINTER</label>
			<div className="component-page-floating-pointer-container">
				<FloatingPointer 
				position={floatingPointerPosition}
				onMoving={onFloatingPointerMove}
				onMoved={onFloatingPointerMove}>
					<button onClick={(e)=>{console.log("CLICK")}}>OK</button>
				</FloatingPointer>
			</div>
		</>
	}
	
	///// Render Comment /////
	const [infoPosition, setInfoPosition] = React.useState({x: 100, y: 100});
	const [infoCommentOpen, setInfoCommentOpen] = React.useState(false);
	const [infoCommentSelected, setInfoCommentSelected] = React.useState(false);
	const [selectedMessageId, setSelectedMessageId] = React.useState(null);
	const [infoMessages, setInfoMessages] = React.useState([]);
	const renderInfoComment = () => {
		return <>
			<label className="component-page-label">INFO COMMENT</label>
			<div className="component-page-info-comment-container">
				<InfoComment 
				id={1}
				isOpen={infoCommentOpen}
				isSelected={infoCommentSelected}
				selectedMessageId={selectedMessageId}
				position={infoPosition}
				messages={infoMessages}
				onClick={(e)=>{setInfoCommentOpen(!infoCommentOpen)}}
				onSelect={(e)=>{setInfoCommentSelected(true)}}
				onMessageSend={(e)=>{setInfoMessages(infoMessages.concat([{
					id: infoMessages.length,
					writer: "Writer",
					content: "Hello World",
					datetime: "Mon Dec 06 2021 14:45:59 GMT+0900",
				}]))}}
				onMessageRemove={(e)=>{console.log(e)}}/>
			</div>
		</>
	}
	///// Render Distance Strict Button /////
	const onButtonDistanceStrictClick = React.useCallback((e)=>{
		console.log("CLICK");
	}, [])
	const renderDistanceStrictButton = () => {
		return <>
			<label className="component-page-label">DISTANCE STRICT BUTTON</label>
			<DistanceStrictButton 
			onClick={onButtonDistanceStrictClick}>
				CLICK ME
			</DistanceStrictButton>
		</>
	}

	///// Render Floating View /////
	const [floatViewOpen, setFloatViewOpen] = React.useState(false);
	const [floatViewMinimized, setFloatViewMinimized] = React.useState(false);
	const renderFloatingView = () => {
		return <>
			<label className="component-page-label">FLOATING VIEW</label>
			<div className="component-page-floating-view-container">
				<button onClick={(e)=>{setFloatViewOpen(true)}}>SHOW</button>
				<FloatView 
				isOpen={floatViewOpen}
				minimized={floatViewMinimized}
				onButtonCloseClick={(e)=>{console.log("VANVIET CLOSE"); setFloatViewOpen(false)}}
				isButtonRestoreVisible={true}
				onButtonRestoreClick={()=>{}}
				isButtonMinimizeVisible={true}
				onButtonMinimizeClick={(e)=>{setFloatViewMinimized(true)}}
				onButtonMaximizeClick={(e)=>{setFloatViewMinimized(false)}}
				maximizeIcon="fas fa-paw"/>
			</div>
		</>
	}

	///// Render Drop Down Select /////
	const [dropdownSelectItems, setDropdownSelectItems] = React.useState([
		"Item 1", 
		"Item 2", 
		"Item 3", 
		"Item 4", 
		"Item 5", 
		"Item 6", 
		"Item 7"]);
	const [selectedDropdownItem, setSelectedDropDownItem] = React.useState("Item 1");
	const renderDropDownSelect = () => {
		return <>
		<label className='component-page-label'>DROP DOWN SELECT</label>
		<div className='component-page-drop-down-select-container'>
			<DropDownSelect 
			items={dropdownSelectItems}
			value={selectedDropdownItem}
			onChange={(e)=>{setSelectedDropDownItem(e)}}/>
		</div>
		</>
	}
	///// Render DropDown MultiSelect ////
	const [selectedDropdownItems, setSelectedDropdownItems] = React.useState([]);
	const renderDropDownMultiSelect = () => {
		return <>
		<label className='component-page-label'>DROP DOWN  MULTI SELECT</label>
		<div className='component-page-drop-down-select-container'>
			<DropDownMultiSelect 
				items={dropdownSelectItems}
				values={selectedDropdownItems}
				onChange={(e)=>{setSelectedDropdownItems(e)}}/>
		</div>
		</>
	}


	///// Render Virtual Key /////
	const renderVirtualKey = () => {
		return <>
			<label className='component-page-label'>VIRTUAL KEY</label>
			<div className='component-page-virtual-keys-container'>
				<VirtualKey 
				inputKey="C"
				onClick={()=>{console.log("CLICK")}}/>
				<VirtualKey 
				inputKey="S"
				onClick={()=>{console.log("CLICK")}}/>
				<VirtualKey 
				inputKey="S"
				onClick={()=>{console.log("CLICK")}}/>
			</div>
		</>
	}

	
	///// MAGIC NAVIGATION MENU /////
	const [magicNavigationMenuItems, setMagicNavigationMenuItems] = React.useState([
		{
			icon: "fas fa-home",
			text: "HOME"
		},
		{
			icon: "fas fa-user",
			text: "USER"
		}, 
		{
			icon: "fas fa-cogs",
			text: "SETTING"
		}, 
		{
			icon: "fas fa-comments",
			text: "COMMENT"
		}
	]);
	const [magicNavigationMenuValues, setMagicNavigationMenuValues] = React.useState([]);
	const renderMagicNavigationMenu = () => {
		return <>
			<label className='component-page-label'>MAGIC NAVIGATION MENU</label>
			<div className='component-page-magic-navigation-menu-container'>
				<MagicNavigationMenu 
				items={magicNavigationMenuItems}
				values={magicNavigationMenuValues}
				onChange={setMagicNavigationMenuValues}/>
			</div>
		</>
	}
	///// Render Page Slide /////
	const [slides, setSlides] = React.useState([1,2,3,4]);
	const [currentSlide, setCurrentSlide] = React.useState(1);
	const renderSlide = (slide) => {
		if(!slide) return null;
		return <div style={{
			height: "calc(100% - 16px)",
			padding: "8px",
			borderRadius: "4px",
			border: "solid 1px #AAA"
		}}
			onClick={(e)=>{onSlideClick(slide)}}>
			<label >{slide}</label>
		</div>
	}
	const onSlideClick = (slide) => {
		if(slide!==currentSlide){
			setCurrentSlide(slide);
		}
	}
	const renderPageSlide = () => {
		return <>
			<label className='component-page-label'>PAGE SLIDE</label>
			<div className='component-page-page-slide-container'>
				<PageSlide 
				slides={slides}
				currentSlide={currentSlide}
				renderSlide={renderSlide}/>
			</div>
		</>
	}

	///// Render Book Open Effect /////
	const [bookPages, setBookPages] = React.useState([0,1,2,3,4]);
	const [currentBookPage, setCurrentBookPage] = React.useState(3);
	const onBookPageClick = (page, left) => {
		if(left) {
			console.log("PAGE", left, (currentBookPage+4)%5)
			setCurrentBookPage((currentBookPage+4)%5)
		}
		else {
			console.log("PAGE", left, (currentBookPage+1)%5)
			setCurrentBookPage((currentBookPage+1)%5)
		}
		
	}
	const renderBookPage = (page, left) => {
		return <div style={{
			borderRadius: "4px",
			height: "calc(100% - 18px)",
			padding: "8px",
			backgroundColor:"#FFF",
			border: "solid 1px #AAA"
		}}
		onClick={(e)=>{onBookPageClick(page, left)}}>
			<label >{page + " Hom nay la ngay dep troi be hua co gang cham ngoan " + page}</label>
		</div>
	}
	const renderBookOpenEffect = () => {
		return <>
			<label className='component-page-label'>BOOK OPEN EFFECT</label>
			<div className='component-page-book-open-effect-container'>
			<BookOpenEffect 
			pages={bookPages}
			currentPage={currentBookPage}
			renderPage={renderBookPage}/>
			</div>
		</>
	}

	/*** Main Render ***/
	return <div className="component-page-page-container">
		{renderPageMenu()}
		<div className="component-page-page-subcontainer">
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
			{renderFloatingPointer()}
			{renderDistanceStrictButton()}
			{renderInfoComment()}
			{renderFloatingView()}
			{renderDropDownSelect()}
			{renderDropDownMultiSelect()}
			{renderVirtualKey()}
			{renderMagicNavigationMenu()}
			{renderPageSlide()}
			{renderBookOpenEffect()}
		</div>
	</div>
}

export default ComponentPage;