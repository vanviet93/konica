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
import DottedLoadingIcon from './components/progress/DottedLoadingIcon';
import FanLoadingIcon from './components/progress/FanLoadingIcon';
import DownloadingIcon from './components/progress/DownloadingIcon';
import ProgressBar from './components/progress/ProgressBar';
import FileProcessBar from './components/progress/FileProcessBar';
import FileDownUploadPanel from './components/progress/FileDownUploadPanel';
import Checkbox from './components/select/Checkbox';
import FoldingEffect from './components/effect/FoldingEffect';
import TurningEffect from './components/effect/TurningEffect';
import InfiniteList from './components/list/InfiniteList';
import ImageBoard from './components/grid/ImageBoard';
import "./components/ComponentStyle.css"
import imageTest from './images/test.png'
import KeywordInput from './components/input/KeywordInput';
import KeywordSearchbox from './components/input/KeywordSearchbox';
function App() {
	const pageRef = React.useRef(null);
	
	
	return <BasePage 
	isOpen={true}
	ref={pageRef}>
		<div style={{width:"400px", height: "512px"}}>
			<KeywordSearchbox onSearch={(e)=>{console.log(e)}}/>
		</div>
	</BasePage>
}

export default App;
