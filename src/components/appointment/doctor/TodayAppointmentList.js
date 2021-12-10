import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import {baseUrl} from "../../../config/config";
import DoctorAppointment from "./DoctorAppointment";

const TodayAppointmentList = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const getAppointments = async () => {
            const appointments = await fetchAppointments()
            setAppointments(appointments)
        }
        getAppointments();
    }, [])

    const fetchAppointments = async () =>{
        const res = await fetch(`${baseUrl}/doctors/7/todaysVisits`);
        return await res.json();
    }

    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>Today's Visits</h2>
            </div>
            <div className="appointmentList">
                {appointments.map(appointment => <DoctorAppointment key={appointment.id} appointment={appointment} />)}
            </div>
        </div>
    )
}

export default TodayAppointmentList;