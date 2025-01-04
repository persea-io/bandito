
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

let userId;

if (process.env.FUNCTIONS_EMULATOR === 'true') {
    // Emulator is enabled, we are running locally
    logger.warn("Running in emulator mode. Authentication is disabled.")

    // Auth is disabled so we have to extract jwt ourselves
    userId = (req) => {
        const authHeader = req.headers["authorization"];
        const jwt = jwtDecode(authHeader.substring(7));
        return jwt['sub'];
    }
} else {
    const firebaseProjectId = process.env.GCLOUD_PROJECT;
    if (!firebaseProjectId) {
        logger.error("Cannot determine project id, exiting");
        process.exit(1);
    }

    app.use(auth({
        tokenSigningAlg: 'RS256',
        issuerBaseURL: `https://securetoken.google.com/${firebaseProjectId}`,
        audience: firebaseProjectId,
    }));

    // Get userId from verified jwt
    userId = (req) => req.auth.payload.sub
}

exports.webApi = onRequest(main)

app.post('/owners/:ownerId/pets', async (req, res) => {
    if (userId(req) !== req.params.ownerId) {
        // Users can only add their own pets
        res.status(FORBIDDEN).send()
    } else {
        const pet = await db.addPet(dbConnection, {ownerId: req.params.ownerId, ...req.body})
        res.json(pet)
    }
})

app.get('/owners/:ownerId/pets', async (req, res) => {
    if (userId(req) !== req.params.ownerId) {
        // Users can only see their pets
        res.status(FORBIDDEN).send()
    } else {
        const pets = await db.getPetsForOwner(dbConnection, req.params.ownerId)
        res.json(pets)
    }
})

const getPetById = async (dbConnection, petId, userId, includeEvents) => {
    const pet = await db.getPetById(dbConnection, petId, includeEvents)
    if (pet && (pet.ownerId !== userId)) {
        throw (FORBIDDEN)
    }
    return pet
}

app.get('/pets/:petId', async (req, res) => {
    try {
        const pet = await getPetById(dbConnection, req.params.petId, userId(req), (req.query.events !== undefined))
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
        const pet = await getPetById(dbConnection, req.params.petId, userId(req), true)
        if (pet) {
            res.json(pet.events)
        } else {
            res.status(NOT_FOUND).send()
        }
    } catch (e) {
        res.status(e).send()
    }
})

app.post('/pets/:petId/events', async (req, res) => {
    try {
        const pet = await getPetById(dbConnection, req.params.petId, userId(req), (req.query.events !== undefined))
        if (pet) {
            const event = await db.addEvent(dbConnection, {petId: req.params.petId, ...req.body})
            res.json(event)
        }
        res.status(NOT_FOUND).send()
    } catch (e) {
        res.status(e).send()
    }
})

app.get('/events/:eventId', async (req, res) => {
    const event = await db.getEventById(dbConnection, req.params.eventId)
    if (event) {
        // Check that this event belongs to a pet owned by this owner
        try {
            await getPetById(dbConnection, event.petId, userId(req), null)
            res.json(event)
        } catch (e) {
            res.status(e).send()
        }
    } else {
        res.status(NOT_FOUND).send()
    }
})
