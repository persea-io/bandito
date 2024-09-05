const express = require('express')
const cors = require('cors')
const {connect, getEvents, createEvent, getEventsForPet} = require("./db");

connect().then(dbConnection => {
  const app = express()
  app.use(express.json())

  app.use(cors())

  const port = 8080

  app.get('/:petId/events', (req, res) => {
    getEventsForPet(dbConnection, req.params.petId).then(events => {
      res.json(events)
    })
  })

  app.post('/:petId/events', (req, res) => {
    createEvent(dbConnection, {petId: req.params.petId}).then(event =>
      res.json(event)
    )
  })

  app.listen(port)

  console.log('Server started on port: ' + port)

}).catch(err => console.log(err))



