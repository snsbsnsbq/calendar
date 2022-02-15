import { useEffect, useState } from 'react/cjs/react.development';
import s from './Task.module.css';

function Task({ note, cord, setStartCord, taskArray, setTaskArray, day, noteIndex, cordX }) {
    // без startCord
    const [task, setTask] = useState(note)
    const [dragable, setDragable] = useState(false)
    const [movable, setMovable] = useState(false)

    useEffect(() => {
        setTask(note)
    }, [note])
    //не правильно обновляет без него

    useEffect(() => {
        if (dragable && task.height > 12) {
            setTask({ ...note, height: note.height + cord - (cord % 12.5) })
        }
        if (movable && task.top > 0.1) {
            setTask({ ...note, top: note.top + cord - (cord % 12.5) })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cord])

    useEffect(() => {
        if (movable && cordX !== taskArray[day]) {
            const newTaskArray = [...taskArray]
            newTaskArray[day].notes.splice(noteIndex, 1)
            setTaskArray([...newTaskArray])
            newTaskArray[cordX].notes.push(task)
            setMovable(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cordX])

    useEffect(() => {
        if (dragable) {
            const handler = () => {
                setDragable(false)
                const newTaskArray = [...taskArray]
                newTaskArray[day].notes[noteIndex] = task
                setTaskArray([...newTaskArray])
            }
            document.addEventListener('mouseup', handler)
            return () => document.removeEventListener('mouseup', handler)
        }

    }, [dragable])

    return (
        <>
            <div className={s.task}
                style={{ height: task.height, top: task.top }}
                onClick={(e) => {
                    e.stopPropagation()
                }}
                onMouseDown={(e) => {
                    setMovable(true)
                    setStartCord(task.top + (e.pageY - e.currentTarget.getBoundingClientRect().top))
                }}
                onMouseUp={(e) => {
                    e.stopPropagation()
                    setMovable(false)
                    const newTaskArray = [...taskArray]
                    newTaskArray[day].notes[noteIndex] = task
                    setTaskArray([...newTaskArray])
                }}

                onContextMenu={(e) => {
                    e.preventDefault()
                    const a = JSON.stringify(taskArray)
                    console.log(a)
                    const newTaskArray = taskArray
                    const notes = [...newTaskArray[day].notes]
                    notes.splice(noteIndex, 1)
                    console.log(newTaskArray.notes === taskArray.notes)
                    newTaskArray[day].notes = notes
                    console.log(a === JSON.stringify(taskArray))
                    setTaskArray([...newTaskArray])
                }}
            >{task.note}
                <div className={s.taskBorder}
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                    onMouseDown={(e) => {
                        e.stopPropagation()
                        setDragable(true)
                        setStartCord(task.height + task.top)
                    }}
                    onMouseUp={(e) => {
                        e.stopPropagation()
                        setDragable(false)
                        const newTaskArray = [...taskArray]
                        newTaskArray[day].notes[noteIndex] = task
                        setTaskArray([...newTaskArray])
                    }}
                ></div>
            </div>
        </>
    )
}
export default Task;
