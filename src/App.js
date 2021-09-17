import React from 'react';
import image_test from './images/test.png';
import DropMenuWrapper from './components/menu/DropMenuWrapper';
import InfoComment from './components/dialog/InfoComment';
import CommentList from './components/list/CommentList';
import './App.css';
import BasePage from './components/page/BasePage';
import PageMenu from './components/menu/PageMenu';
import PageContentContainer from './pages/base_page/PageContentContainer';
import DatePicker from './components/dialog/DatePicker';
import TimePicker from './components/dialog/TimePicker';

function App() {
	const pageRef = React.useRef(null);
	const [timePickerOpen, setTimePickerOpen] = React.useState(false);
	React.useEffect(()=>{
		// console.log("HELLO WORLD")
		// pageRef.current.error("Hello World");
	}, [])
	
	return <BasePage 
	isOpen={true}
	ref={pageRef}>
		<DatePicker 
		isOpen={timePickerOpen}
		onClose={(e)=>{setTimePickerOpen(!timePickerOpen)}}/>
		<button
		onClick={(e)=>{setTimePickerOpen(!timePickerOpen)}}>
			OK
		</button>
	</BasePage>
}

export default App;
