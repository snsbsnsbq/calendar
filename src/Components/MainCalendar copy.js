import { useEffect, useState } from 'react';
import s from './MainCalendar.module.css';
import Task from './Task';

// http://backend.my/events?from=2022-01-01&to=2022-02-28
/*
[
    { dateFrom: '2022-01-01', timeFrom: '12:00', dateTo: '2022-01-01', timeTo: '13:00', name: 'Имя события 1' },
    { dateFrom: '2022-01-01', timeFrom: '12:00', dateTo: '2022-01-01', timeTo: '13:00', name: 'Имя события 1' },
    { dateFrom: '2022-01-01', timeFrom: '12:00', dateTo: '2022-01-01', timeTo: '13:00', name: 'Имя события 1' },
    { dateFrom: '2022-01-01', timeFrom: '12:00', dateTo: '2022-01-01', timeTo: '13:00', name: 'Имя события 1' },
    { dateFrom: '2022-01-01', timeFrom: '12:00', dateTo: '2022-01-01', timeTo: '13:00', name: 'Имя события 1' },
    { dateFrom: '2022-01-01', timeFrom: '12:00', dateTo: '2022-01-01', timeTo: '13:00', name: 'Имя события 1' },
    { dateFrom: '2022-01-01', timeFrom: '12:00', dateTo: '2022-01-01', timeTo: '13:00', name: 'Имя события 1' },
]
*/

function MainCalendar({ day }) {

    const [activeDay, setActiveDay] = useState(day)
    const [weekArray, setWeekArray] = useState(null)
    const [cord, setCord] = useState(null)
    const [cordX, setCordX] = useState(null)
    const [startCord, setStartCord] = useState(null)
    const [taskArray, setTaskArray] = useState(
        [
            { date: 24, notes: [{ top: 25, height: 100, left: 0, note: 'Пустая заметка' }, { top: 300, height: 400, note: 'Пустая заметка' }] },
            { date: 25, notes: [] },
            { date: 26, notes: [] },
            { date: 27, notes: [] },
            { date: 28, notes: [] },
            { date: 29, notes: [] },
            { date: 30, notes: [] }
        ]
    )

    const updateWeekArray = () => {
        const date = new Date(activeDay)
        if (date.getDay() === 0) {
            date.setDate(date.getDate() - 6)
        }
        else {
            date.setDate(date.getDate() - date.getDay() + 1)
        }
        const weekArray = Array(7)
        for (let i = 0; i < weekArray.length; i++) {
            weekArray[i] = new Date(date)
            date.setDate(date.getDate() + 1)
        }
        setWeekArray(weekArray)
        console.log(weekArray)
    }

    const getDayName = (day) => {
        const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
        return days[day]
    }

    const hourArray = () => {
        const arr = new Array(24)
        for (let i = 0; i < arr.length; i++) {
            arr[i] = `${i}:00`
        }
        return arr
    }

    const addTask = (e, day) => {
        // const a = JSON.stringify(taskArray)
        const newTaskArray = [...taskArray]
        const cord = e.pageY - e.currentTarget.getBoundingClientRect().top
        newTaskArray[day].notes = [...newTaskArray[day].notes, { top: cord - (cord % 12.5), height: 100, note: 'Пустая заметка' }]
        // console.log(a === JSON.stringify(taskArray))
        setTaskArray([...newTaskArray])
        // переписать без мутации стейта
    }

    useEffect(() => {
        setActiveDay(day)
    }, [day])

    useEffect(() => {
        updateWeekArray()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeDay])

    return (
        <div className={s.wrapper} >
            <div className={s.header}>
                <div className={s.preCell_header}></div>
                {weekArray && weekArray.map((day, key) => (
                    <div className={s.cell} key={key}>
                        <div className={s.day}>{getDayName(day.getDay())}</div>
                        <div className={s.date}>{day.getDate()}</div>
                    </div>
                ))}
            </div >
            <div className={s.col_wrapper}>
                <div className={s.col}>
                    {hourArray().map((key) => (
                        <div className={s.border} key={key}></div>
                    ))}
                </div>
                <div className={s.precol}>
                    {hourArray().map((hour, key) => (
                        <div className={s.preCell} key={key}>{hour}</div>
                    ))}
                </div>
                {taskArray && taskArray.map((task, day) => (
                    <div className={s.taskBar}
                        key={day}
                        onClick={(e) => addTask(e, day)}
                        onMouseMove={(e) => {
                            setCord(e.pageY - e.currentTarget.getBoundingClientRect().top - startCord)
                            setCordX(Math.floor((e.pageX - 270) / e.currentTarget.getBoundingClientRect().width))
                             console.log(cord)
                        }}
                    >
                        {task && task.notes.map((note, key) => (
                            <Task note={note}
                                key={key}
                                setStartCord={setStartCord}
                                cord={cord}
                                taskArray={taskArray}
                                setTaskArray={setTaskArray}
                                day={day}
                                noteIndex={key}
                                cordX={cordX}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div >

    )
}

export default MainCalendar;
