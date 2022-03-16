import { useRef } from 'react';
import { useEffect, useState } from 'react/cjs/react.development';
import s from './Task.module.css';

function Task({ task, heightToTime, dayIndex, taskArray, setTaskArray, taskIndex, wrapper, overFlow }) {

    const [localTask, setLocalTask] = useState(task)
    const [movable, setMovable] = useState(false)
    const [moveIndent, setMoveIndent] = useState() // отступ при перемещении по вертикали
    const [dragable, setDragable] = useState(false)
    const [pageX, setPageX] = useState(0)
    const [inputAvailable, setInputAvailable] = useState(false)
    const [inputValue, setInputValue] = useState('')

    const input = useRef(null)

    useEffect(() => {
        setLocalTask(task)
    }, [task])             //обновление от глобального стейта

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
                //newLocalTask.timeFrom = heightToTime(height - moveIndent)
                // timeFrom
                if (timeToPixels(heightToTime(height - moveIndent)) >= 1200) {
                    newLocalTask.timeFrom = '23:45'
                }
                else if (timeToPixels(heightToTime(height - moveIndent)) <= 0) {
                    newLocalTask.timeFrom = '00:00'
                }
                else {
                    newLocalTask.timeFrom = heightToTime(height - moveIndent)
                }

                // newLocalTask.timeTo = heightToTime(height + (timeToPixels(localTask.timeTo) - timeToPixels(localTask.timeFrom)) - moveIndent)
                // timeTo 
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
                const newTaskArray = [...taskArray]
                if (taskBarEndIndex === dayIndex) {
                    newTaskArray[dayIndex][taskIndex] = newLocalTask
                }
                else {
                    newTaskArray[dayIndex].splice(taskIndex, 1)
                    newTaskArray[taskBarEndIndex].push(newLocalTask)
                }
                setMovable(false)
                setMoveIndent()
                setPageX(0)
                setTaskArray(newTaskArray)
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
                newLocalTask.timeTo = heightToTime(height)
                setLocalTask({ ...newLocalTask })
            }
            const mouseupHandler = () => {
                const newTaskArray = [...taskArray]
                newTaskArray[dayIndex] = [...newTaskArray[dayIndex]]
                newTaskArray[dayIndex][taskIndex] = newLocalTask
                setDragable(false)
                setTaskArray(newTaskArray)
            }
            document.addEventListener('mousemove', handler)
            document.addEventListener('mouseup', mouseupHandler)
            return () => {
                document.removeEventListener('mousemove', handler)
                document.removeEventListener('mouseup', mouseupHandler)
            }
        }
    }, [dragable])

    useEffect(() => {
        if (inputAvailable) {
            const handler = (e) => {
                if (e.target !== input) {
                    setInputAvailable(false)
                }
                document.addEventListener('click', handler)
            }
            return document.removeEventListener('click', handler)
        }
    }, [inputAvailable])

    const timeToPixels = (time) => {
        const [h, m] = time.split(':')
        return (h * 60 + +m) / 15 * 12.5
    }

    const top = timeToPixels(localTask.timeFrom)
    const height = timeToPixels(localTask.timeTo) - top

    return (
        <>
            <div className={s.task}
                style={{ height, top, left: pageX }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => {
                    e.stopPropagation()
                    setMoveIndent(e.pageY - e.target.getBoundingClientRect().top)
                    setMovable(true)
                }}
                onDoubleClick={() => setInputAvailable(true)}
            >
                {inputAvailable ? <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} ref={input} autoFocus /> : <>{task.name}</>}
                <div className={s.taskBorder}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => {
                        e.stopPropagation()
                        setDragable(true)
                    }}
                ></div>
            </div>
        </>
    )
}
export default Task;
