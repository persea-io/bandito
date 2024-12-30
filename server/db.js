const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore')
const { v4: uuid } = require('uuid')


const connect = () => {
    const serviceAccount = require('/home/dave/bandito-446302-firebase-adminsdk-1xjkv-55cfa5f58e.json')

    initializeApp({
        credential: cert(serviceAccount)
    })

    return getFirestore()
}

const addPet = async (db, pet) => {
    const id = uuid()
    const docRef = db.collection('pets').doc(id)
    pet.id = id
    pet.added = new Date().getTime()
    await docRef.set(pet)
    return pet
}

const getPetById = async (db, petId, includeEvents) => {
    const eventRef = db.collection('pets').doc(petId)
    const doc = await eventRef.get()
    if (!doc.exists) {
        return null
    }
    const pet = doc.data()
    if (includeEvents) {
        pet.events = await getEventsForPet(db, petId)
    }
    return pet
}

const getEventsForPet = async (db, petId) => {
    const eventsRef = db.collection('events')
    const snapshot = await eventsRef.where('petId', '==', petId).get()
    if (snapshot.empty) {
        return []
    }

    const result = []
    snapshot.forEach(doc =>  result.push(doc.data()))
    return result
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
    connect,
    addPet,
    getPetById,
    getEventsForPet,
    getEventById,
    addEvent,
}
