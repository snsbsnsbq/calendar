import { useEffect, useState } from 'react/cjs/react.development';
import s from './Task.module.css';

function Task({ task }) {

    // без startCord
    const [localTask, setLocalTask] = useState(task)

    const timeToPixels = (time) => {
        const [h, m] = time.split(':')
        return (h * 60 + +m) / 15 * 12.5
    }

    const top = timeToPixels(localTask.timeFrom)
    const height = timeToPixels(localTask.timeTo) - top


    return (
        <>
            <div className={s.task}
                style={{ height, top }}
            >{task.name}
                <div className={s.taskBorder}

                ></div>
            </div>
        </>
    )
}
export default Task;
