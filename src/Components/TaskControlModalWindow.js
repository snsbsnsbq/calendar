import s from './TaskControlModalWindow.module.css';
import basket from '../assets/basket.svg'
import { colorArray } from '../util';
import { useDispatch } from 'react-redux';

function TaskControlModalWindow({ taskControlModalWindowCords,
    taskArray,
    dayIndex,
    taskIndex,
    setTaskArray,
    setTaskEditing,
    taskColorChange,
    localTask,
    deleteTaskHandler,
    regularVisible,
    setRegularVisible,
    makeTaskRegular,
}) {
    //redux
    const dispatch = useDispatch()

    return (
        <div className={s.TaskControlModalWindow}
            style={{
                top: taskControlModalWindowCords.pageY,
                left: taskControlModalWindowCords.pageX
            }}>
            {!regularVisible ?
                //первое меню
                <>
                    <div
                        style={{
                            paddingLeft: '5px',
                            paddingBottom: "5px",
                            borderBottom: '1px solid black',
                            cursor: 'pointer',
                            textAlign: 'center'
                        }}
                        onClick={(e) => {
                            deleteTaskHandler(e)
                            dispatch({ type: "SET_TASK_CONTROL_MODAL_WINDOW", payload: false })
                            setTaskEditing(false)
                        }}
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
                        onClick={() => {
                            if (!("periodGroupId" in taskArray[dayIndex][taskIndex])) {
                                setRegularVisible(true)
                            }
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >cделать регулярной</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px' }} onMouseDown={(e) => e.stopPropagation()}>
                        {colorArray.map((color) => (
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                background: color,
                                boxSizing: 'border-box',
                            }}
                                className={localTask.color === color ? s.active : ''}
                                onClick={() => taskColorChange(color)}
                                key={color}
                            >
                            </div>
                        ))}

                    </div></> :
                //второе меню
                <div style={{ display: 'flex' }}>
                    <div style={{
                        padding: '35px 10px 10px 10px',
                        borderRight: '1px solid black',
                        cursor: 'pointer'
                    }}
                        onClick={() => setRegularVisible(false)}
                        onMouseDown={(e) => e.stopPropagation()}>
                        {'<'}
                    </div>
                    <div>
                        <div style={{
                            paddingTop: '5px',
                            paddingLeft: '5px',
                            paddingBottom: "5px",
                            borderBottom: '1px solid black',
                            cursor: 'pointer',
                            textAlign: 'center',

                        }}
                            onClick={() => {
                                const id = taskArray[dayIndex][taskIndex].id
                                makeTaskRegular(id, 1)
                                setRegularVisible(false)
                                dispatch({ type: "SET_TASK_CONTROL_MODAL_WINDOW", payload: false })
                                setTaskEditing(false)
                            }}
                            onMouseDown={(e) => e.stopPropagation()}>
                            Повторять Ежедневно
                        </div>
                        <div style={{
                            paddingTop: '5px',
                            paddingLeft: '5px',
                            paddingBottom: "5px",
                            cursor: 'pointer',
                            textAlign: 'center'
                        }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => {
                                const id = taskArray[dayIndex][taskIndex].id
                                makeTaskRegular(id, 7)
                                setRegularVisible(false)
                                dispatch({ type: "SET_TASK_CONTROL_MODAL_WINDOW", payload: false })
                                setTaskEditing(false)
                            }}
                        >Повторять Еженедельно</div>
                    </div>
                </div>}
        </div >
    )
}
export default TaskControlModalWindow;
