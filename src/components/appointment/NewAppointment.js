import React from "react";
import {useState, useEffect} from "react";
import {withRouter} from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css"
import NewAppointmentForm from "./NewAppointmentForm";
import AvailableAppointment from "./AvailableAppointment";
import AppointmentModal from "./AppointmentModal";
import {baseUrl} from "../../config/config";

const NewAppointment = () =>{
    const [appointments, setAppointments] = useState([]);
    const [receivedService, setReceivedService] = useState(undefined);
    const [selectedAppointment, setSelectedAppointment] = useState(undefined);
    const [selectedReferral, setSelectedReferral] = useState(undefined);
    const [openModal, setOpenModal] = useState(false);
    const [dateFrom, setDateFrom] = useState(undefined);
    const [dateTo, setDateTo] = useState(undefined);
    const [doctor, setDoctor] = useState(undefined);
    const [language, setLanguage] = useState(undefined);


    function handleAppointmentSearch(appointmentType, language, service, doctor, dateFrom, dateTo, selectedReferral){
        setReceivedService(service);
        setSelectedReferral(selectedReferral);
        setDateFrom(dateFrom);
        setDateTo(dateTo);
        setDoctor(doctor);
        if(language==='polski'){
            setLanguage("PL");
        }else{
            setLanguage("EN");
        }
    }

    useEffect(()=>{
        if(receivedService !== undefined){
            const getAvailableAppointments = async () =>{
                const apps = await fetchAppointments();

                setAppointments(apps.appointments)
            }

            getAvailableAppointments()
        }
    },[receivedService])

    useEffect(()=>{
        if(selectedAppointment!==undefined){
            setSelectedAppointment(selectedAppointment)
        }
    }, [selectedAppointment])

    const fetchAppointments = async ()=>{
        let res;
        if(doctor!==null){
            res = await fetch(`${baseUrl}/appointments?medicalServiceId=${receivedService.id}&doctorId=${doctor.id}&dateFrom=${dateFrom}T00:00:00&dateTo=${dateTo}T00:00:00&language=${language}`);
        }else{
            res = await fetch(`${baseUrl}/appointments?medicalServiceId=${receivedService.id}&dateFrom=${dateFrom}T00:00:00&dateTo=${dateTo}T00:00:00&language=${language}&size=5`);
        }
        const data = await res.json();

        return data;
    }

    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>Nowa wizyta</h2>
            </div>
                <NewAppointmentForm getAppointments={handleAppointmentSearch}/>
            {appointments.length > 0 ? <h3 style={{fontFamily : 'Montserrat, sans-serif'}}>Dostępne wizyty</h3> : ''}
            {appointments.length > 0 ?
                appointments.map((app)=>(
                <AvailableAppointment key={app.id} appointment={app} setOpenModal={setOpenModal} setSelectedAppointment={setSelectedAppointment}/>
            )) : (receivedService!== undefined ? 'Brak dostępnych wizyt spełniających wybrane kryteria' : '')}

            {(openModal && selectedAppointment !== undefined) ? <AppointmentModal selectedAppointment={selectedAppointment} setOpenModal={setOpenModal} selectedReferral={selectedReferral}/> : ''}
        </div>
    )
}

export default withRouter(NewAppointment);