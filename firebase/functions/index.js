
const {logger} = require("firebase-functions")
const {onRequest} = require("firebase-functions/v2/https")

const {initializeApp} = require("firebase-admin/app")
const {getFirestore} = require("firebase-admin/firestore")

const express = require('express')
const cors = require('cors')
const {auth} = require('express-oauth2-jwt-bearer');
const {jwtDecode} = require('jwt-decode')
const bodyParser = require('body-parser')
const {NOT_FOUND, FORBIDDEN} = require('http-status-codes')

const db = require("./db")

initializeApp()

const dbConnection = getFirestore()

const app = express()
app.use(express.json())
app.use(cors())

const main = express()

main.use('/api/v1', app)
main.use(bodyParser.json());

const firebaseProjectId = process.env.GCLOUD_PROJECT;
if (!firebaseProjectId) {
    console.error("Cannot determine project id, exiting");
    process.exit(1);
}

app.use(auth({
    tokenSigningAlg: 'RS256',
    issuerBaseURL: `https://securetoken.google.com/${firebaseProjectId}`,
    audience: firebaseProjectId,
}));

exports.webApi = onRequest(main)

app.post('/owners/:ownerId/pets', (req, res) => {
    if (req.auth.payload.sub !== req.params.ownerId) {
        // Users can only add their own pets
        res.status(FORBIDDEN).send()
    } else {
        db.addPet(dbConnection, {ownerId: req.params.ownerId, ...req.body}).then(pet =>
            res.json(pet)
        )
    }
})

app.get('/owners/:ownerId/pets', (req, res) => {
    if (req.auth.payload.sub !== req.params.ownerId) {
        // Users can only see their pets
        res.status(FORBIDDEN).send()
    } else {
        db.getPetsForOwner(dbConnection, req.params.ownerId).then(pets => {
            res.json(pets)
        })
    }
})

const getPetById = async (dbConnection, petId, userId, includeEvents) => {
    return db.getPetById(dbConnection, petId, includeEvents)
        .then(pet => {
            if (pet?.ownerId !== userId) {
                throw (FORBIDDEN)
            }
            return pet
        })
}

app.get('/pets/:petId', async (req, res) => {
    try {
        const pet = await getPetById(dbConnection, req.params.petId, req.auth.payload.sub, (req.query.events !== undefined))
        if (pet) {
            res.json(pet)
        } else {
            res.status(NOT_FOUND).send()
        }
    } catch (e) {
        res.status(e).send()
    }
})

app.get('/pets/:petId/events', async (req, res) => {
    try {
        const pet = await getPetById(dbConnection, req.params.petId, req.auth.payload.sub, true)
        if (pet) {
            res.json(pet.events)
        } else {
            res.status(404).send()
        }
    } catch (e) {
        res.status(e).send()
    }
})

app.post('/pets/:petId/events', async (req, res) => {
    try {
        const pet = await getPetById(dbConnection, req.params.petId, req.auth.payload.sub, (req.query.events !== undefined))
        if (pet) {
            db.addEvent(dbConnection, {petId: req.params.petId, ...req.body}).then(event =>
                res.json(event)
            )
        }
    } catch (e) {
        res.status(e).send()
    }
})

app.get('/events/:eventId', (req, res) =>
    db.getEventById(dbConnection, req.params.eventId).then(event => {
        if (event) {
            // Check that this event belongs to a pet owned by this owner
            getPetById(dbConnection, event.petId, req.auth.payload.sub, null)
                .then(() => res.json(event))
                .catch (e => res.status(e).send())
        } else {
            res.status(NOT_FOUND).send()
        }
    })
)
