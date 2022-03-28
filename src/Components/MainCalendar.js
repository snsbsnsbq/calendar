import { useEffect, useRef, useState } from 'react';
import s from './MainCalendar.module.css';
import Task from './Task';
import TimeArrow from './TimeArrow';
import { getHourArray, hourHeight, getDate, heightToTime, getDayIndex, getDayOffName } from '../util';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// http://backend.my/events?from=2022-01-01&to=2022-02-28
const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
const hourArray = getHourArray()
// { id: 2, dateFrom: '2022-03-22', timeFrom: '14:00', dateTo: '2022-02-14', timeTo: '15:00', name: 'Имя события 2', color: 'fuchsia' }
const getResponse = () => {
    const response = localStorage.getItem('response')
    if (response) {
        return JSON.parse(response)
    }
    return []
}
const getIdCounter = () => {
    const idCounter = localStorage.getItem('idCounter')
    if (idCounter) {
        return JSON.parse(idCounter)
    }
    return 0
}

function MainCalendar() {

    //redux
    const dispatch = useDispatch()
    const day = useSelector(state => state.day)
    const response = useSelector(state => state.response)
    const idCounter = useSelector(state => state.idCounter)

    // выгрузка response из localStorage
    useEffect(() => {
        dispatch({ type: "SET_RESPONSE", payload: getResponse() })
    }, [])

    useEffect(() => {
        dispatch({ type: "SET_ID_COUNTER", payload: getIdCounter() })
    }, [])


    // добавление заметки заметки
    const addTask = (task) => {
        const newResponse = [...response, task]
        dispatch({ type: "SET_RESPONSE", payload: newResponse })
        localStorage.setItem('response', JSON.stringify(newResponse))
    }
    // удаление заметки
    const deleteTask = (id, regularTaskUpdateStatus) => {
        let newResponse = [...response]
        const index = newResponse.findIndex(x => x.id === id)
        const taskToDel = newResponse[index]
        // проверка на повторяемость заметки
        if (!("periodGroupId" in taskToDel) || regularTaskUpdateStatus === 'thisTask') {
            newResponse = [...response]
            newResponse.splice(index, 1)
        }
        else {
            // удаление всех повторяющихся заметок
            if (regularTaskUpdateStatus === 'allTasks') {
                newResponse = newResponse.filter((iterableTask) => iterableTask.periodGroupId !== taskToDel.periodGroupId)
            }
            // удаление будущих повторяющихся заметок
            else if (regularTaskUpdateStatus === 'futureTasks') {
                const [year, month, day] = taskToDel.dateFrom.split('-')
                const dateFromPeriod = new Date(year, month - 1, day)
                newResponse = response.filter((iterableTask) => {
                    const [year, month, day] = iterableTask.dateFrom.split('-')
                    const dateFromIterableTask = new Date(year, month - 1, day)
                    console.log(iterableTask.periodGroupId)
                    return iterableTask.periodGroupId !== taskToDel.periodGroupId || dateFromIterableTask < dateFromPeriod
                })
            }
        }
        dispatch({ type: "SET_RESPONSE", payload: newResponse })
        localStorage.setItem('response', JSON.stringify(newResponse))
        setWeekArray([...weekArray]) // принудительное обновлнения weekArray для обновления taskArray
    }
    // изменение заметки
    const updateTask = (task, regularTaskUpdateStatus) => {
        const newResponse = [...response]
        const index = response.findIndex(x => x.id === task.id)
        // проверка на повторяемость заметки
        if (!("periodGroupId" in newResponse[index])) {
            newResponse[index] = task
        }
        else {
            if (regularTaskUpdateStatus === 'allTasks') { // изменение всех повторяющихся заметок
                let dayDifference = false
                if (response[index].dateFrom !== task.dateFrom) { // проверка на изменение дня в заметке
                    let [year, month, day] = response[index].dateFrom.split('-')
                    const oldDate = new Date(year, month - 1, day)
                    const [newYear, newMonth, newDay] = task.dateFrom.split('-')
                    const newDate = new Date(newYear, newMonth - 1, newDay)
                    console.log(newDate.getDay() - oldDate.getDay())
                    dayDifference = newDate.getDay() - oldDate.getDay()
                }
                for (let iterableTask of newResponse) {
                    let dateFrom = null
                    let dateTo = null
                    if (dayDifference) {
                        let [dateFromYear, dateFromMonth, dateFromDay] = iterableTask.dateFrom.split('-')
                        dateFrom = new Date(dateFromYear, dateFromMonth - 1, dateFromDay)
                        dateFrom.setDate(dateFrom.getDate() + dayDifference)
                        let [dateToYear, dateToMonth, dateToDay] = iterableTask.dateTo.split('-')
                        dateTo = new Date(dateToYear, dateToMonth - 1, dateToDay)
                        dateTo.setDate(dateTo.getDate() + dayDifference)
                        dateFrom = getDate(dateFrom)  // дата формата 'yyyy-mm-dd' из объекта date
                        dateTo = getDate(dateTo)
                    }
                    if (iterableTask.periodGroupId === task.periodGroupId) {
                        newResponse[newResponse.indexOf(iterableTask)] = {
                            ...iterableTask,
                            timeFrom: task.timeFrom,
                            timeTo: task.timeTo,
                            name: task.name,
                            color: task.color,
                            dateFrom: dayDifference ? dateFrom : iterableTask.dateFrom,
                            dateTo: dayDifference ? dateTo : iterableTask.dateTo
                        }
                    }
                }
            }
            // изменение будущих повторяющихся заметок
            else if (regularTaskUpdateStatus === 'futureTasks') {
                const [year, month, day] = newResponse[index].dateFrom.split('-')
                const dateFromPeriod = new Date(year, month - 1, day)
                let dayDifference = false
                if (response[index].dateFrom !== task.dateFrom) { // проверка на изменение дня в заметке
                    let [year, month, day] = response[index].dateFrom.split('-')
                    const oldDate = new Date(year, month - 1, day)
                    const [newYear, newMonth, newDay] = task.dateFrom.split('-')
                    const newDate = new Date(newYear, newMonth - 1, newDay)
                    console.log(newDate.getDay() - oldDate.getDay())
                    dayDifference = newDate.getDay() - oldDate.getDay()
                }
                for (let iterableTask of newResponse) {
                    const [year, month, day] = iterableTask.dateFrom.split('-')
                    const dateFromIterableTask = new Date(year, month - 1, day)
                    let dateFrom = null
                    let dateTo = null
                    if (dayDifference) {
                        let [dateFromYear, dateFromMonth, dateFromDay] = iterableTask.dateFrom.split('-')
                        dateFrom = new Date(dateFromYear, dateFromMonth - 1, dateFromDay)
                        dateFrom.setDate(dateFrom.getDate() + dayDifference)
                        let [dateToYear, dateToMonth, dateToDay] = iterableTask.dateTo.split('-')
                        dateTo = new Date(dateToYear, dateToMonth - 1, dateToDay)
                        dateTo.setDate(dateTo.getDate() + dayDifference)
                        dateFrom = getDate(dateFrom)  // дата формата 'yyyy-mm-dd' из объекта date
                        dateTo = getDate(dateTo)
                    }
                    // проверки id группы повторяющихся заметок и дат
                    if (iterableTask.periodGroupId === task.periodGroupId && dateFromIterableTask >= dateFromPeriod) {
                        newResponse[newResponse.indexOf(iterableTask)] = {
                            ...iterableTask,
                            timeFrom: task.timeFrom,
                            timeTo: task.timeTo,
                            name: task.name,
                            color: task.color,
                            dateFrom: dayDifference ? dateFrom : iterableTask.dateFrom,
                            dateTo: dayDifference ? dateTo : iterableTask.dateTo
                        }
                    }
                    else if (iterableTask.periodGroupId === task.periodGroupId && dateFromIterableTask < dateFromPeriod) {
                        // delete iterableTask.periodGroupId
                        newResponse[newResponse.indexOf(iterableTask)] = {
                            ...iterableTask,
                        }
                    }
                }
            }

            else if (regularTaskUpdateStatus === 'thisTask') {
                // delete task.periodGroupId
                newResponse[index] = task
            }
        }
        dispatch({ type: "SET_RESPONSE", payload: newResponse })
        localStorage.setItem('response', JSON.stringify(newResponse))
        setWeekArray([...weekArray]) // принудительное обновлнения weekArray для обновления taskArray
    }
    // Создание регулярных заметок
    const makeTaskRegular = (id, period) => {
        let newResponse = [...response]
        let i
        newResponse.forEach((t) => {
            if (t.id === id) {
                i = t
            }
        })
        const index = newResponse.indexOf(i)
        newResponse[index].periodGroupId = new Date()
        const [year, month, day] = newResponse[index].dateFrom.split('-')
        const dateFromPeriod = new Date(year, month - 1, day)
        const dateToPeriod = new Date(dateFromPeriod)
        dateToPeriod.setDate(dateFromPeriod.getDate() + 364) // добавление года
        let newIdCounter = idCounter + 1
        while (dateFromPeriod <= dateToPeriod) {
            dateFromPeriod.setDate(dateFromPeriod.getDate() + period)
            newResponse = [...newResponse, { ...newResponse[index], dateFrom: getDate(dateFromPeriod), dateTo: getDate(dateFromPeriod), id: newIdCounter }]
            newIdCounter++
        }
        // setIdCounter(newIdCounter)
        dispatch({ type: "SET_ID_COUNTER", payload: newIdCounter })
        dispatch({ type: "SET_RESPONSE", payload: newResponse })
        localStorage.setItem('response', JSON.stringify(newResponse))
        setWeekArray([...weekArray]) // исскуственное обновлнения weekArray для обновления taskArray
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    //перенести в utils
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
    const [dayOffArray, setDayOffArray] = useState(false)

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
                    localNewTask.timeTo = heightToTime(hourHeight / 4) // число одного деления не позволяющее сделеть таску менее 15 минут
                }
                setNewTask({ ...localNewTask })
            }
            const mouseupHandler = () => {
                const newTaskArray = [...taskArray]
                newTaskArray[taskSizing.dayIndex] = [...newTaskArray[taskSizing.dayIndex], localNewTask]
                setTaskSizing(false)
                setTaskArray(newTaskArray)
                addTask(localNewTask)
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

    //сохранение счётчика в localTask
    useEffect(() => {
        localStorage.setItem('idCounter', JSON.stringify(idCounter))
    }, [idCounter])

    useEffect(() => {
        const newTaskArray = new Array(7)
        for (let i = 0; i < 7; i++) {
            newTaskArray[i] = []
        }
        weekArray.forEach((day, i) => {
            day = getDate(day)
            response.forEach((task) => {
                if (task.dateFrom === day) {
                    newTaskArray[i].push(task)
                }
            })
        })
        setTaskArray(newTaskArray)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weekArray])

// запрос производственного календаря
    useEffect(() => {
        const periodFrom = `${weekArray[0].getFullYear()}${String(weekArray[0].getMonth() + 1).padStart(2, '0')}${String(weekArray[0].getDate()).padStart(2, '0')}`
        const periodTo = `${weekArray[6].getFullYear()}${String(weekArray[6].getMonth() + 1).padStart(2, '0')}${String(weekArray[6].getDate()).padStart(2, '0')}`
        axios.get(`https://isdayoff.ru/api/getdata?date1=${periodFrom}&date2=${periodTo}`).then((res) => {
            setDayOffArray(String(res.data).split(''))
        }).catch((err) => {
            setDayOffArray(false)
            console.log(err)
        })
    }, [day])

    return (
        <div className={s.wrapper} >
            <div className={s.header}>
                <div className={s.preCell_header}></div>
                {weekArray && weekArray.map((thisDay, key) => (
                    <div className={s.cell} key={key}>
                        <div className={s.day} style={getDate(thisDay) === getDate(new Date()) ? { color: 'blue' } : {}}>{getDayName(thisDay.getDay())}</div>
                        <div className="d-flex jc-center">
                            <div className={`${s.date} + ${getDate(thisDay) === getDate(new Date()) ? s['date-active'] : ''}`}>
                                {thisDay.getDate()}
                            </div>
                        </div>
                        <div className={s.dayOff}
                            style={dayOffArray[key] === '1' ? { background: 'green' } : {}}>
                            {dayOffArray[key] === '1' ? getDayOffName(thisDay) : ''}
                        </div>
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
                        <div className={`${s.taskBar} taskBar`}
                            key={day}
                            onMouseDown={(e) => {
                                if (e.button === 0 && !taskEditing) {
                                    const hourHeight = 50
                                    const height = e.pageY - e.currentTarget.getBoundingClientRect().top
                                    const h = Math.floor(height / hourHeight)
                                    let m = Math.floor(height % hourHeight / hourHeight * 4) * 15
                                    const newTaskObj = {
                                        id: idCounter + 1,
                                        dateFrom: getDate(day),
                                        timeFrom: `${h}:${m.toString().padStart(2, '0')}`,
                                        dateTo: getDate(day),
                                        timeTo: `${h}:${(m + 15).toString().padStart(2, '0')}`,
                                        name: 'Без имени',
                                        color: 'fuchsia'
                                    }
                                    dispatch({ type: "SET_ID_COUNTER", payload: idCounter + 1 })
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
                                    taskEditing={taskEditing}
                                    setTaskEditing={setTaskEditing}
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                    makeTaskRegular={makeTaskRegular}
                                />

                            ))}
                            {getDayIndex(new Date()) === dayIndex && < TimeArrow />}
                            {newTask && newTask.dateFrom === getDate(day) && <Task task={newTask} />}
                        </div>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default MainCalendar;
