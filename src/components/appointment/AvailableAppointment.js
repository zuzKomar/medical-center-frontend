import React from "react";

const AvailableAppointment = ({appointment, setOpenModal, setSelectedAppointment, t}) =>{

    function handleClick(e){
        e.preventDefault();
        setSelectedAppointment(appointment);
        setOpenModal(true);
    }

    var x = (new Date()).getTimezoneOffset() * 60000;
    return(
        <div className='availableAppointment' title={t("chooseAppointment")}>
            <div className="availableAppointmentDate">
                <p>{new Date(new Date(appointment.date)-x).toISOString().slice(0,10)}</p>
                <p>{new Date(new Date(appointment.date)-x).toISOString().slice(11,16)}</p>
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