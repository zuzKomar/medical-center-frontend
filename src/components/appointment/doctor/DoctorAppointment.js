import React, {useState, useEffect} from "react";
import {FaRegUser} from "react-icons/fa";
import moment from "moment";
import {useHistory} from 'react-router';
import {GiConfirmed} from "react-icons/all";

const DoctorAppointment = ({app, t}) => {
    const history = useHistory();
    const [appointment, setAppointment] = useState(app);
    const done = 'DONE';
    const telephone = 'TELEPHONE';
    let x = (new Date()).getTimezoneOffset() * 60000;
    let a = moment(Date.now());
    let b = moment(appointment.patient.birthDate)

    useEffect(()=>{
        if(app !== undefined){
            setAppointment(app);
        }
    },[app])

    const handleClick = e => {
        e.preventDefault();

        history.push({
            pathname: `/today-visits/${appointment.id}/details`,
            state: appointment
        })
    }

    return (
        <div className={appointment.state === done ? "appointmentAndCheckup todayApp" : "appointmentAndCheckup archivalApp"}>
            <div className="top">
                <p className="appointmentAndCheckupHeader">{t(appointment.medicalServiceName)}</p>
                <div className="data">
                    {appointment.state === done && <p><GiConfirmed size={42} style={{color: "#18a74b"}}/></p>}
                    <p>{t("hour")}&nbsp;{appointment.date ? new Date(new Date(appointment.date)-x).toISOString().slice(11,16) : ''}</p>
                </div>
            </div>
            <div>
                <p><FaRegUser size={42}/>{(appointment.patient ? (appointment.patient.firstName + ' ' + appointment.patient.lastName) : '')}</p>
                <p>{t("age")}&nbsp;{a.diff(b, 'year')}</p>
                {appointment.type === telephone ? t("phoneNumber") + ' ' + appointment.patient.phoneNumber : ''}
            </div>
            {appointment.state !== done &&
                <>
                    <hr />
                    <div style={{display: 'flex' ,justifyContent: 'flex-end'}}>
                        <button className="actionButton" onClick={e => handleClick(e)}>{t("startVisit")}</button>
                    </div>
                </>
            }
        </div>
    )
}

export default DoctorAppointment;