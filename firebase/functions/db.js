const {logger} = require("firebase-functions")
const { v4: uuid } = require('uuid')

const evalSnapshot = (snapshot) => {
    if (snapshot.empty) {
        return []
    }
    const result = []
    snapshot.forEach(doc =>  result.push(doc.data()))
    return result
}

const addPet = async (db, pet) => {
    const id = uuid()
    const docRef = db.collection('pets').doc(id)
    pet.id = id
    pet.added = new Date().getTime()
    await docRef.set(pet)
    return pet
}

const getPetsForOwner = async (db, ownerId) => {
    const eventsRef = db.collection('pets')
    const snapshot = await eventsRef.orderBy('name').where('ownerId', '==', ownerId).get()
    return evalSnapshot(snapshot)
}

const getPetById = async (db, petId, includeEvents) => {
    const petRef = db.collection('pets').doc(petId)
    const doc = await petRef.get()
    if (!doc.exists) {
        return null
    }
    const pet = doc.data()
    if (includeEvents) {
        pet.events = await getEventsForPet(db, petId, 10)
    }
    return pet
}

const getEventsForPet = async (db, petId, count) => {
    if (!count) {
        count = 100;
    }
    const eventsRef = db.collection('events')
    const snapshot = await eventsRef.orderBy('timestamp', 'desc').limit(count)
        .where('petId', '==', petId).get()
    return evalSnapshot(snapshot)
}

const getEventById = async (db, eventId) => {
    const eventRef = db.collection('events').doc(eventId)
    const doc = await eventRef.get()
    return (doc.exists) ? doc.data() : null
}

const addEvent = async (db, event) => {
    const id = uuid()
    const docRef = db.collection('events').doc(id)
    event.id = id
    event.timestamp = event.timestamp || new Date().getTime()
    await docRef.set(event)
    return event
}

module.exports = {
    addPet,
    getPetsForOwner,
    getPetById,
    getEventsForPet,
    getEventById,
    addEvent,
}
