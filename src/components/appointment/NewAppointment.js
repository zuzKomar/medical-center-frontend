import React from "react";
import {useState, useEffect} from "react";
import {withRouter} from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css"
import NewAppointmentForm from "./NewAppointmentForm";
import AvailableAppointment from "./AvailableAppointment";
import AppointmentModal from "./AppointmentModal";

const NewAppointment = () =>{
    const [appointments, setAppointments] = useState([]);
    const [receivedService, setReceivedService] = useState(undefined);
    const [selectedAppointment, setSelectedAppointment] = useState(undefined);
    const [openModal, setOpenModal] = useState(false);


    function handleAppointmentSearch(appointmentType, language, service, doctor, dateFrom, dateTo){
        setReceivedService(service);
    }

    useEffect(()=>{
        if(receivedService !== undefined){
            const getAvailableAppointments = async () =>{
                const apps = await fetchAppointments()
                    .then(apps=>apps.filter(app=>(app.patientId === null)))
                setAppointments(apps)
            }

            getAvailableAppointments()
        }
    },[receivedService])

    useEffect(()=>{
        if(selectedAppointment!==undefined){
            setSelectedAppointment(selectedAppointment)
            console.log(selectedAppointment.id);
        }
    }, [selectedAppointment])

    const fetchAppointments = async ()=>{
        const res = await fetch('http://localhost:5000/appointments')
        const data = await res.json();

        return data;
    }

    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>Nowa wizyta</h2>
            </div>
                <NewAppointmentForm getAppointments={handleAppointmentSearch}/>
            {appointments.length > 0 ? <h3>Dostępne wizyty</h3> : ''}
            {appointments.length > 0 ?
                appointments.map((app)=>(
                <AvailableAppointment key={app.id} appointment={app} setOpenModal={setOpenModal} setSelectedAppointment={setSelectedAppointment}/>
            )) : (receivedService!== undefined ? 'Brak dostępnych wizyt spełniających wybrane kryteria' : '')}

            {(openModal && selectedAppointment !== undefined) ? <AppointmentModal selectedAppointment={selectedAppointment} setOpenModal={setOpenModal}/> : ''}
        </div>
    )
}

export default withRouter(NewAppointment);