import React from "react";
import {useHistory} from "react-router-dom";
import AppointmentDetailsForm from "./AppointmentDetailsForm";

const AppointmentDetails = () => {

    let history = useHistory();
    const appointment = history.location.state;

    const handleClick = e => {
        e.preventDefault();

        const button = e.target.id;
        if (button === 'visitButton') {
            history.push({
                pathname: `/today-visits/${appointment.id}/details/visits-history`,
                state: appointment.patient
            })
        }
        else if (button === 'checkUpButton') {
            history.push({
                pathname: `/today-visits/${appointment.id}/details/check-ups`,
                state: appointment.patient
            })
        }
        else {
            history.push({
                pathname: `/today-visits/${appointment.id}/details/files`,
                state: appointment.patient
            })
        }
    }

    return (
        <div className="itemsList">
            <div className="listHeader">
                <h2>Visit's Details</h2>
            </div>
            <br/>
            <div style={{display: 'flex' ,justifyContent: 'space-between', width:'60%'}}>
                <button id="visitButton" className="actionButton" onClick={handleClick}>VISITS HISTORY</button>
                <button id="checkUpButton" className="actionButton" onClick={handleClick}>CHECK-UPS</button>
                <button id="filesButton" className="actionButton" onClick={handleClick}>PATIENT'S FILES</button>
            </div>
            <AppointmentDetailsForm />
        </div>
    )
}

export default AppointmentDetails;