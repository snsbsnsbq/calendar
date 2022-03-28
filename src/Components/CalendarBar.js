import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import s from './CalendarBar.module.css';

function CalendarBar() {

    //redux
    const dispatch = useDispatch()
    const day = useSelector(state => state.day)

    const firstDay = (date) => {
        const newDate = new Date(date)
        newDate.setDate(1)
        return newDate
    }

    const [monthArray, setMonthArray] = useState(null)
    const [visibleMonth, setVisibleMonth] = useState(firstDay(day))

    const changeActiveDay = (day) => {
        console.log(day)
        dispatch({ type: "SET_DAY", payload: day })
    }

    useEffect(() => {
        setVisibleMonth(firstDay(day))
    }, [day])

    const updateMonthArray = () => {
        const date = new Date(visibleMonth)
        date.setDate(1)
        if (date.getDay() === 0) {
            date.setDate(-date.getDay() + 2 - 7)
        }
        else {
            date.setDate(-date.getDay() + 2)
        }
        const monthArray = Array(42)
        for (let i = 0; i < monthArray.length; i++) {
            monthArray[i] = new Date(date)
            date.setDate(date.getDate() + 1)
        }
        setMonthArray(monthArray)
    }

    useEffect(() => {
        updateMonthArray()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visibleMonth])

    const nextMonth = () => {
        const newVisibleMonth = new Date(visibleMonth)
        newVisibleMonth.setMonth(newVisibleMonth.getMonth() + 1)
        setVisibleMonth(newVisibleMonth)
    }

    const prevMonth = () => {
        const newVisibleMonth = new Date(visibleMonth)
        newVisibleMonth.setMonth(newVisibleMonth.getMonth() - 1)
        setVisibleMonth(newVisibleMonth)
    }

    const equalDates = (a, b) => {
        return a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate()
    }

    return (
        <div className={s.calendar}>
            <div className={s.header}>
                <div>
                    {visibleMonth.toLocaleString('ru', { month: 'long' })}
                    {' '}
                    {visibleMonth.getFullYear()}
                </div>
                <div className={s.cntlArrow}>
                    <div className={s.arrow} onClick={() => prevMonth()}>&#60;</div>
                    {' '}
                    <div className={s.arrow} onClick={() => nextMonth()}>&#62;</div>
                </div>
            </div>
            <div className={s.main}>
                <div className={s.cellH}>Пн</div>
                <div className={s.cellH}>Вт</div>
                <div className={s.cellH}>Ср</div>
                <div className={s.cellH}>Чт</div>
                <div className={s.cellH}>Пт</div>
                <div className={s.cellH}>Сб</div>
                <div className={s.cellH}>Вс</div>
                {
                    monthArray && monthArray.map((thisDay, key) => (
                        <div
                            className={equalDates(thisDay, day) ? s.cellActive : (visibleMonth.getMonth() === thisDay.getMonth() ? s.cell : s.cellOpacity)}
                            key={key}
                            onClick={() => changeActiveDay(thisDay)}
                        >
                            {thisDay.getDate()}
                        </div>
                    ))
                }

            </div>
        </div >

    );
}

export default CalendarBar;
