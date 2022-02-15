import s from './CalendarBar.module.css';

function CalendarBar() {

    let day = Date.now();

    return (
        <div className={s.calendar}>
            <div className={s.header}>
                <div>Январь 2022</div>
                <div className={s.cntlArrow}>
                    <div class={s.arrow}>&#60;</div>
                    <div class={s.arrow}>&#62;</div>
                </div>
            </div>
            <table>
                <tr>
                    <th className={s.cell}>Пн</th>
                    <th className={s.cell}>Вт</th>
                    <th className={s.cell}>Ср</th>
                    <th className={s.cell}>Чт</th>
                    <th className={s.cell}>Пт</th>
                    <th className={s.cell}>Сб</th>
                    <th className={s.cell}>Вс</th>
                </tr>
                <tr>
                    <td className={s.cell}>1</td>
                    <td className={s.cell}>2</td>
                    <td className={s.cell}>3</td>
                    <td className={s.cell}>4</td>
                    <td className={s.cell}>5</td>
                    <td className={s.cell}>6</td>
                    <td className={s.cell}>7</td>
                </tr>
                <tr>
                    <td className={s.cell}>8</td>
                    <td className={s.cell}>9</td>
                    <td className={s.cell}>10</td>
                    <td className={s.cell}>11</td>
                    <td className={s.cell}>12</td>
                    <td className={s.cell}>13</td>
                    <td className={s.cell}>14</td>
                </tr>
                <tr>
                    <td className={s.cell}>15</td>
                    <td className={s.cell}>16</td>
                    <td className={s.cell}>17</td>
                    <td className={s.cell}>18</td>
                    <td className={s.cell}>19</td>
                    <td className={s.cell}>20</td>
                    <td className={s.cell}>21</td>
                </tr>
                <tr>
                    <td className={s.cell}>22</td>
                    <td className={s.cell}>23</td>
                    <td className={s.cell}>24</td>
                    <td className={s.cell}>25</td>
                    <td className={s.cell}>26</td>
                    <td className={s.cell}>27</td>
                    <td className={s.cell}>28</td>
                </tr>
                <tr>
                    <td className={s.cell}>29</td>
                    <td className={s.cell}>30</td>
                    <td className={s.cell}>31</td>
                    <td className={s.cell}>1</td>
                    <td className={s.cell}>2</td>
                    <td className={s.cell}>3</td>
                    <td className={s.cell}>4</td>
                </tr>
                <tr>
                    <td className={s.cellActive}>5</td>
                    <td className={s.cell}>6</td>
                    <td className={s.cell}>7</td>
                    <td className={s.cell}>8</td>
                    <td className={s.cell}>9</td>
                    <td className={s.cell}>10</td>
                    <td className={s.cell}>11</td>
                </tr>
            </table>
            <div>{day}</div>
        </div>

    );
}

export default CalendarBar;
