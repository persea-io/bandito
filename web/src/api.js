import axios from 'axios';

const server = 'http://localhost:8080';

function GetDates() {

    const petId = 1; // TODO

    return axios(`${server}/${petId}/events`)
    .then(response => {
        return (response.data.map(event => new Date(event.time)));
    })
}

function AddDate(time) {
    const petId = 1; // TODO

    return axios.post(`${server}/${petId}/events`, {})
}

export {GetDates, AddDate};
