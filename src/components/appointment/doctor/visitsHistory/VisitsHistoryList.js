import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {baseUrl} from "../../../../config/config";
import ArchivalVisit from "./ArchivalVisit";

const VisitsHistoryList = () => {

    let history = useHistory();
    const patient = history.location.state;
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const getAppointments = async () => {
            const appointments = await fetchAppointments()
            setAppointments(appointments)
        }
        getAppointments();
    }, [])

    const fetchAppointments = async () =>{
        const res = await fetch(`${baseUrl}/patients/${patient.id}/doneAppointments`);
        return await res.json();
    }

    return (
        <div className="itemsList">
            <div className="listHeader">
                <h2>Visits History</h2>
            </div>
            <div className="appointmentList">
                {/*{appointments.map(appointment => <div>{appointment.id}</div>)}*/}
                {appointments.map(appointment => <ArchivalVisit key={appointment.id} appointment={appointment} />)}
            </div>
        </div>
    )
}

export default VisitsHistoryList;