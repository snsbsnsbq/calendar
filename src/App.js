import s from './App.module.css';
import Header from './Components/Header';
import CalendarBar from './Components/CalendarBar';
import MainCalendar from './Components/MainCalendar';
import { useState } from 'react';

function App() {

  const [day, setDay] = useState(new Date())

  return (
    <>
      <Header setDay={setDay} day={day} />
      <div className={s.wrapper}>
        <CalendarBar />
        <MainCalendar day={day} />
      </div>
    </>
  );
}

export default App;
