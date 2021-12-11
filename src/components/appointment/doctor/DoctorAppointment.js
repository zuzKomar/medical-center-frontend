import React, {useState} from "react";
import {FaRegUser} from "react-icons/fa";
import moment from "moment";
import {useHistory} from 'react-router';

const DoctorAppointment = ({appointment}) => {
    const history = useHistory();
    const [app, setAppointment] = useState(appointment);

    const handleClick = e => {
        e.preventDefault();

        history.push({
            pathname: `/today-visits/${appointment.id}/details`,
            state: appointment
        })
    }

    let x = (new Date()).getTimezoneOffset() * 60000;
    let a = moment(Date.now());
    let b = moment(appointment.patient.birthDate)
    return (
        <div className="appointmentAndCheckup archivalApp">
            <div className="top">
                <p className="appointmentAndCheckupHeader">{appointment.medicalServiceName}</p>
                <div className="data">
                    <p>Hour: {appointment.date ? new Date(new Date(appointment.date)-x).toISOString().slice(11,16) : ''}</p>
                </div>
            </div>
            <div>
                <p><FaRegUser size={42}/>{(appointment.patient? (appointment.patient.firstName + ' ' + appointment.patient.lastName) : '')}</p>
                <p>Age: {a.diff(b, 'year')}</p>
                {appointment.type==='TELEPHONE' ? 'Phone number: ' + appointment.patient.phoneNumber : ''}
            </div>
            <hr />
            <div style={{display: 'flex' ,justifyContent: 'flex-end'}}>
                <button className="actionButton" onClick={e => handleClick(e)}>VISIT'S DETAILS</button>
            </div>
        </div>
    )
}

export default DoctorAppointment;