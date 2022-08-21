import React from 'react'
import { useParams } from 'react-router-dom';

function AttendEvent(){
    const { address } = useParams();
    console.log('address', address)
    return (
        <p>Attend event {address}</p>
    )
}

export { AttendEvent }