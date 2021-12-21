import React from "react";
import {useHistory} from "react-router-dom";
import AppointmentDetailsForm from "./AppointmentDetailsForm";
import AppointmentDetailsButtonPanel from "./AppointmentDetailsButtonPanel";

const AppointmentDetails = () => {

    let history = useHistory();
    const appointment = history.location.state;

    return (
        <div className="itemsList">
            <div className="listHeader">
                <h2>Visit's Details</h2>
            </div>
            <br/>
            <AppointmentDetailsButtonPanel appointment={appointment} />
            <AppointmentDetailsForm appointment={appointment}/>
        </div>
    )
}

export default AppointmentDetails;