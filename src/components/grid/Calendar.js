import React from 'react';
import PropTypes from 'prop-types';
import './Calendar.css';

const propTypes={
	dayRanges: PropTypes.array,
	onDayRangesChange: PropTypes.func,
	hourRanges: PropTypes.array,
	onHourRangesChange: PropTypes.func,

};
const defaultProps={
	dayRanges: [],
	onDayRangesChange: (newRanges)=>{},
	hourRanges: [],
	onHourRangesChange: (newRanges)=>{},

};
const DAYS = ['日', '月', '火', '水', '木', '金', '土'];
const Calendar = (props) => {
	/*** States and Variables ***/
	const [currentDate, setCurrentDate] = React.useState(new Date());
	const [selectedDate, setSelectedDate] = React.useState(currentDate);
	const [weekMode, setWeekMode] = React.useState(false);
	const [selectingRange, setSelectingRange] = React.useState(null);
	const containerRef = React.useRef(null);
	const dayRowHeightRef = React.useRef(0);
	const [dayRowHeight, setDayRowHeight] = React.useState(dayRowHeightRef.current);
	/*** Processing ***/
	React.useEffect(()=>{
		const container = containerRef.current;
		const observer = new ResizeObserver((entries)=>{
			const rowHeightVal = (container.getBoundingClientRect().height  -60)/ 6;
			if(rowHeightVal!==dayRowHeightRef.current){
				dayRowHeightRef.current = rowHeightVal;
				setDayRowHeight(rowHeightVal);
			}
		});
		observer.observe(container);
		return ()=>{
			observer.disconnect();
		}
	}, [])
	/*** Sub Components ***/
	const renderHeader = () => {
		return <div className='calendar-header'>
			<div className='calendar-header-left-content-container'>
				<button 
				onClick={(e)=>{onButtonPreviousClick()}}
				className='calendar-header-button'>
					<i className='fas fa-chevron-left' />
				</button>
				<button 
				onClick={(e)=>{onButtonNextClick()}}
				className='calendar-header-button'>
					<i className='fas fa-chevron-right' />
				</button>
				<button 
				onClick={(e)=>{onButtonTodayClick()}}
				className='calendar-header-button'>
					<label className='calendar-header-button-label'>
						今日
					</label>
				</button>
			</div>
			<label className='calendar-header-label'>
				{`${selectedDate.getFullYear()}年${selectedDate.getMonth()+1}月`}
			</label>
			<div className='calendar-header-right-content-container'>
				<button 
				onClick={(e)=>{setWeekMode(false)}}
				className={weekMode?'calendar-header-button':'calendar-header-active-button'}>
					<label className='calendar-header-button-label'>
						月
					</label>
				</button>
				<button 
				onClick={(e)=>{setWeekMode(true)}}
				className={weekMode?'calendar-header-active-button': 'calendar-header-button'}>
					<label className='calendar-header-button-label'>
						週
					</label>
				</button>
			</div>
		</div>
	}

	const renderCalendar = () => {
		return <table 
		ref={containerRef}
		className='calendar-content-container'>
			<tbody>
				{renderCalendarHeader()}
				{renderCalendarDays()}
			</tbody>
		</table>
	}

	const renderCalendarHeader = () => {
		const dayViews = [];
		if(weekMode){
			const startDate = new Date(selectedDate);
			startDate.setDate(startDate.getDate() - startDate.getDay());
			for(let i=0;i<7;i++){
				const date = new Date(startDate);
				date.setDate(date.getDate() + i);
				dayViews.push(
					<td className='calendar-day-label'>
						{`${date.getMonth()+1}/${date.getDate()}`}
					</td>
				);
			}
		}
		else {
			for(let i=0;i<7;i++){
				dayViews.push(
					<td className='calendar-day-label'>
						{DAYS[i]}
					</td>
				);
			}
		}
		return <tr className='calendar-table-row-header'>
			{dayViews}
		</tr>;
	}

	const renderCalendarDays = () => {
		if (weekMode) {
			const dayViews = [];
			const selectedMonth = selectedDate.getMonth();
			const selectedTDate = selectedDate.getDate();
			const selectedDay  = selectedDate.getDay();
			for(let i=0;i<7;i++){
				const hourViews = [];
				for (let j=0;j<24;j++){
					hourViews.push(<div 
						style={{height:(dayRowHeight*6 - 27)/24}}
						className='calendar-hour-container' />);
				}
				dayViews.push(
					<td 
					key={`month_${selectedMonth}_day_${selectedTDate - selectedDay + i}`}
					className='calendar-full-day-cell'>
						{hourViews}
					</td>
				)
			}
			return <tr className='calendar-full-day-row'>
				{dayViews}
			</tr>
		}
		let startDate = new Date(selectedDate);
		const today = new Date();
		startDate.setDate(1);
		startDate.setDate(startDate.getDate() - startDate.getDay());
		const selectedYear = selectedDate.getFullYear();
		const selectedMonth = selectedDate.getMonth();
		const thisDate = today.getDate();
		const thisMonth = today.getMonth();
		const thisYear = today.getFullYear();
		const monthView = [];
		for(let i=0;i<6;i++){
			const dayViews = [];
			for(let j=0;j<7;j++){
				const date = new Date(startDate);
				date.setDate(date.getDate() + i*7 +j);
				dayViews.push(
					<td 
					key={`${thisYear}_${thisMonth}_week${i}_day${j}`}
					className='calendar-day-value'>
						<div 
						onMouseDown={(e)=>{onMouseDownOnDay(date)}}
						onMouseEnter={(e)=>{onMouseEnterOnDay(date)}}
						onMouseUp={(e)=>{onMouseUpOnDay(date)}}
						className={date.getFullYear()===selectedYear&&date.getMonth()===selectedMonth?
							'calendar-cell-cur-month-day-value': 
							'calendar-cell-day-value'}>
							<label className={date.getFullYear()===thisYear && date.getMonth()===thisMonth && date.getDate()===thisDate?
								'calendar-cell-label-today-value': 
								'calendar-cell-label-day-value'}>
								{`${date.getDate()}日`}
							</label>
							{renderRangeCell(date)}
						</div>
					</td>
				);
			}
			monthView.push(
				<tr 
				style={{height: dayRowHeight}}
				key={`${thisYear}_${thisMonth}_week${i}`}>
					{dayViews}
				</tr>
			)
		}
		return monthView;
	}

	const renderRangeCell = (date) => {
		const dateTime = date.getTime();
		let temp;
		const rangeViews = [];
		if(props.dayRanges && props.dayRanges.length){
			for(const range of props.dayRanges){
				if(range.level>=2) break;
				const startTime = range.startTime.getTime();
				const endTime = range.endTime.getTime();
				if(dateTime<startTime || dateTime>endTime) {
					continue;
				}
				else{
					const initLen = rangeViews.length;
					for(let i=initLen;i<range.level;i++){
						rangeViews.push(<div className='calendar-range-padding' />);
					}
					if(dateTime===startTime) {
						rangeViews.push(<div className='calendar-range-start' />);
					}
					else if(dateTime===endTime) {
						rangeViews.push(<div className='calendar-range-end' />);
					}
					else {
						rangeViews.push(<div className='calendar-range-body' />);
					} 
				}
			}
		}
		if(rangeViews.length) return rangeViews;
		if(!selectingRange) return null;
		let startTime = selectingRange[0].getTime();
		let endTime = selectingRange[1].getTime();
		if(endTime<startTime) {
			temp = endTime;
			endTime = startTime;
			startTime = temp;
		}
		if(dateTime<startTime || dateTime>endTime) return null;
		if(dateTime===startTime) return <div className='calendar-selecting-range-start' />
		if(dateTime===endTime) return <div className='calendar-selecting-range-end' />
		return <div className='calendar-selecting-range-body' />
	}
	/*** Event Handlers ***/
	const onMouseDownOnDay = (date) => {
		const startDate = new Date(date);
		setSelectingRange([startDate, startDate]);
	}

	const onMouseEnterOnDay = (date) => {
		if(selectingRange){
			const endDate = new Date(date);
			setSelectingRange([selectingRange[0], endDate]);
		}
	}

	const onMouseUpOnDay = (date) => {
		const startTime = selectingRange[0].getTime();
		const endTime = selectingRange[1].getTime();
		let level = 0;
		let temp;
		for(let i=props.dayRanges.length-1;i>=0;i--){
			const range = props.dayRanges[i];
			const rangeStartTime = range.startTime.getTime();
			const rangeEndTime = range.endTime.getTime();
			if((rangeStartTime<=startTime && startTime<=rangeEndTime)||(rangeStartTime<=endTime && endTime<=rangeEndTime)){
				level = range.level+1;
				break;
			}
		}
		const newDayRanges = props.dayRanges.concat(startTime<=endTime?{
			level,
			startTime: selectingRange[0],
			endTime: selectingRange[1]
		}:{
			level,
			startTime: selectingRange[1],
			endTime: selectingRange[0]
		});
		console.log("VANVIET RANGE", newDayRanges)
		props.onDayRangesChange(newDayRanges);
		setSelectingRange(null);
	}

	const onButtonNextClick = () => {
		if(weekMode){
			const newSelectedDate = new Date(selectedDate);
			newSelectedDate.setDate(newSelectedDate.getDate()+7);
			setSelectedDate(newSelectedDate);
		}
		else {
			const newSelectedDate = new Date(selectedDate);
			newSelectedDate.setMonth(newSelectedDate.getMonth()+1);
			setSelectedDate(newSelectedDate);
		}
	}

	const onButtonTodayClick = () => {
		setSelectedDate(new Date());
	}

	const onButtonPreviousClick = () => {
		if(weekMode){
			const newSelectedDate = new Date(selectedDate);
			newSelectedDate.setDate(newSelectedDate.getDate()-7);
			setSelectedDate(newSelectedDate);
		}
		else{
			const newSelectedDate = new Date(selectedDate);
			newSelectedDate.setMonth(newSelectedDate.getMonth()-1);
			setSelectedDate(newSelectedDate);
		}
	}
	/*** Main Render ***/
	return <div className='calendar-container'
	ref={containerRef}>
		{renderHeader()}
		{renderCalendar()}
	</div>;
}
Calendar.propTypes = propTypes;
Calendar.defaultProps = defaultProps;
export default Calendar;