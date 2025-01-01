
const {logger} = require("firebase-functions")
const {onRequest} = require("firebase-functions/v2/https")

const {initializeApp} = require("firebase-admin/app")
const {getFirestore} = require("firebase-admin/firestore")

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const db = require("./db")

initializeApp()

const dbConnection = getFirestore()

const app = express()
app.use(express.json())
app.use(cors())

const main = express()

main.use('/api/v1', app)
main.use(bodyParser.json());

exports.webApi = onRequest(main)

app.post('/owners/:ownerId/pets', (req, res) => {
    db.addPet(dbConnection, {ownerId: req.params.ownerId, ...req.body}).then(pet =>
        res.json(pet)
    )
})

app.get('/owners/:ownerId/pets', (req, res) => {
    db.getPetsForOwner(dbConnection, req.params.ownerId).then(pets => {
        res.json(pets)
    })
})

app.get('/pets/:petId', (req, res) => {
    db.getPetById(dbConnection, req.params.petId, (req.query.events !== undefined))
        .then(pet => {
            if (pet) {
                res.json(pet)
            } else {
                res.status(404).send()
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
