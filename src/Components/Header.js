import s from './Header.module.css';
import logo from '../assets/logo.png'
import { useDispatch, useSelector } from 'react-redux';

let Header = ({ setDay }) => {

    //redux
    const dispatch = useDispatch()
    const day = useSelector(state => state.day)

    const prevWeek = () => {
        const date = new Date(day)
        date.setDate(date.getDate() - 7)
        dispatch({ type: "SET_DAY", payload: date })
        console.log(date)
       // setDay(date)
    }

    const nextWeek = () => {
        const date = new Date(day)
        date.setDate(date.getDate() + 7)
       // setDay(date)
        dispatch({ type: "SET_DAY", payload: date })
    }

    return (
        <div className={s.wrapper}>
            <div className={s.col}>
                <div className={s.logo}>
                    <img src={logo} alt="logo" width="50px" height="50px" />
                </div>
                <div className={s.name} >
                    Календарь
                </div>
            </div>
            <div className={s.day} onClick={() => dispatch({ type: "SET_DAY", payload: new Date() })}>
                Сегодня
            </div>
            <div className={s.arrow} onClick={() => prevWeek()}>&#60;</div>
            <div className={s.arrow} onClick={() => nextWeek()}>&#62;</div>
            <div className={s.date}>
                {day.toLocaleString('ru', { month: 'long' })} {day.getFullYear()}
            </div>
        </div>
    );
}



export default Header;
