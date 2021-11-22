import React from "react";
import {useState, useEffect} from "react";
import {FaRegUser, FaCheck, FaFile} from 'react-icons/fa'
import {GiMedicines} from 'react-icons/gi'
import {Button} from "react-bootstrap";


const Appointment = ({appointment, setCancelledAppointment}) =>{
    const [app, setAppointment] = useState(appointment);
    const [open, setOpen] = useState(false);

    useEffect(()=>{
        if(appointment!==undefined){
            setAppointment(appointment);
        }
    }, [appointment])

    function togglePanel(e){
        e.preventDefault();
        setOpen(!open);
    }

    function handleConfirmation(e){
        e.preventDefault();
        let updatedApp = app;
        updatedApp.confirmed = true;
        setAppointment(updatedApp);

        fetch(`http://localhost:5000/appointments/${appointment.id}`, {
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                confirmed : true
            }),
        }).then((res)=>res.json())
            .then(window.alert('wizyta została potwierdzona'))
            .catch((err)=>console.log(err));
    }

    function handleCancellation(e){
        e.preventDefault();
        let updatedApp = app;
        updatedApp.patientId = null;
        setCancelledAppointment(updatedApp);
        setAppointment(updatedApp);


        fetch(`http://localhost:5000/appointments/${appointment.id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                patientId : null
            }),
        }).then((res)=>res.json())
            .then(window.alert('wizyta została odwołana'))
            .catch((err)=>console.log(err));
    }


    const formatYmd = date => date.toISOString().slice(0, 10);
        return(
            <div className={app.date ? (new Date(new Date().setDate(new Date().getDate()+1)) < (new Date(app.date.slice(0,10)))) ? 'appointmentAndCheckup incomingApp'  :
                (((new Date(new Date().setDate(new Date().getDate()+1))).getDate() === (new Date(app.date.slice(0,10))).getDate()) && app.confirmed === false) ? 'appointmentAndCheckup appToConfirm' :
                ((formatYmd(new Date()) === app.date.slice(0,10)) || (((new Date(new Date().setDate(new Date().getDate()+1))).getDate() === (new Date(app.date.slice(0,10))).getDate()) && app.confirmed === true) ? 'appointmentAndCheckup todayApp' :
                'appointmentAndCheckup archivalApp') : ''} onClick={e=>togglePanel(e)}>
                <div className="top">
                    <p className="appointmentAndCheckupHeader">{(app.service ? (app.service.name) : app.serviceName)}</p>
                    <div className="data">
                        <p>Data:</p>
                        <p>{app.date ? new Date(app.date).toISOString().slice(0,10) : ''}</p>
                        <p>{app.date ? new Date(app.date).toISOString().slice(11,16) : ''}</p>
                    </div>
                </div>
                {app.date? <div style={{display: 'flex', justifyContent:'space-between'}}>
                    <div>
                        <FaRegUser size={42}/>
                        lek.med. {(app.doctor? (app.doctor.firstName + ' ' + app.doctor.lastName) : '')}
                    </div>
                    {(((new Date(new Date().setDate(new Date().getDate()+1))).getDate() === (new Date(app.date.slice(0,10))).getDate())  && (app.confirmed === false))&&
                        <Button variant='danger' size="lg" onClick={e=>handleConfirmation(e)}>Potwierdź wizytę</Button>
                    }
                    {((new Date(new Date().setDate(new Date().getDate())) <= (new Date(app.date.slice(0,10))))&&(app.confirmed === false)) &&
                        <Button variant='primary' size='lg' onClick={e=>handleCancellation(e)}>Odwołaj wizytę</Button>
                    }
                </div> : ''}
                {app.recommendations  ? <>
                    {open ? (
                        <div>
                            <hr/>
                            <div className="subsections">
                                <FaCheck size={42}/>
                                <p className="header">Zalecenia</p>
                            </div>
                            <ol>
                                <li>{app.recommendations}</li>
                            </ol>
                            <hr/>

                            <div className="subsections">
                                <FaFile size={42}/>
                                <p className="header">Zrealizowane badania</p>
                            </div>
                            <p>{app.serviceName}</p>
                            <hr/>

                            <div className="subsections">
                                <GiMedicines size={42}/>
                                <p className="header">e-Recepty</p>
                            </div>
                            <p>{app.prescriptions ? 'Wystawiono elektroniczną receptę': 'Brak recept'}</p>

                        </div>) : null}
                    </> : null}

            </div>);
}

export default Appointment;