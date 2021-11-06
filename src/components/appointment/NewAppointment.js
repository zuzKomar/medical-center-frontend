import React from "react";
import {useState} from "react";
import {withRouter} from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css"
import NewAppointmentForm from "./NewAppointmentForm";
import AvailableAppointment from "./AvailableAppointment";

const NewAppointment = () =>{
    const [appointments, setAppointments] = useState([]);

    function handleAppointmentSearch(appointmentType, language, service, doctor, dateFrom, dateTo){
        fetch('http://localhost:5000/availableApps')
            .then(response => response.json())
            .then(data=>setAppointments(data));
    }

    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>Nowa wizyta</h2>
            </div>
                <NewAppointmentForm getAppointments={handleAppointmentSearch}/>
            {appointments.length>0 ? appointments.map((app)=>(
                <AvailableAppointment appointment={app}/>
            )) : 'Brak dostępnych wizyt spełniających wybrane kryteria'}
        </div>
    )
}

export default withRouter(NewAppointment);