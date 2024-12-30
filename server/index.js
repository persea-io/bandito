const express = require('express')
const cors = require('cors')
const db = require('./db')

const dbConnection = db.connect()

const app = express()
app.use(express.json())

app.use(cors())

const port = 8080

app.post('/owners/:ownerId/pets', (req, res) => {
    db.addPet(dbConnection, {ownerId: req.params.ownerId, ...req.body}).then(event =>
        res.json(event)
    )
})

app.get('/pets/:petId', (req, res) => {
    db.getPetById(dbConnection, req.params.petId, (req.query.events !== undefined))
        .then(pet => {
            if (pet) {
                res.json(pet);
            } else {
                res.status(404).send();
            }
        })
})

app.get('/pets/:petId/events', (req, res) => {
    db.getEventsForPet(dbConnection, req.params.petId).then(events => {
        res.json(events)
    })
})

app.post('/pets/:petId/events', (req, res) => {
    db.addEvent(dbConnection, {petId: req.params.petId, ...req.body}).then(event =>
        res.json(event)
    )
})

app.get('/events/:eventId', (req, res) =>
    db.getEventById(dbConnection, req.params.eventId).then(event => {
        if (event) {
            res.json(event)
        } else {
            res.status(404).send()
        }
    })
)

app.listen(port)

console.log('Server started on port: ' + port)


