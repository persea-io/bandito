import React from 'react';

function ButtonComponent (props){
    return (
        <button onClick={props.clickHandler} disabled={props.disabled}>{props.text}</button>
    );
}

export default ButtonComponent;