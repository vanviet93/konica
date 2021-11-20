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
  DropMenuWrapper,
  PageMenu,
  DoubleClickableDiv,
  DottedLoadingIcon,
  FanLoadingIcon,
  FileProcessBar,
  ProgressBar,
  Checkbox,
  RadioButtonGroup
} from './components';
import "./App.css";

function App() {
	/*** Sub Components ***/
	const renderPageMenu = () => {
		return <PageMenu 
		/>
	}
	
	/*** Main Render ***/
	return <div className="page-container">
		{renderPageMenu()}
	</div>
}

export default App;
