import s from './TimeArrow.module.css';
import { timeToPixels } from '../util';
import { useEffect, useState } from 'react';

function TimeArrow() {
    const [date, setDate] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => tick()
            , 60000);
        return () => clearInterval(interval);
    }, [tick]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function tick() {
        setDate(new Date())
    }

    return (
        <div className={s.TimeArrow} style={{ top: timeToPixels(`${date.getHours()}:${date.getMinutes()}`) }}></div>
    )
}

export default TimeArrow;
