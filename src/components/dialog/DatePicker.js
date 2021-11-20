import React from 'react';
import PropTypes from 'prop-types';
import DialogBackground from './DialogBackground';
import "./DatePicker.css";
import moment from 'moment';

const propTypes = {
	isOpen: PropTypes.bool,
	onClose: PropTypes.func,
	onDateChange: PropTypes.func,
	initDate: PropTypes.object,
	dateFormat: PropTypes.string,
	dayLabels: PropTypes.arrayOf(PropTypes.string),
	yearMonthFormat: PropTypes.string,
}
const defaultProps = {
	isOpen: false,
	onClose: () => {},
	onDateChange: (newDate) => {},
	initDate: new Date(),
	dateFormat: "ddd MMMM DD",
	dayLabels: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
	yearMonthFormat: "MMMM yyyy"
}

const DatePicker = (props) => {
	/*** States and Variables ***/
	const [yearModeEnabled, setYearModeEnabled] = React.useState(false);
	const [selectedDate, setSelectedDate] = React.useState(new Date());
	const [selectedYear, setSelectedYear] = React.useState((new Date()).getFullYear());
	const [selectedMonth, setSelectedMonth] = React.useState((new Date()).getMonth());
	/*** Processing ***/
	const getNumMonthDays = (month, year) => {
		var d= new Date(year, month+1, 0);
    return d.getDate();
	}
	React.useEffect(()=>{
		if(props.isOpen){
			setYearModeEnabled(false);
		}
	},[props.isOpen])
	React.useEffect(()=>{
		if(props.initDate){
			setSelectedDate(props.initDate);
		}
	}, [props.initDate])
	/*** Sub Components ***/
	const renderMonthSelector = () => {
		if (yearModeEnabled) return null;
		return <div className="date-picker-month-selector">
			<div 
			className="date-picker-month-selector-button"
			onClick={onPrevMonthOpen}>
				<i className="fas fa-chevron-left" />
			</div>
			{moment(new Date(selectedYear, selectedMonth, 1)).format(props.yearMonthFormat)}
			<div 
			className="date-picker-month-selector-button"
			onClick={onNextMonthOpen}>
				<i className="fas fa-chevron-right"/>
			</div>
		</div>
	}
	const renderDayLabels = () => {
		if (yearModeEnabled) return null;
		return <div className="date-picker-day-row">
			{props.dayLabels.map(day=><label
			key={day}
			className="date-picker-day-label">
				{day}
			</label>)}
		</div>
	}
	const renderDates = () => {
		if (yearModeEnabled) return null;
		const nDays = getNumMonthDays(selectedMonth, selectedYear);
		const curDay = new Date(selectedYear, selectedMonth, 1);
		const firstDayPos = curDay.getDay();
		const weeks = [ [], [], [] ,[], [], [] ];
		for(let week=0; week<6; week++){
			for(let day=0; day<7; day++){
				const datePos = week * 7 + day - firstDayPos;
				let dateLabel = datePos<0?null: datePos+1;
				dateLabel = dateLabel && dateLabel<= nDays? dateLabel: null;
				weeks[week].push(dateLabel);
			}
		}
		return [ 0, 1, 2, 3, 4, 5].map(week=><div 
		key={selectedYear + "." + selectedMonth + "." + week}
		className="date-picker-day-row">
			{weeks[week].map((date, i)=><label 
			key={selectedYear + "." + selectedMonth + "." + week + "." + i}
			className={date?(date===selectedDate.getDate() && selectedYear===selectedDate.getFullYear() && selectedMonth===selectedDate.getMonth()?"date-picker-selected-day": "date-picker-day"): "date-picker-null-day"}
			onClick={(e)=>onDateClick(selectedYear, selectedMonth, date)}>
				{date}
			</label>)}
		</div>)
	}
	const renderActions = () => {
		return <div className="date-picker-action-container">
			<button 
			className="date-picker-button"
			onClick={(e)=>{props.onClose()}}>
				キャンセル
			</button>
			<button 
			className="date-picker-button"
			autoFocus
			onClick={(e)=>{props.onDateChange(selectedDate)}}>
				OK
			</button>
		</div>
	}
	const renderYearSelector = () => {
		if(!yearModeEnabled) return null;
		const yearViews = [];
		for(let year=1900;year<2101;year++) {
			yearViews.push(<div 
				className="date-picker-year-item"
				onClick={(e)=>{onYearClick(year)}}>
					{year}
				</div>)
		}
		return <div className="date-picker-year-container">{yearViews}</div>;
	}
	/*** Event Handlers ***/
	const onPrevMonthOpen = () => {
		if(selectedYear===1900 && selectedMonth===0) return;
		if(selectedMonth===0){
			setSelectedYear(selectedYear-1);
			setSelectedMonth(11);
		}
		else{
			setSelectedMonth(selectedMonth-1);
		}
	}
	const onNextMonthOpen = () => {
		if(selectedYear===2100) return;
		if(selectedMonth===11){
			setSelectedYear(selectedYear+1);
			setSelectedMonth(0);
		}
		else{
			setSelectedMonth(selectedMonth+1);
		}
	}
	const onDateClick = (year, month, date) => {
		setSelectedDate(new Date(year, month, date));
	}
	
	const onYearClick = (year) => {
		if(year===2100){
			setSelectedYear(year);
			setSelectedMonth(0);
		}
		else{
			setSelectedYear(year);
		}
		setYearModeEnabled(false);
	}
	/*** Main Render ***/
	return <DialogBackground
	isOpen={props.isOpen}
	onClose={props.onClose}>
		<div className="date-picker-main-container">
			<div className="date-picker-header">
				<label 
				className={yearModeEnabled?"date-picker-selected-year-label": "date-picker-year-label"}
				onClick={(e)=>{setYearModeEnabled(true)}}>
					{selectedDate.getFullYear()}
				</label>
				<label 
				className={yearModeEnabled?"date-picker-date-label":"date-picker-selected-date-label"}
				onClick={(e)=>{setYearModeEnabled(false)}}>
					{moment(selectedDate).format(props.dateFormat)}
				</label>
			</div>
			<div className="date-picker-body">
				{renderMonthSelector()}
				{renderDayLabels()}
				{renderDates()}
				{renderYearSelector()}
				{renderActions()}
			</div>
		</div>
	</DialogBackground>
}

DatePicker.propTypes = propTypes;
DatePicker.defaultProps = defaultProps;
export default DatePicker;