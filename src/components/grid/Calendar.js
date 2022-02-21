import React from 'react';
import PropTypes from 'prop-types';
import './Calendar.css';

const propTypes={
	ranges: PropTypes.array,
	onRangesChange: PropTypes.func
};
const defaultProps={
	ranges: [],
	onRanges: (newRanges)=>{},
};
const DAYS = ['日', '月', '火', '水', '木', '金', '土'];
const Calendar = (props) => {
	/*** States and Variables ***/
	const [currentDate, setCurrentDate] = React.useState(new Date());
	const [selectedDate, setSelectedDate] = React.useState(currentDate);
	const [weekMode, setWeekMode] = React.useState(false);
	const [selectingRange, setSelectingRange] = React.useState(null);
	/*** Processing ***/
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
		return <table className='calendar-content-container'>
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
						{`${date.getMonth()+1}月${date.getDate()}日`}
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
		return <tr>
			{dayViews}
		</tr>;
	}
	const renderCalendarDays = () => {
		if (weekMode) {
			const dayViews = [];

			for(let j=0;j<7;j++){
				dayViews.push(
					<td className='calendar-full-day-cell'>

					</td>
				)
			}
			return <tr>
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
				<tr key={`${thisYear}_${thisMonth}_week${i}`}>
					{dayViews}
				</tr>
			)
		}
		return monthView;
	}
	const renderRangeCell = (date) => {
		const dateTime = date.getTime();
		let temp;
		if(props.ranges && props.ranges.length){
			for(const range of props.ranges){
				let startTime = range[0].getTime();
				let endTime = range[1].getTime();
				if(endTime<startTime) {
					temp = endTime;
					endTime = startTime;
					startTime = temp;
				}
				if(dateTime<startTime || dateTime>endTime) continue;
				if(dateTime===startTime) return <div className='calendar-range-start' />
				if(dateTime===endTime) return <div className='calendar-range-end' />
				return <div className='calendar-range-body' />
			}
		}
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
		setSelectingRange(null);
		props.onRangesChange([selectingRange]);
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
	return <div className='calendar-container'>
		{renderHeader()}
		{renderCalendar()}
	</div>;
}
Calendar.propTypes = propTypes;
Calendar.defaultProps = defaultProps;
export default Calendar;