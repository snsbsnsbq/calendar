import { useEffect, useState } from 'react';
import s from './MainCalendar.module.css';
import Task from './Task';

// http://backend.my/events?from=2022-01-01&to=2022-02-28

function MainCalendar({ day }) {
    // eslint-disable-next-line react-hooks/exhaustive-deps

    const getWeekArray = () => {
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
        return weekArray
    }

    const [activeDay, setActiveDay] = useState(day)
    const [weekArray, setWeekArray] = useState(getWeekArray)
    const [taskArray, setTaskArray] = useState([])
    const [newTask, setNewTask] = useState({})
    // const [cord, setCord] = useState(null)
    // const [cordX, setCordX] = useState(null)
    // const [startCord, setStartCord] = useState(null)

    const getDayName = (day) => {
        const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
        return days[day]
    }

    const hourArray = (() => {
        const arr = new Array(24)
        for (let i = 0; i < arr.length; i++) {
            arr[i] = `${i}:00`
        }
        return arr
    })()

    // const addTask = (e, day) => {
    //     // const a = JSON.stringify(taskArray)
    //     const newTaskArray = [...taskArray]
    //     const cord = e.pageY - e.currentTarget.getBoundingClientRect().top
    //     newTaskArray[day].notes = [...newTaskArray[day].notes, { top: cord - (cord % 12.5), height: 100, note: 'Пустая заметка' }]
    //     // console.log(a === JSON.stringify(taskArray))
    //     setTaskArray([...newTaskArray])
    //     // переписать без мутации стейта
    // }

    useEffect(() => {
        setActiveDay(day)
    }, [day])

    useEffect(() => {
        setWeekArray(getWeekArray())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeDay])

    useEffect(() => {
        const answer = [
            // { id: 1, dateFrom: '2022-02-14', timeFrom: '12:00', dateTo: '2022-02-14', timeTo: '13:00', name: 'Имя события 1' },
            // { id: 2, dateFrom: '2022-02-14', timeFrom: '14:00', dateTo: '2022-02-14', timeTo: '15:00', name: 'Имя события 2' },
            // { id: 3, dateFrom: '2022-02-15', timeFrom: '11:00', dateTo: '2022-02-15', timeTo: '13:00', name: 'Имя события 3' },
            // { id: 4, dateFrom: '2022-02-21', timeFrom: '12:00', dateTo: '2022-01-01', timeTo: '13:00', name: 'Имя события 1' },
            // { id: 5, dateFrom: '2022-01-01', timeFrom: '12:00', dateTo: '2022-01-01', timeTo: '13:00', name: 'Имя события 1' },
            // { id: 6, dateFrom: '2022-01-01', timeFrom: '12:00', dateTo: '2022-01-01', timeTo: '13:00', name: 'Имя события 1' },
            // { id: 7, dateFrom: '2022-01-01', timeFrom: '12:00', dateTo: '2022-01-01', timeTo: '13:00', name: 'Имя события 1' },
            { id: 8, dateFrom: '2022-02-15', timeFrom: '12:00', dateTo: '2022-02-15', timeTo: '12:15', name: 'Имя события 1' },
            { id: 9, dateFrom: '2022-02-15', timeFrom: '12:15', dateTo: '2022-02-15', timeTo: '12:30', name: 'Имя события 1' },
            { id: 10, dateFrom: '2022-02-15', timeFrom: '12:30', dateTo: '2022-02-15', timeTo: '12:45', name: 'Имя события 1' },
            { id: 11, dateFrom: '2022-02-15', timeFrom: '12:45', dateTo: '2022-02-15', timeTo: '13:00', name: 'Имя события 1' },
        ]
        const newTaskArray = new Array(7).fill([])
        weekArray.forEach((day, key) => {
            day = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
            answer.forEach((task) => {
                if (task.dateFrom === day) {
                    //  newTaskArray[key].push(task) // почему такое поведение?
                    newTaskArray[key] = [...newTaskArray[key], task]
                }
            })
        })
        setTaskArray(newTaskArray)

    }, [])

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
                    {hourArray.map((key) => (
                        <div className={s.border} key={key}></div>
                    ))}
                </div>
                <div className={s.precol}>
                    {hourArray.map((hour, key) => (
                        <div className={s.preCell} key={key}>{hour}</div>
                    ))}
                </div>
                {weekArray && weekArray.map((day, key) => (
                    <div className={s.taskBar}
                        key={day}
                        onMouseDown={(e) => {
                            console.log(e.pageY - e.currentTarget.getBoundingClientRect().top - (e.pageY - e.currentTarget.getBoundingClientRect().top) % 12.5)
                                setNewTask({})
                        }}
                    >
                        {taskArray[key] && taskArray[key].map((task, taskKey) => (
                            <Task task={task} key={taskKey} />
                        ))}
                        {newTask && <Task task={newTask} />}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MainCalendar;
