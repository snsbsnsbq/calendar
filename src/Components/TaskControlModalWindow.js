import s from './TaskControlModalWindow.module.css';
import basket from '../assets/basket.svg'

function TaskControlModalWindow({ taskControlModalWindowCords, taskArray, dayIndex, taskIndex, setTaskArray }) {

    const deleteTask = (e) => {
        e.stopPropagation()
        const newTaskArray = [...taskArray]
        newTaskArray[dayIndex].splice(taskIndex, 1)
        setTaskArray(newTaskArray)
    }

    return (
        <div className={s.TaskControlModalWindow}
            style={{
                top: taskControlModalWindowCords.pageY,
                left: taskControlModalWindowCords.pageX
            }}>
            <div
                style={{
                    paddingLeft: '5px',
                    paddingBottom: "5px",
                    borderBottom: '1px solid black',
                    cursor: 'pointer',
                    textAlign: 'center'
                }}
                onClick={(e) => deleteTask(e)}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <img src={basket} alt='basket' style={{ width: '15px', height: '15px' }} />  удалить</div>
            <div style={{
                paddingLeft: '5px',
                paddingBottom: "5px",
                borderBottom: '1px solid black',
                cursor: 'pointer',
                textAlign: 'center'
            }}
                onMouseDown={(e) => e.stopPropagation()}
            >cделать регулярной</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px' }} onMouseDown={(e) => e.stopPropagation()}>
                <div style={{ width: '20px', height: '20px', borderRadius: '10px', cursor: 'pointer', background: 'red' }}></div>
                <div style={{ width: '20px', height: '20px', borderRadius: '10px', cursor: 'pointer', background: 'green' }}></div>
                <div style={{ width: '20px', height: '20px', borderRadius: '10px', cursor: 'pointer', background: 'fuchsia' }}></div>
                <div style={{ width: '20px', height: '20px', borderRadius: '10px', cursor: 'pointer', background: 'yellow' }}></div>
                <div style={{ width: '20px', height: '20px', borderRadius: '10px', cursor: 'pointer', background: 'blue' }}></div>
            </div>
        </div>
    )
}
export default TaskControlModalWindow;
