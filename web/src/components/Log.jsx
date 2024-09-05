import React from 'react';

export default function LogComponent(props) {

    return ( 
<ul>
    {props.times.map((item, index) => (
    <li key={index}>{item}</li>))}
</ul> 
    );
}