import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {baseUrl} from "../../../../config/config";
import ArchivalVisit from "./ArchivalVisit";
import AppointmentDetailsButtonPanel from "../AppointmentDetailsButtonPanel";

const VisitsHistoryList = () => {

    let history = useHistory();
    const appointment = history.location.state;
    const [patientsAppointments, setPatientsAppointments] = useState([]);

    useEffect(() => {
        const getAppointments = async () => {
            const appointments = await fetchAppointments()
            setPatientsAppointments(appointments.appointments)
        }
        getAppointments();
    }, [])

    const fetchAppointments = async () =>{
        const res = await fetch(`${baseUrl}/patients/${appointment.patient.id}/doneAppointments`);
        return await res.json();
    }

    return (
        <div className="itemsList">
            <div className="listHeader">
                <h2>Visits History</h2>
            </div>
            <AppointmentDetailsButtonPanel appointment={appointment} />
            <div className="appointmentList">
                {patientsAppointments.map(patientAppointment => <ArchivalVisit key={patientAppointment.id} appointment={patientAppointment} />)}
            </div>
        </div>
    )
}

export default VisitsHistoryList;