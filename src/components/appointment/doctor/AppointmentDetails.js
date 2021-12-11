import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import NewAppointment from "../NewAppointment";
import AppointmentDetailsForm from "./AppointmentDetailsForm";

const AppointmentDetails = () => {

    let history = useHistory();

    const appointment = history.location.state;

    const [receivedAppointment, setReceivedAppointment] = useState(appointment ? appointment : undefined);

    return (
        <div className="itemsList">
            <div className="listHeader">
                <h2>Appointment's Details</h2>
            </div>
            <AppointmentDetailsForm />
        </div>
    )
}

export default AppointmentDetails;