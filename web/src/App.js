import logo from './bandit.png';
import './App.css';
import ButtonComponent from './button';
import GetDates from './api.js';
import {useState} from 'react'
import LogComponent from './log.js';

function formatTime(time) {
  var returnString = ''
  var currDate = new Date()
  //return either 'this' or 'last' depending on if last meal was today or yesterday
  if (time.getDay() == currDate.getDay()) { returnString = 'This ' }
  else { returnString = 'Last ' }

  //return the time of day depending on the hour
  if ((time.getHours() >=0 && time.getHours() <= 11)) { returnString += 'Morning' }
  else if ((time.getHours() >= 12 && time.getHours() <= 16)) { returnString += 'Afternoon' }
  else { returnString += 'Evening' }

  return (
    "I was fed at: " +
    time.getHours() + ":" + time.getMinutes() + " " + returnString
  );
}

function canFeed(time) {
  var currDate = new Date();
  return (currDate.getHours() - time.getHours() >= 5);
}

function App() {
  const [state, setState] = useState("Feed me!");
  const [text, setText] = useState();
  const [timeLog, setTimeLog] = useState([]);
  let canClick;

  //event handler for when feed button is clicked
  const handleFeedClick = () => {
    GetDates().then(
      allDates => {
        let lastDate = new Date((allDates[allDates.length-2]).trim())
        setText(formatTime(lastDate));
        setState(prevState => {
          if (canFeed(lastDate)) {
            canClick = true;
            return "Feed me!"
          }
          else {
            canClick = false;
            return "Feed me again in a couple hours."
          }
        });
      }
    );
  }

  const handleLogClick = () => {

    GetDates().then( 
      (allDates) => {
        //new array that holds date objects 
        let dateObjects = [];
        for (let index = 0; index < allDates.length; ++index) {
          dateObjects[index] = new Date((allDates[index]).trim());
        }
        //formats objects and updates state of timeLog
        setTimeLog(dateObjects.map(formatTime));
        console.log(dateObjects.map(formatTime));
      }
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>{text}</h1> 
        <ButtonComponent clickHandler={handleFeedClick} text={state} disabled={canClick} />
        <br/>
        <ButtonComponent clickHandler={handleLogClick} text="View Log"/>
        <LogComponent times={timeLog}/>
      </header>

    </div>
  );
}

export default App;
