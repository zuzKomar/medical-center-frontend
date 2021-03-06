import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import AppointmentDetailsForm from "./AppointmentDetailsForm";
import AppointmentDetailsButtonPanel from "./AppointmentDetailsButtonPanel";

const AppointmentDetails = ({t, logout}) => {
    let history = useHistory();
    const app = history.location.state;
    const [appointment, setAppointment] = useState(app ? app : undefined);

    return (
        <div className="itemsList">
            <div className="listHeader">
                <h2>{t("appointmentDetails")}</h2>
            </div>
            <br/>
            <AppointmentDetailsButtonPanel appointment={appointment} t={t} />
            <AppointmentDetailsForm appointment={appointment} t={t} logout={logout}/>
        </div>
    )
}

export default AppointmentDetails;