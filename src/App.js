import s from './App.module.css';
import Header from './Components/Header';
import CalendarBar from './Components/CalendarBar';
import MainCalendar from './Components/MainCalendar';

function App() {

  return (
    <>
    <div></div>
      <Header />
      <div className={s.wrapper}>
        <CalendarBar />
        <MainCalendar />
      </div>
    </>
  );
}

export default App;
