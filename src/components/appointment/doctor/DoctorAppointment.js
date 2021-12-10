import React, {useState} from "react";
import {FaRegUser} from "react-icons/fa";
import moment from "moment";

const DoctorAppointment = ({appointment}) => {
    const [app, setAppointment] = useState(appointment);

    let x = (new Date()).getTimezoneOffset() * 60000;
    let a = moment(Date.now());
    let b = moment(app.patient.birthDate)
    return (
        <div className="appointmentAndCheckup archivalApp">
            <div className="top">
                <p className="appointmentAndCheckupHeader">{app.medicalServiceName}</p>
                <div className="data">
                    <p>Hour: {appointment.date ? new Date(new Date(appointment.date)-x).toISOString().slice(11,16) : ''}</p>
                </div>
            </div>
            <div>
                <p><FaRegUser size={42}/>{(app.patient? (app.patient.firstName + ' ' + app.patient.lastName) : '')}</p>
                <p>Age: {a.diff(b, 'year')}</p>
                {app.type==='TELEPHONE' ? 'Phone number: ' + app.patient.phoneNumber : ''}
            </div>
        </div>
    )
}

export default DoctorAppointment;