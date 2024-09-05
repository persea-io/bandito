const mysql = require('mysql2/promise')

const connect = () => {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'secret',
    database: 'bandito'
  }).then(connection => {
    console.log('Connected to database')
    return connection
  }).catch(err => {
    console.error(`Failed to connect to database: ${err}`)
    throw err;
  })
}

const getEventsForPet = (connection, petId) => {
  return connection.query('SELECT * FROM event WHERE pet_id = ?;', [petId])
    .then(response => {
      [results, fields] = response
      return results
    })
}

const getEventById = (connection, eventId) => {
  return connection.query('SELECT * FROM event WHERE id = ?;', [eventId])
    .then(response => {
      [results, fields] = response
      return results ? results[0] : null
    })
}

const createEvent = (connection, event) => {
  return connection.query('INSERT INTO event (pet_id) VALUES (?)', [event.petId])
    .then(() => {
      return connection.query('SELECT LAST_INSERT_ID() AS id')
    })
    .then(response => {
      [results, fields] = response
      return results ? getEventById(connection, results[0].id) : null
    })
}

module.exports = {
  connect,
  getEventsForPet,
  getEventById,
  createEvent,
};
