import { useEffect, useRef, useState } from 'react';
import s from './MainCalendar.module.css';
import Task from './Task';
import { getHourArray, hourHeight, getDate, heightToTime } from '../util';

// http://backend.my/events?from=2022-01-01&to=2022-02-28
const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
const hourArray = getHourArray()

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
    const [taskSizing, setTaskSizing] = useState(false)
    const [taskEditing, setTaskEditing] = useState(false)

    const wrapper = useRef(null)
    const overFlow = useRef(null)

    const getDayName = (day) => {
        return days[day]
    }

    useEffect(() => {
        if (taskSizing) {
            const localNewTask = { ...newTask }
            const handler = (e) => {
                const height = e.pageY - taskSizing.taskBar.getBoundingClientRect().top
                const [hFrom, hTo] = [
                    taskSizing.fromHeight,
                    height
                ].sort((a, b) => a - b)
                localNewTask.timeFrom = heightToTime(hFrom)
                localNewTask.timeTo = heightToTime(hTo)
                if (localNewTask.timeFrom === localNewTask.timeTo) {
                    localNewTask.timeTo = heightToTime(hourHeight / 4) // число одного деления не позволяющее сдлеть таску менее 15 минут
                }
                setNewTask({ ...localNewTask })
            }
            const mouseupHandler = () => {
                const newTaskArray = [...taskArray]
                newTaskArray[taskSizing.dayIndex] = [...newTaskArray[taskSizing.dayIndex], localNewTask]
                setTaskSizing(false)
                setTaskArray(newTaskArray)
                setNewTask({})
            }
            document.addEventListener('mousemove', handler)
            document.addEventListener('mouseup', mouseupHandler)
            return () => {
                document.removeEventListener('mousemove', handler)
                document.removeEventListener('mouseup', mouseupHandler)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskSizing])

    useEffect(() => {
        setActiveDay(day)
    }, [day])

    useEffect(() => {
        setWeekArray(getWeekArray())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeDay])

    // дата формата 'yyyy-mm-dd' из объекта date

    useEffect(() => {
        const answer = [
            { id: 1, dateFrom: '2022-03-16', timeFrom: '12:00', dateTo: '2022-02-14', timeTo: '13:00', name: 'Имя события 1' },
            { id: 2, dateFrom: '2022-03-15', timeFrom: '14:00', dateTo: '2022-02-14', timeTo: '15:00', name: 'Имя события 2' },
            { id: 3, dateFrom: '2022-03-01', timeFrom: '11:00', dateTo: '2022-02-15', timeTo: '13:00', name: 'Имя события 3' },
            { id: 4, dateFrom: '2022-03-02', timeFrom: '12:00', dateTo: '2022-01-01', timeTo: '13:00', name: 'Имя события 1' },
            { id: 5, dateFrom: '2022-01-01', timeFrom: '12:00', dateTo: '2022-01-01', timeTo: '13:00', name: 'Имя события 1' },
            { id: 6, dateFrom: '2022-01-01', timeFrom: '12:00', dateTo: '2022-01-01', timeTo: '13:00', name: 'Имя события 1' },
            { id: 7, dateFrom: '2022-01-01', timeFrom: '12:00', dateTo: '2022-01-01', timeTo: '13:00', name: 'Имя события 1' },
        ]
        const newTaskArray = new Array(7)
        for (let i = 0; i < 7; i++) {
            newTaskArray[i] = []
        }
        weekArray.forEach((day, i) => {
            day = getDate(day)
            answer.forEach((task) => {
                if (task.dateFrom === day) {
                    newTaskArray[i].push(task)
                }
            })
        })
        setTaskArray(newTaskArray)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weekArray])

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
            </div>
            <div className={s.overFlow} ref={overFlow}>
                <div className={s.col_wrapper} ref={wrapper}>
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
                    {weekArray && weekArray.map((day, dayIndex) => (
                        // <div className={s.taskBar}
                        <div className={`${s.taskBar} taskBar`}
                            key={day}
                            onMouseDown={(e) => {
                                if (e.button === 0 && !taskEditing) {
                                    const hourHeight = 50
                                    const height = e.pageY - e.currentTarget.getBoundingClientRect().top
                                    const h = Math.floor(height / hourHeight)
                                    let m = Math.floor(height % hourHeight / hourHeight * 4) * 15
                                    const newTaskObj = {
                                        id: 'new',
                                        dateFrom: getDate(day),
                                        timeFrom: `${h}:${m.toString().padStart(2, '0')}`,
                                        dateTo: getDate(day),
                                        timeTo: `${h}:${(m + 15).toString().padStart(2, '0')}`,
                                        name: 'Без имени'
                                    }
                                    setNewTask(newTaskObj)
                                    setTaskSizing({ taskBar: e.currentTarget, fromHeight: height, dayIndex })
                                }
                            }}
                        >
                            {taskArray[dayIndex] && taskArray[dayIndex].map((task, taskKey) => (
                                <Task task={task}
                                    key={taskKey}
                                    heightToTime={heightToTime}
                                    dayIndex={dayIndex}
                                    taskArray={taskArray}
                                    setTaskArray={setTaskArray}
                                    taskIndex={taskKey}
                                    wrapper={wrapper.current}
                                    overFlow={overFlow.current}
                                    setTaskEditing={setTaskEditing}
                                />
                            ))}
                            {newTask && newTask.dateFrom === getDate(day) && <Task task={newTask} />}
                        </div>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default MainCalendar;
