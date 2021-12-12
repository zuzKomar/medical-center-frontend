import React from "react";
import {FaRegUser} from "react-icons/fa";
import moment from "moment";
import {useHistory} from 'react-router';
import {GiConfirmed} from "react-icons/all";

const DoctorAppointment = ({appointment}) => {

    const history = useHistory();
    let x = (new Date()).getTimezoneOffset() * 60000;
    let a = moment(Date.now());
    let b = moment(appointment.patient.birthDate)

    const handleClick = e => {
        e.preventDefault();

        history.push({
            pathname: `/today-visits/${appointment.id}/details`,
            state: appointment
        })
    }

    return (
        <div className={appointment.state === 'DONE' ? "appointmentAndCheckup todayApp" : "appointmentAndCheckup archivalApp"}>
            <div className="top">
                <p className="appointmentAndCheckupHeader">{appointment.medicalServiceName}</p>
                <div className="data">
                    {appointment.state === 'DONE' && <p><GiConfirmed size={42} style={{color: "#18a74b"}}/></p>}
                    <p>Hour: {appointment.date ? new Date(new Date(appointment.date)-x).toISOString().slice(11,16) : ''}</p>
                </div>
            </div>
            <div>
                <p><FaRegUser size={42}/>{(appointment.patient ? (appointment.patient.firstName + ' ' + appointment.patient.lastName) : '')}</p>
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