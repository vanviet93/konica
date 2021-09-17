import React from 'react';
import PropTypes from 'prop-types';
import DialogBackground from './DialogBackground2';
import "./TimePicker.css";

const propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onTimeChange: PropTypes.func,
	initTime: PropTypes.object,
	timeFormat: PropTypes.string
}
const defaultProps = {
	isOpen: false,
	onClose: () => {},
	onTimeChange: (newTime) => {},
	initTime: new Date(),
	timeFormat: "HH:mm"
}
const TimePicker = (props) => {
	/*** States and Variables ***/
	const [hourModeEnabled,setHourModeEnabled] = React.useState(true);
	const [selectedTime, setSelectedTime] = React.useState(new Date());
	const clockRef = React.useRef(null);
	/*** Processing ***/
	React.useEffect(()=>{
		setSelectedTime(props.initTime);
	}, [props.initTime])

	React.useEffect(()=>{
		if(props.isOpen){
			setHourModeEnabled(true);
		}
	},[props.isOpen])
	/*** Sub Components ***/
	const renderHeaderTime = () => {
		const curHour = selectedTime.getHours();
		const curMin  = selectedTime.getMinutes();
		return <div className="time-picker-header-time-container">
			<label 
			className={hourModeEnabled?"time-picker-header-selected-time":"time-picker-header-time"}
			onClick={(e)=>{setHourModeEnabled(true)}}>
				{curHour<10?"0"+curHour: curHour}
			</label>
			<label className="time-picker-header-time">:</label>
			<label 
			className={!hourModeEnabled?"time-picker-header-selected-time":"time-picker-header-time"}
			onClick={(e)=>{setHourModeEnabled(false)}}>
				{curMin<10?"0"+curMin: curMin}
			</label>
	</div>
	}
	const renderClockHand = () => {
		const curHour = selectedTime.getHours();
		const rotateAngle = hourModeEnabled?(curHour%12*30):(selectedTime.getMinutes()*6);
		const shortHand = hourModeEnabled?(curHour===0||curHour>12): false;
		return <div 
		className="time-picker-clock-hand" 
		style={{transform: "translateY(-50%) rotate(" + rotateAngle + "deg)", 
		height: shortHand? "calc(45% - 42px)": "45%"}}>
			<div className="time-picker-number-pointer"></div>
		</div>
	}
	
	const renderClockNumbers = () => {
		const numberViews = [];
		for(let i=0; i<12; i++) {
			const rotateAngle = 30 * i;
			const outerHour = i===0 && hourModeEnabled?12:i;
			const innerHour = i===0?0:(i+12);
			const minute = i===0?0: i*5;
			numberViews.push(<div 
			key={(hourModeEnabled?"h_":"m_")+i}
			className="time-picker-clock-number-anchor"
			style={{transform: "translateY(-50%) rotate(" + rotateAngle + "deg)"}}>
				<div className="time-picker-clock-number-container">
					<label
					style={{transform: "rotate(-" + rotateAngle + "deg)"}}>
						{hourModeEnabled?outerHour: minute}
					</label>
				</div>
				{hourModeEnabled?
				<div className="time-picker-clock-inner-number-container">
					<label
					style={{transform: "rotate(-" + rotateAngle + "deg)"}}>
						{innerHour}
					</label>
				</div>:null}
			</div>)
		}
		return numberViews;
	}
	const renderActions = () => {
		return <div className="time-picker-action-container">
			<button 
			className="time-picker-button"
			onClick={(e)=>{props.onClose()}}>
				キャンセル
			</button>
			<button 
			className="time-picker-button"
			autoFocus
			onClick={(e)=>{props.onTimeChange(selectedTime)}}>
				OK
			</button>
		</div>
	}
	/*** Event Handlers ***/
	const onClockClick = (e) => {
		const clock = clockRef.current;
		const cx = clock.offsetLeft + clock.offsetWidth / 2;
		const cy = clock.offsetTop + clock.offsetHeight / 2;
		const dx = e.clientX - cx;
		const dy = cy - e.clientY;
		if(dx===0 && dy===0) return;
		let angle = Math.atan(dx/dy)/Math.PI*180;
		angle = angle<0? angle+180:angle;
		angle = dx<0? angle +180: angle;
		if (hourModeEnabled){
			const d = Math.sqrt(dx**2 + dy**2);
			const boundRadius = clock.offsetWidth * 0.45 - 42/2;
			let hour = Math.round(angle/30);
			if(d<boundRadius){
				hour = hour!==0?hour+12:hour;
			}
			else{
				hour = hour===0?12:hour;
			}
			selectedTime.setHours(hour);
			setSelectedTime(new Date(selectedTime));
			setTimeout(()=>{
				setHourModeEnabled(false);
			}, 250)
		}
		else { 
			let minute = Math.round(angle/6);
			selectedTime.setMinutes(minute);
			setSelectedTime(new Date(selectedTime));
		}
	}
	/*** Main Render ***/
	return <DialogBackground
	isOpen={props.isOpen}
	onClose={props.onClose}>
		<div className="time-picker-main-container">
			<div className="time-picker-header">
				{renderHeaderTime()}
			</div>
			<div className="time-picker-body">
        <div className="time-picker-clock"
				onClick={onClockClick}
				ref={clockRef}>
					<div className="time-picker-clock-center" />
					{renderClockHand()}
					{renderClockNumbers()}
				</div>
				{renderActions()}
      </div>
		</div>

	</DialogBackground>
}
TimePicker.propTypes = propTypes;
TimePicker.defaultProps = defaultProps;
export default TimePicker;