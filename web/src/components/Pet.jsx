//each pet has its own props to display:
//image, feed button, last fed text -> autofill a list using these properties
import ButtonComponent from "./Button";
import {GetDates, AddDate} from '../api.js';
import {useState} from 'react'
import '../Pet.css'

function Pet(props) {
    const [state, setState] = useState("Feed me!");
    const [text, setText] = useState();

    const handleFeedClick = () => {
        AddDate(new Date()).then(() => {
          GetDates().then(
            allDates => {
              //hooks can't be run conditionally, change this:
              if (allDates?.length >=1) {
                const lastDate = allDates[allDates.length-1];
                setText(props.formatTime(lastDate));
                setState(prevState => {
                  if (props.canFeed(lastDate)) {
                    return "Feed me!"
                  }
                  else {
                    return "Feed me again in a couple hours."
                  }
                });
              }
            }
          );
        }
      )
    }

    return(
        <>
          <h1 class="status">{text}</h1> 
          {/* <label htmlFor="photo">{props.name}</label> */}
          <h1>{props.name}</h1>
          <h2>{`Pet type: ${props.type}`}</h2>
          <img className="photo" src={props.img}/>
          <ButtonComponent clickHandler={handleFeedClick} text={state} />
          <button onClick={() => props.deletePet(props.id)}>Delete Pet</button>
        </>
    );
}

export default Pet;