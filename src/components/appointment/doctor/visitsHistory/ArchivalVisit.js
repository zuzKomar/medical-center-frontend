import React from "react";
import {useState} from "react";
import {FaCheck, FaFile, FaRegUser} from "react-icons/fa";
import {GiMedicines} from "react-icons/gi";

const ArchivalVisit = ({appointment}) => {

    const [open, setOpen] = useState(false);

    function togglePanel(e){
        e.preventDefault();
        setOpen(!open);
    }

    let x = (new Date()).getTimezoneOffset() * 60000;
    return(
        <div className="appointmentAndCheckup archivalApp" onClick={e => togglePanel(e)}>
            <div className="top">
                <p className="appointmentAndCheckupHeader">{appointment.serviceName}</p>
                <div className="data">
                    <p>Data:</p>
                    <p>{appointment.date ? new Date(new Date(appointment.date)-x).toISOString().slice(0,10) : ''}</p>
                    <p>{appointment.date ? new Date(new Date(appointment.date)-x).toISOString().slice(11,16) : ''}</p>
                </div>
            </div>
            <div style={{display: 'flex', justifyContent:'space-between'}}>
                <div>
                    <FaRegUser size={42}/>
                    dr {(appointment.doctor? (appointment.doctor.firstName + ' ' + appointment.doctor.lastName) : '')}
                </div>
            </div>
            {appointment.recommendations  ? <>
                {open ? (
                    <div>
                        <hr/>
                        <div className="subsections">
                            <FaCheck size={42}/>
                            <p className="header">Recommendations</p>
                        </div>
                        <ol>
                            <li>{appointment.recommendations}</li>
                        </ol>
                        <hr/>

                        <div className="subsections">
                            <FaFile size={42}/>
                            <p className="header">Realized Check-ups</p>
                        </div>
                        <p>{appointment.serviceName}</p>
                        <hr/>
                        <div className="subsections">
                            <GiMedicines size={42}/>
                            <p className="header">e-Prescriptions</p>
                        </div>
                        <p>{appointment.prescriptions ? 'Electronic prescription issued': 'No prescription'}</p>
                </div>) : null}
            </> : null}
        </div>
    )
}

export default ArchivalVisit;