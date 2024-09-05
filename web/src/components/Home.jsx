import '../App.css';
import ButtonComponent from './Button.jsx';
import {GetDates, AddDate} from '../api.js';
import {useState} from 'react'
import LogComponent from './Log.jsx';
import NavBar from './NavBar.jsx'
import Pet from './Pet.jsx';
import EditPet from './editPet.jsx';
import AddPet from './AddPet.jsx';
import PetList from './PetList.jsx'

function formatTime(time) {
  var returnString = '';
  var currDate = new Date()
  //return either 'this' or 'last' depending on if last meal was today or yesterday
  if (time.getDay() === currDate.getDay()) { returnString = 'This ' }
  else if (currDate.getDay - time.getDay() === 1) { returnString = 'Last ' }

  //return the time of day depending on the hour
  if ((time.getHours() >=0 && time.getHours() <= 11)) { returnString += 'Morning' }
  else if ((time.getHours() >= 12 && time.getHours() <= 16)) { returnString += 'Afternoon' }
  else { returnString += 'Evening' }

  return (
    "I was last fed at: " +
    time.getHours() + ":" + time.getMinutes() + " " + returnString
  );
}

function canFeed(time) {
  var currDate = new Date();
  return (currDate.getHours() - time.getHours() >= 5);
}

function Home() {
  const [timeLog, setTimeLog] = useState([]);
  const [petList, setPetList] = useState([]);

  const handleLogClick = () => {
    GetDates().then( 
      (allDates) => {
        setTimeLog(allDates.map(formatTime));
        console.log(allDates.map(formatTime));
      }
    )
  }

  //when editing existing data with states, need to use a function (in this case currentPets)
  function addPet(petObj) {
    setPetList(currentPets => {
      return [
        ...currentPets, petObj
      ]
    })
  }

  function deletePet(id) {
      setPetList(currentPets => {
        return (
          //returns a new array with pets that do not match that id
          currentPets.filter(pet => pet.id != id)
        );
      })
  }

  return (
    <div className="App">
      <header className="App-header">
        <NavBar/>
        <PetList 
        petList={petList}
        canFeed={canFeed}
        formatTime={formatTime}
        deletePet={deletePet}
        />
        <br/>
        <br/>
        <AddPet addPet={addPet}/>
        <ButtonComponent clickHandler={handleLogClick} text="View Log"/>
        <LogComponent times={timeLog}/>
      </header>
    </div>
  );
}

export default Home;