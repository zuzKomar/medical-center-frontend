import React from "react";
import {useHistory} from "react-router-dom";
import AppointmentDetailsForm from "./AppointmentDetailsForm";
import AppointmentDetailsButtonPanel from "./AppointmentDetailsButtonPanel";

const AppointmentDetails = ({t}) => {

    let history = useHistory();
    const appointment = history.location.state;

    return (
        <div className="itemsList">
            <div className="listHeader">
                <h2>{t("appointmentDetails")}</h2>
            </div>
            <br/>
            <AppointmentDetailsButtonPanel appointment={appointment} t={t} />
            <AppointmentDetailsForm appointment={appointment} t={t}/>
        </div>
    )
}

export default AppointmentDetails;