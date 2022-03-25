import { useRef } from 'react';
import { useEffect, useState } from 'react/cjs/react.development';
import s from './Task.module.css';
import TaskControlModalWindow from './TaskControlModalWindow';
import { hourHeight, heightToTime, timeToPixels, getDate } from '../util'
import { useDispatch, useSelector } from "react-redux";
import Modal from './Modal';

function Task({ task, dayIndex, taskArray, setTaskArray, taskIndex, wrapper,
    overFlow, setTaskEditing, deleteTask, updateTask, makeTaskRegular }) {
    //redux
    const dispatch = useDispatch()
    const showTaskControlModalWindow = useSelector(state => state.showTaskControlModalWindow)
    // hooks
    const [localTask, setLocalTask] = useState({ ...task })
    const [movable, setMovable] = useState(false)
    const [moveIndent, setMoveIndent] = useState() // отступ при перемещении по вертикали
    const [dragable, setDragable] = useState(false)
    const [pageX, setPageX] = useState(0)
    const [inputAvailable, setInputAvailable] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [taskControlModalWindowCords, setTaskControlModalWindowCords] = useState({})
    const [regularVisible, setRegularVisible] = useState(false) // видимость режима выбора регулярной заметки
    const [regularTaskUpdateStatus, setRegularTaskUpdateStatus] = useState('thisTask')
    const [editedRegularTask, setEditedRegularTask] = useState() // редактирование постоянной заметки
    const [deletedRegularTaskId, setDeletedRegularTaskId] = useState() // удаление постоянной заметки

    const input = useRef(null)

    //обновление от глобального стейта
    useEffect(() => {
        setLocalTask(task)
    }, [task])

    // эффект перемещения заметки
    useEffect(() => {
        if (movable) {
            const newLocalTask = { ...localTask }
            let taskBarEndIndex = dayIndex
            const handler = (e) => {
                const taskBarWidth = (wrapper.getBoundingClientRect().width - 60) / 7
                const mousePosition = Math.min(
                    Math.max(
                        Math.floor((e.pageX - wrapper.offsetLeft - 60) / taskBarWidth),
                        0
                    ),
                    6
                )
                setPageX(taskBarWidth * mousePosition - taskBarWidth * dayIndex)
                taskBarEndIndex = mousePosition
                const height = e.pageY - wrapper.getBoundingClientRect().top
                if (e.pageY < 100) {
                    overFlow.scrollBy(0, -10)
                }
                else if (overFlow.getBoundingClientRect().bottom - e.pageY < 10) {
                    overFlow.scrollBy(0, 10)
                }
                if (timeToPixels(heightToTime(height - moveIndent)) >= 1200) {
                    newLocalTask.timeFrom = '23:45'
                }
                else if (timeToPixels(heightToTime(height - moveIndent)) <= 0) {
                    newLocalTask.timeFrom = '00:00'
                }
                else {
                    newLocalTask.timeFrom = heightToTime(height - moveIndent)
                }

                if (timeToPixels(heightToTime(height + (timeToPixels(localTask.timeTo) - timeToPixels(localTask.timeFrom)) - moveIndent)) >= 1200) {
                    newLocalTask.timeTo = '23:59'
                }
                else if (timeToPixels(heightToTime(height + (timeToPixels(localTask.timeTo) - timeToPixels(localTask.timeFrom)) - moveIndent)) <= 0) {
                    newLocalTask.timeTo = '00:15'
                }
                else {
                    newLocalTask.timeTo = heightToTime(height + (timeToPixels(localTask.timeTo) - timeToPixels(localTask.timeFrom)) - moveIndent)
                }
                setLocalTask({ ...newLocalTask })
            }
            const mouseupHandler = () => {
                // проверка наличия изменений в заметке
                if (newLocalTask.timeFrom !== taskArray[dayIndex][taskIndex].timeFrom ||
                    newLocalTask.timeTo !== taskArray[dayIndex][taskIndex].timeTo ||
                    taskBarEndIndex !== dayIndex) {
                    const newTaskArray = [...taskArray]
                    /// Изменения 

                    if (taskBarEndIndex !== dayIndex) { // функционал переноса заметки на другую дату
                       // newTaskArray[dayIndex].splice(taskIndex, 1) // удаление заметки из массива данного дня
                        const days = taskBarEndIndex - dayIndex // количетсво дней с текущей даты 
                        const [year, month, day] = newLocalTask.dateFrom.split('-') // получения массива [гггг, мм, дд]
                        const newDate = new Date(year, month - 1, day) //получение обекта date из текущей даты
                        newDate.setDate(newDate.getDate() + days) // получение новой даты для заметки
                        newLocalTask.dateFrom = getDate(newDate)  // дата формата 'yyyy-mm-dd' из объекта date
                        newLocalTask.dateTo = getDate(newDate)  // дата формата 'yyyy-mm-dd' из объекта date
                       // newTaskArray[taskBarEndIndex].push(newLocalTask) // пуш новой заметки в необходимую дату
                    }
                    // проверка на повторяющееся мероприятие
                    if (!("periodGroupId" in newLocalTask)) {
                        updateTask(newLocalTask)
                        // setTaskArray(newTaskArray)
                    }
                    else {
                        setEditedRegularTask(newLocalTask)
                    }
                }
                setMovable(false)
                setMoveIndent()
                setPageX(0)
            }
            document.addEventListener('mousemove', handler)
            document.addEventListener('mouseup', mouseupHandler)
            return () => {
                document.removeEventListener('mousemove', handler)
                document.removeEventListener('mouseup', mouseupHandler)
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movable])

    useEffect(() => {
        if (dragable) {
            const newLocalTask = { ...localTask }
            const handler = (e) => {
                const height = e.pageY - wrapper.getBoundingClientRect().top
                if (newLocalTask.timeFrom !== heightToTime(height)) { // проверка, что таска не равна 0 минутам
                    newLocalTask.timeTo = heightToTime(height)
                }
                else {
                    newLocalTask.timeTo = heightToTime(height + hourHeight / 4)
                }

                setLocalTask({ ...newLocalTask })
            }
            const mouseupHandler = (e) => {
                // проверка наличия изменений в заметке
                if (newLocalTask.timeTo !== taskArray[dayIndex][taskIndex].timeTo) {
                    const newTaskArray = [...taskArray]
                    newTaskArray[dayIndex] = [...newTaskArray[dayIndex]]
                    newTaskArray[dayIndex][taskIndex] = newLocalTask
                    // проверка на повторяемость заметки
                    if (!("periodGroupId" in newLocalTask)) {
                        updateTask(newLocalTask)
                        // setTaskArray(newTaskArray)
                    }
                    else {
                        setEditedRegularTask(newLocalTask)
                    }
                }
                setDragable(false)
            }
            document.addEventListener('mousemove', handler)
            document.addEventListener('mouseup', mouseupHandler)
            return () => {
                document.removeEventListener('mousemove', handler)
                document.removeEventListener('mouseup', mouseupHandler)
            }
        }
    }, [dragable])

    // сбрасывает действия связанные 
    const mousedown = () => {
        // setLocalTask(task) // убрать
        dispatch({ type: "SET_TASK_CONTROL_MODAL_WINDOW", payload: false })
        setTaskEditing(false)
        setRegularVisible(false) // убирает экран выбора регулярности
    }

    // Запрет на выполнение действий при открытом окне редактирования
    useEffect(() => {
        if (showTaskControlModalWindow) {
            setTaskEditing(true)
            document.addEventListener('mousedown', mousedown)
            return () => document.removeEventListener('mousedown', mousedown)
        }
    }, [showTaskControlModalWindow, setTaskEditing])

    const enterHandler = (key) => {
        if (key === "Enter") {
            const newLocalTask = { ...localTask }
            if (inputValue === '') {
                newLocalTask.name = 'Без имени'
            }
            else {
                newLocalTask.name = inputValue
            }
            if (newLocalTask.name !== task.name) {
                const newTaskArray = [...taskArray]
                newTaskArray[dayIndex] = [...newTaskArray[dayIndex]]
                newTaskArray[dayIndex][taskIndex] = newLocalTask
                if (!("periodGroupId" in newLocalTask)) {
                    //setTaskArray(newTaskArray)
                    updateTask(newLocalTask)
                }
                else {
                    setEditedRegularTask(newLocalTask)
                }
            }
            setInputAvailable(false)
            setTaskEditing(false)
        }
    }
    const onblurHandler = () => {
        const newLocalTask = { ...localTask }
        if (inputValue === '') {
            newLocalTask.name = 'Без имени'
        }
        else {
            newLocalTask.name = inputValue
        }
        if (newLocalTask.name !== task.name) {
            const newTaskArray = [...taskArray]
            newTaskArray[dayIndex] = [...newTaskArray[dayIndex]]
            newTaskArray[dayIndex][taskIndex] = newLocalTask
            if (!("periodGroupId" in newLocalTask)) {
                //   setTaskArray(newTaskArray)
                updateTask(newLocalTask)
            }
            else {
                setEditedRegularTask(newLocalTask)
            }
        }
        setInputAvailable(false)
        setTaskEditing(false)
    }

    const deleteTaskHandler = (e) => {
        e.stopPropagation()
        const id = taskArray[dayIndex][taskIndex].id
        // const newTaskArray = [...taskArray]
        // newTaskArray[dayIndex].splice(taskIndex, 1)
        //  setTaskArray(newTaskArray)
        if (!("periodGroupId" in taskArray[dayIndex][taskIndex])) {
            deleteTask(id)
        }
        else {
            setDeletedRegularTaskId(id)
        }
        setTaskEditing(false)
    }

    const showTtaskControlModalWindowCords = (e) => {
        e.preventDefault()
        dispatch({ type: "SET_TASK_CONTROL_MODAL_WINDOW", payload: task })
        const pageX = e.pageX - e.target.getBoundingClientRect().left
        const pageY = e.pageY - wrapper.getBoundingClientRect().top
        setTaskControlModalWindowCords({ pageX, pageY })
    }

    const taskColorChange = (color) => {
        if (localTask.color !== color) {
            const newLocalTask = { ...localTask }
            newLocalTask.color = color
            const newTaskArray = [...taskArray]
            newTaskArray[dayIndex] = [...newTaskArray[dayIndex]]
            newTaskArray[dayIndex][taskIndex] = newLocalTask
            if (!("periodGroupId" in newLocalTask)) {
                // setTaskArray(newTaskArray)
                updateTask(newLocalTask)
            }
            else {
                setEditedRegularTask(newLocalTask)
            }
        }
        dispatch({ type: "SET_TASK_CONTROL_MODAL_WINDOW", payload: false })
        setTaskEditing(false)
    }

    const top = timeToPixels(localTask.timeFrom)
    const height = timeToPixels(localTask.timeTo) - top

    return (
        <>
            <div className={s.task}
                style={{ height, top, left: pageX, background: localTask.color }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => {
                    mousedown()
                    e.stopPropagation()
                    if (!inputAvailable && e.button === 0) {
                        setMoveIndent(e.pageY - e.target.getBoundingClientRect().top)
                        setMovable(true)
                    }
                }
                }
                onDoubleClick={() => {
                    setInputAvailable(true)
                    setTaskEditing(true)
                    setInputValue(task.name)
                }}
                onContextMenu={(e) => {
                    setLocalTask(task)
                    showTtaskControlModalWindowCords(e)
                }}
            >
                {inputAvailable
                    ? <input
                        style={{ width: '95%', border: 'none' }}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => enterHandler(e.key)}
                        onBlur={onblurHandler}
                        ref={input}
                        autoFocus
                    />
                    : task.name}
                <div className={s.taskBorder}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => {
                        e.stopPropagation()
                        setDragable(true)
                    }}
                ></div>
            </div>
            {(showTaskControlModalWindow.id === task.id) && <TaskControlModalWindow
                taskControlModalWindowCords={taskControlModalWindowCords}
                taskArray={taskArray}
                dayIndex={dayIndex}
                taskIndex={taskIndex}
                setTaskArray={setTaskArray}
                setTaskEditing={setTaskEditing}
                taskColorChange={taskColorChange}
                localTask={localTask}
                deleteTask={deleteTask}
                regularVisible={regularVisible}
                setRegularVisible={setRegularVisible}
                makeTaskRegular={makeTaskRegular}
                regularTaskUpdateStatus={regularTaskUpdateStatus}
                setRegularTaskUpdateStatus={setRegularTaskUpdateStatus}
                updateTask={updateTask}
                deleteTaskHandler={deleteTaskHandler}
            />}

            {(editedRegularTask || deletedRegularTaskId) && <Modal>
                <div style={{ marginTop: '30px' }}>
                    <h2 style={{ textAlign: 'center' }}>{editedRegularTask ? 'Изменение' : 'Удаление'} повторяющегося мероприятия</h2>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div>
                            <div style={{ cursor: 'pointer' }} onClick={() => setRegularTaskUpdateStatus('thisTask')}>
                                <input type="radio" name='type' checked={"thisTask" === regularTaskUpdateStatus} readOnly />Только это мероприятие
                            </div>
                            <div style={{ cursor: 'pointer' }} onClick={() => setRegularTaskUpdateStatus('futureTasks')}>
                                <input type="radio" name='type' checked={'futureTasks' === regularTaskUpdateStatus} readOnly />Это и последующие мероприятия
                            </div>
                            <div style={{ cursor: 'pointer' }} onClick={() => setRegularTaskUpdateStatus('allTasks')}>
                                <input type="radio" name='type' checked={'allTasks' === regularTaskUpdateStatus} readOnly />Все мероприятия
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <div style={{ margin: '20px', cursor: 'pointer' }} onClick={() => {
                                    setRegularTaskUpdateStatus('thisTask')
                                    setEditedRegularTask()
                                    setLocalTask(task)
                                }}>
                                    Отмена
                                </div>
                                <div style={{ margin: '20px', cursor: 'pointer' }}
                                    onClick={() => {
                                        if (editedRegularTask) {
                                            updateTask(editedRegularTask, regularTaskUpdateStatus)
                                            setEditedRegularTask()

                                        }
                                        if (deletedRegularTaskId) {
                                            deleteTask(deletedRegularTaskId, regularTaskUpdateStatus)
                                            setDeletedRegularTaskId()

                                        }
                                        setRegularTaskUpdateStatus('thisTask')
                                    }}>
                                    Ок
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </Modal>}
        </>
    )
}
export default Task;
