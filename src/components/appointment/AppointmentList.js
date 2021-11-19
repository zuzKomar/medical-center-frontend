import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import Appointment from "./Appointment";
import Form from "react-bootstrap/Form";
import "react-datepicker/dist/react-datepicker.css"


const AppointmentList = () =>{
    const formatYmd = date => date.toISOString().slice(0,10);
    const facility = 'FACILITY';
    const phone = 'TELEPHONE';
    const [appointments, setAppointments] = useState([]);
    const [appDate, setAppDate] = useState(formatYmd(new Date()));
    const [filteredAppointments, setFilteredAppointments] = useState([appointments]);
    const [canceledAppointment, setCancelledAppointment] = useState(undefined);
    let history = useHistory();

    useEffect(() =>{
        const getAppointments = async () =>{
            const appointments = await fetchAppointments()
                .then(apps=>apps.filter(app=>(app.patientId === 1)))
                .then(apps=>apps.sort((a,b)=>new Date(b.date) - new Date(a.date)))
            setAppointments(appointments)
            setFilteredAppointments(appointments)
        }

        getAppointments()
    }, [canceledAppointment])


    function checkAppId(app){
        return app.patientId !=null;
    }


    useEffect(()=>{
        if(canceledAppointment!==undefined){
            const result = appointments.filter(checkAppId);
            setAppointments(result);
        }
    },[canceledAppointment])

    //dorobić drugi get na planned appointments
    //przerobić istniejący get na done appointments
    const fetchAppointments = async () =>{
        const res = await fetch('http://localhost:5000/appointments')
        const data = await res.json()

        return data
    }

    const handleFacilityFilter = () =>{
        let facilityAppointments = appointments.filter(appointment => (appointment.type === facility));
        setFilteredAppointments(facilityAppointments);
    }

    const handlePhoneFilter = () =>{
        let phoneAppointments = appointments.filter(appointment => (appointment.type === phone));
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
                    <Form>
                        <Form.Group>
                            <Form.Label>Data:</Form.Label>
                            <Form.Control type='date' onChange={(e) => setAppDate(e.target.value)} value={appDate}/>
                        </Form.Group>
                    </Form>
            </div>
            <div className="appointmentList">
                {filteredAppointments.map((appointment)=>(
                    <Appointment key={appointment.id} appointment={appointment} setCancelledAppointment={setCancelledAppointment}/>
                ))}
            </div>
        </div>
    )
}

export default AppointmentList;