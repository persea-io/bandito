import Pet from './Pet.jsx'

export default function PetList({deletePet, petList, canFeed, formatTime}) {

    return (
        <>
            {petList.map((petObject) => 
            <Pet 
            {...petObject}
            // use spread operator to achieve same thing as below
            // img={petObject.img}
            // name={petObject.name}
            // type={petObject.type}
            formatTime={formatTime}
            canFeed={canFeed}
            deletePet={deletePet}
            />
            )}
        </>
    );
}