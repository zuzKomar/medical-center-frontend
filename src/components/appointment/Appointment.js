import React from "react";
import {useState, useEffect} from "react";
import {FaRegUser, FaCheck, FaFile} from 'react-icons/fa'
import {GiMedicines} from 'react-icons/gi'
import {Button} from "react-bootstrap";
import {baseUrl} from "../../config/config";


const Appointment = ({appointment, setCancelledAppointment, t}) =>{
    const [app, setAppointment] = useState(appointment);
    const [open, setOpen] = useState(false);

    useEffect(()=>{
        if(appointment!==undefined){
            setAppointment(appointment);
            console.log(appointment.date);
        }
    }, [appointment])

    function togglePanel(e){
        e.preventDefault();
        setOpen(!open);
    }

    function handleConfirmation(e){
        e.preventDefault();
        let confirmedApp = app;
        confirmedApp.state = 'CONFIRMED';
        setAppointment(confirmedApp);

        fetch(`${baseUrl}/appointments/${appointment.id}/confirm`, {
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json',
            },
        }).then((res)=>res.json())
            .then(window.alert(t("confirmedAppointmentInfo")))
            .catch((err)=>console.log(err));
    }

    function handleCancellation(e){
        e.preventDefault();
        let cancelledApp = app;
        cancelledApp.state = 'AVAILABLE';
        setCancelledAppointment(cancelledApp);

        fetch(`${baseUrl}/appointments/${appointment.id}/cancel`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json',
            },
        }).then((res)=>res.json())
            .then(window.alert(t("canceledAppointmentInfo")))
            .catch((err)=>console.log(err));
    }

    var x = (new Date()).getTimezoneOffset() * 60000;
    const formatYmd = date => date.toISOString().slice(0, 10);
        return(
            <div className={app.date ? ((new Date(new Date().setDate(new Date().getDate()+1)) < (new Date(app.date.slice(0,10))))&& app.state === 'RESERVED') ? 'appointmentAndCheckup incomingApp'  :
                (((new Date(new Date().setDate(new Date().getDate()+1))).getDate() === (new Date(app.date.slice(0,10))).getDate()) && app.state === 'RESERVED') ? 'appointmentAndCheckup appToConfirm' :
                ((formatYmd(new Date()) === app.date.slice(0,10)) || (((new Date(new Date().setDate(new Date().getDate()+1))).getDate() === (new Date(app.date.slice(0,10))).getDate() && app.state === 'CONFIRMED')) ? 'appointmentAndCheckup todayApp' :
                'appointmentAndCheckup archivalApp') : ''} onClick={e=>togglePanel(e)}>
                <div className="top">
                    <p className="appointmentAndCheckupHeader">{(app.service ? (app.service.name) : app.serviceName)}</p>
                    <div className="data">
                        <p>{t("date")}</p>
                        <p>{appointment.date ? new Date(new Date(appointment.date)-x).toISOString().slice(0,10) : ''}</p>
                        <p>{appointment.date ? new Date(new Date(appointment.date)-x).toISOString().slice(11,16) : ''}</p>
                    </div>
                </div>
                {app.date?
                    <div style={{display: 'flex', justifyContent:'space-between'}}>
                        <div>
                            <FaRegUser size={42}/>
                            {t("doctorTitle")}&nbsp;{(app.doctor? (app.doctor.firstName + ' ' + app.doctor.lastName) : '')}
                        </div>
                        <div className="appointmentButtons">
                            {(((new Date(new Date().setDate(new Date().getDate()+1))).getDate() === (new Date(app.date.slice(0,10))).getDate())  && (app.state === 'RESERVED'))&&
                            <Button variant='danger' size="lg" onClick={e=>handleConfirmation(e)}>{t("confirmAppointmentMessage")}</Button>
                            }

                            {(app.state === 'RESERVED') &&
                            <Button variant='primary' size='lg' onClick={e=>handleCancellation(e)}>{t("cancelAppointmentMessage")}</Button>
                            }
                        </div>
                </div> : ''}
                {(app.recommendations !== null || app.diagnosticTests.length > 0 || app.prescriptions.length > 0)  ?
                    <>
                    {open ? (
                        <div>
                            <hr/>
                            <div className="subsections">
                                <FaCheck size={42}/>
                                <p className="header">{t("recommendations")}</p>
                            </div>
                            <ol>
                                <li>{app.recommendations ? app.recommendations : t("noRecommendations")}</li>
                            </ol>
                            <hr/>

                            <div className="subsections">
                                <FaFile size={42}/>
                                <p className="header">{t("madeCheckUps")}</p>
                            </div>
                            <p>{app.diagnosticTests.length > 0 ? (app.diagnosticTests.map((test)=>test.diagnosticTestName)) : t("noCheckUps")}</p>
                            <hr/>

                            <div className="subsections">
                                <GiMedicines size={42}/>
                                <p className="header">{t("eReceipt")}</p>
                            </div>
                            <p>{app.prescriptions.length > 0 ? t("eReceiptIssued"): t("noReceipts")}</p>
                        </div>) : null}
                    </> : null}
            </div>);
}

export default Appointment;