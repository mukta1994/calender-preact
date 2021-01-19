import { html, render, useState, useCallback } from './standalone.module.js'

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const ONE_SEVENTH = 100 / 7;

function Calendar() {
	const [now, setNow] = useState(new Date())
	const [yearArr, setYear] = useState([])
	const arrYear = []
	const [dateVal, setdateVal] = useState({ currentDate: now, displayedMonth: now.getMonth(), displayedYear: now.getFullYear(), selectYearMode: false });


	for (let i = 1970; i <= now.getFullYear() + 30; i++) {
		arrYear.push(i);
	}

	const monthArrShortFull = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	]

	const monthArrShort = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	]

	const dayArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	const dayClicked = useCallback((e) => {
		const element = e.target; // the actual element clicked

		if (element.innerHTML === '') return false; // don't continue if <span /> empty

		// get date from clicked element (gets attached when rendered)
		const date = new Date(element.getAttribute('date'));

		// update the state
		setdateVal(prevState => ({
			...prevState,
			currentDate: date
		}));
	  },[dateVal.currentDate]);

	// const dayClicked = (e) => {

		
	// }

	/**
	* returns days in month as array
	* @param {number} month the month to display
	* @param {number} year the year to display
	*/
	const getDaysByMonth = (month, year) => {

		let calendar = [];

		const date = new Date(year, month, 1); // month to display

		const firstDay = new Date(year, month, 1).getDay(); // first weekday of month
		const lastDate = new Date(year, month + 1, 0).getDate(); // last date of month

		let day = 0;

		// the calendar is 7*6 fields big, so 42 loops
		for (let i = 0; i < 42; i++) {

			if (i >= firstDay && day !== null) day = day + 1;
			if (day > lastDate) day = null;

			// append the calendar Array
			calendar.push({
				day: (day === 0 || day === null) ? null : day, // null or number
				date: (day === 0 || day === null) ? null : new Date(year, month, day), // null or Date()
				today: (day === now.getDate() && month === now.getMonth() && year === now.getFullYear()) // boolean
			});
		}

		return calendar;
	}


	/**
* Display previous month by updating state
*/
	const displayPrevMonth = () => {
		if (dateVal.displayedMonth <= 0) {

			setdateVal(prevState => ({
				...prevState,
				displayedMonth: 11,
				displayedYear: dateVal.displayedYear - 1
			}));
		}
		else {
			setdateVal(prevState => ({
				...prevState,
				displayedMonth: dateVal.displayedMonth - 1
			}));
		}
	}

	/**
	* Display next month by updating state
	*/
	const displayNextMonth = () => {
		if (dateVal.displayedMonth >= 11) {

			setdateVal(prevState => ({
				...prevState,
				displayedMonth: 0,
				displayedYear: dateVal.displayedYear + 1
			}));
		}
		else {
			setdateVal(prevState => ({
				...prevState,
				displayedMonth: dateVal.displayedMonth + 1
			}));
		}
	}

	/**
	* Display the selected month (gets fired when clicking on the date string)
	*/
	const displaySelectedMonth = () => {
		if (dateVal.selectYearMode) {
			toggleYearSelector();
		}
		else {
			if (!dateVal.currentDate) return false;

			setdateVal(prevState => ({
				...prevState,
				displayedMonth: dateVal.getMonth(), displayedYear: dateVal.currentDate.getFullYear()
			}));
		}
	}

	const toggleYearSelector = () => {
		setdateVal(prevState => ({
			...prevState,
			selectYearMode: !selectYearMode
		}));
	}

	const changeDisplayedYear = (e) => {
		const element = e.target;
		toggleYearSelector();
		setdateVal(prevState => ({
			...prevState,
			displayedYear: parseInt(element.innerHTML, 10), displayedMonth: 0
		}));
	}

	const { currentDate, displayedMonth, displayedYear, selectYearMode } = dateVal;

	return html`
	<div>
			  <div class="calendar" >
		
				  <div class="calendar-header ">
					<h3 style=${{
			color: selectYearMode ? 'rgba(93, 93, 65,.87);' : 'rgba(93,93,65,.57)'
		}} onClick=${toggleYearSelector}>${currentDate.getFullYear()}</h3>
					  <h2 style=${{
			color: !selectYearMode ? 'rgba(93, 93, 65,.87)' : 'rgba(93,93,65,.57)'
		}} onClick=${displaySelectedMonth}>
			${dayArr[currentDate.getDay()]}, ${monthArrShort[currentDate.getMonth()]} ${currentDate.getDate()}
		  </h2>
				  </div>

				  ${!selectYearMode && html`<nav>
					  <span onClick=${displayPrevMonth} class="material-icons">prev</span>
					  <h4>${monthArrShortFull[displayedMonth]} ${displayedYear}</h4>
					  <span onClick=${displayNextMonth} class="material-icons">next</span>
				  </nav>`}
		
		<div class="">
		  
		  ${!selectYearMode && html`<div class="" >
			
			<div class="calendar-weekdays">
			  ${WEEK_DAYS.map(day => html`<span>${day}</span>`)}
			</div>
			
			<div onClick=${dayClicked} class="calendar-dates">
			  
			  ${getDaysByMonth(dateVal.displayedMonth, dateVal.displayedYear)
				.map(
					day => {
						let selected = false;

						if (currentDate && day.date) selected = (currentDate.toLocaleDateString() === day.date.toLocaleDateString());

						return html`<span
					  class=${(day.today ? ' date-today ' : '') + (selected ? 'date-selected date' : 'date')}
					  disabled=${!day.date}
					  date=${day.date}
					 >
					  ${day.day}
					</span>`
					}
				)
			}
			  
			</div>
			
		  </div>`}
		  
		  ${selectYearMode && html`<div class="">
			
			${yearArr.map(year => html`
			  <span class=${(year === displayedYear) ? 'selected' : ''} onClick=${changeDisplayedYear}>
				${year}
			  </span>
			`)}
			
		  </div>`}
		  
		</div>
	 </div>	  
 </div>
  `
}


/**
 * 	

 * @param {HTMLElement} container
 * @param {Function} callback
 * @param {Date} [date]
 */
export default (
	container
) => render(
	html`
		<${Calendar}
		/>
	`,
	container
);





