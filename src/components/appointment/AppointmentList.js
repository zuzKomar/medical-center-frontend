import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import Appointment from "./Appointment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"


const AppointmentList = () =>{

    const [appointments, setAppointments] = useState([]);
    const [appDate, setAppDate] = useState(new Date());
    const [filteredAppointments, setFilteredAppointments] = useState([appointments]);
    let history = useHistory();

    useEffect(() =>{
        const getAppointments = async () =>{
            const appointments = await fetchAppointments()
            setAppointments(appointments)
            setFilteredAppointments(appointments)
        }

        getAppointments()
    }, [])


    const fetchAppointments = async () =>{
        const res = await fetch('http://localhost:5000/appointments')
        const data = await res.json()

        return data
    }

    const handleFacilityFilter = () =>{
        let facilityAppointments = appointments.filter(appointment => (appointment.type === "facility"));
        setFilteredAppointments(facilityAppointments);
    }

    const handlePhoneFilter = () =>{
        let phoneAppointments = appointments.filter(appointment => (appointment.type === "phone"));
        setFilteredAppointments(phoneAppointments);
    }

    const handleShowAll = () =>{
        setFilteredAppointments(appointments);
    }

    const handleClick = () =>{
        history.push("/nowa-wizyta");
    }

    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>Twoje wizyty</h2>
            </div>
            <div className="appointmentListHeader">
                <div className="checkBoxesAndButton">
                    <div className="checkboxes">
                        <div className="checkbox">
                            <input type="radio" id="all" name="box" value="all" onChange={handleShowAll}/>
                            <label htmlFor="all">Wszystkie</label>
                        </div>
                        <div className="checkbox">
                            <input type="radio" id="normal" name="box" value="normal" onChange={handleFacilityFilter}/>
                            <label htmlFor="normal">Wizyta w placówce</label>
                        </div>
                        <div className="checkbox">
                            <input type="radio" id="tele" name="box" value="tele" onChange={handlePhoneFilter}/>
                            <label htmlFor="tele">Teleporada</label>
                        </div>
                    </div>
                    <div >
                        <button className="actionButton" onClick={handleClick}>UMÓW WIZYTĘ</button>
                    </div>
                </div>
            </div>
            <div className="appDate">
                    <label htmlFor="appDate">Data:</label>
                    <DatePicker dateFormat="Pp" selected={appDate} onChange={(date) => setAppDate(date)}/>
            </div>
            <div className="appointmentList">
                {filteredAppointments.map((appointment)=>(
                    <Appointment key={appointment.id} appointment = {appointment}/>
                ))}
            </div>
        </div>
    )
}

export default AppointmentList;