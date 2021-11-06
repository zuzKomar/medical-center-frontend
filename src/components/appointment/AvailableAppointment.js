import React from "react";

const AvailableAppointment = ({appointment}) =>{

    function handleClick(){
        console.log('test click wizyta');
    }


    return(
        <div onClick={handleClick} className='availableAppointment'>
            <p>{'Usługa: ' +appointment.service.name}</p>
            <p>{'Data: '+new Date(appointment.date).toISOString().slice(0,10) +', godzina: '+ new Date(appointment.date).toISOString().slice(11,19)}</p>
        </div>
    )
}

export default AvailableAppointment;