import React, {useState, useEffect} from "react";

const AvailableAppointment = ({appointment, setOpenModal, setSelectedAppointment, t}) =>{
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
        <div className='availableAppointment' title={t("chooseAppointment")}>
            <div className="availableAppointmentDate">
                <p>{new Date(new Date(app.date)-x).toISOString().slice(0,10)}</p>
                <p>{new Date(new Date(app.date)-x).toISOString().slice(11,16)}</p>
            </div>
            <div className="availableAppointmentDoctor">
                <p>{appointment.doctor ? t("doctorTitle")+ ' ' + appointment.doctor.firstName + ' '+ appointment.doctor.lastName : t("medicalStaff")}</p>
            </div>
            <div className="availableAppointmentBtn">
                <button className="actionButton" onClick={(e)=>handleClick(e)}>{t("reserve")}</button>
            </div>
        </div>
    )
}

export default AvailableAppointment;