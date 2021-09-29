import React, {useState, useEffect} from "react";
import Appointment from "./Appointment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"



const AppointmentList = () =>{

    const [appointments, setAppointments] = useState([]);
    const [appDate, setAppDate] = useState(new Date());

    useEffect(() =>{
        const getAppointments = async () =>{
            const appointments = await fetchAppointments()
            setAppointments(appointments)
        }

        getAppointments()
    }, [])


    const fetchAppointments = async () =>{
        const res = await fetch('http://localhost:5000/appointments')
        const data = await res.json()

        return data
    }

    return(
        <div>
            <div className="appointmentListHeader">
                <div className="checkBoxesAndButton">
                    <div className="checkboxes">
                        <div className="checkbox">
                            <input type="radio" id="all" name="box" value="all" checked/>
                            <label htmlFor="all">Wszystkie</label>
                        </div>
                        <div className="checkbox">
                            <input type="radio" id="normal" name="box" value="normal"/>
                            <label htmlFor="normal">Wizyta w placówce</label>
                        </div>
                        <div className="checkbox">
                            <input type="radio" id="tele" name="box" value="tele"/>
                            <label htmlFor="tele">Teleporada</label>
                        </div>
                    </div>
                    <div>
                        <button className="bookAppBtn">UMÓW WIZYTĘ</button>
                    </div>
                </div>
            </div>
            <div className="appDate">
                <div className="dateInput">
                    <label htmlFor="appDate">Data:</label>
                    <DatePicker dateFormat="Pp" selected={appDate} onChange={(date) => setAppDate(date)}/>

                </div>
            </div>
            <div className="appointmentList">
                {appointments.map((appointment)=>(
                    <Appointment key={appointment.id} appointment = {appointment}/>
                ))}
            </div>
        </div>
    )
}

export default AppointmentList;