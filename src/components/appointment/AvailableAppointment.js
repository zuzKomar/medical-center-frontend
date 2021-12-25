import React, {useState, useEffect} from "react";

const AvailableAppointment = ({appointment, setOpenModal, setSelectedAppointment}) =>{
    const [app, setApp] = useState(appointment);

    useEffect(()=>{
        if(appointment !== undefined){
            setApp(appointment);
        }
    },[appointment])

    function handleClick(e){
        e.preventDefault();
        setSelectedAppointment(app);
        setOpenModal(true);
    }

    var x = (new Date()).getTimezoneOffset() * 60000;
    return(
        <div className='availableAppointment' title={'Wybierz wizytę'}>
            <div className="availableAppointmentDate">
                <p>{new Date(new Date(app.date)-x).toISOString().slice(0,10)}</p>
                <p>{new Date(new Date(app.date)-x).toISOString().slice(11,16)}</p>
            </div>
            <div className="availableAppointmentDoctor">
                <p>{app.doctor ? 'dr '+app.doctor.firstName + ' '+ app.doctor.lastName : 'Personel medyczny'}</p>
            </div>
            <div className="availableAppointmentBtn">
                <button className="actionButton" onClick={(e)=>handleClick(e)}>Umów</button>
            </div>
        </div>
    )
}

export default AvailableAppointment;