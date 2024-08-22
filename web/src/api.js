import axios from 'axios';

function GetDates() {
    return axios('http://localhost:8080/')
    .then(response => {
        console.log(response.data.Dates)
        return (response.data.Dates)
    })
}

export default GetDates;
