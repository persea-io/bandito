import React from 'react';
import {useState} from 'react'

export default function AddPet({addPet}) {
    const [pet, setPet] = useState({});

    //browser creates an event object and passes it to the handleChange function as an argument (in this case target)
    const handleChange = ({target}) => {
        //name is key and value is new value entered by user
        const {name, value} = target;
        //takes previous pet and returns a new pet object 
        //...prevPet takes previous pet and updates the specific property with the new value
        setPet((prevPet) => (
            //attaches a specific attribute of the object and sets it to the new value
            {...prevPet, [name]: value,}
        ));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        //attaches an id to the pet object when submitting
        setPet((prevPet) => (
            {...prevPet, id: crypto.randomUUID()}
        ));
        addPet(pet);
    }

    return (
        <>
            <label htmlFor="addPet">New Pet</label>
            <form className="addPet">
                <input 
                    value={pet.name}
                    name = "name"
                    type="text"
                    placeholder="Pet's name"
                    onChange={handleChange}
                />
                <input 
                    value={pet.type}
                    name = "type"
                    type="text"
                    placeholder="Animal Type (dog, cat etc.)"
                    onChange={handleChange}
                />
                <input 
                    value={pet.img}
                    name = "img"
                    type="text"
                    placeholder="URL Image"
                    onChange={handleChange}
                />
                <button type="submit" onClick={handleSubmit}>Add Pet</button>
            </form>
        </>
    );
}