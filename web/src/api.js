import axios from 'axios';
const server = 'http://localhost:8080/';

function GetDates() {
    return axios(`${server}`)
    .then(response => {
        return (response.data.dates.map(date => new Date(date)));
    })
}

function AddDate(time) {
    return axios.post(`${server}`, {date:time})
}

export {GetDates, AddDate};
