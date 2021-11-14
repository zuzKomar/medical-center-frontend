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

        return(
            <div className={new Date(app.date).getDate() > new Date(Date.now()).getDate() ? 'appointmentAndCheckup incomingApp' : (((new Date(app.date).getDate()) === (new Date().getDate())) && (new Date(app.date).getTime()) >= (new Date().getTime())) ? 'appointmentAndCheckup todayApp': 'appointmentAndCheckup archivalApp'} onClick={e=>togglePanel(e)}>
                <div className="top">
                    <p className="appointmentAndCheckupHeader">{(app.service ? (app.service.name) : '')}</p>
                    <div className="data">
                        <p>Data:</p>
                        <p>{app.date ? new Date(app.date).toISOString().slice(0,10) : ''}</p>
                        <p>{app.date ? new Date(app.date).toISOString().slice(11,16) : ''}</p>
                    </div>
                </div>
                <div style={{display: 'flex', justifyContent:'space-between'}}>
                    <div>
                        <FaRegUser size={42}/>
                        lek.med. {(app.doctor? (app.doctor.firstName + ' ' + app.doctor.lastName) : '')}
                    </div>
                    {((((new Date(app.date).getDate()) === (new Date().getDate())) && (new Date(app.date).getTime()) >= (new Date().getTime())) && app.confirmed === false)&&
                        <Button variant='primary' size="lg" onClick={e=>handleConfirmation(e)}>Potwierdź przybycie</Button>
                    }
                    {(new Date(app.date).getDate() > new Date(Date.now()).getDate()) &&
                        <Button variant='success' size='lg' onClick={e=>handleCancellation(e)}>Odwołaj</Button>
                    }
                </div>

                {open ? (
                    <div>
                        <hr/>
                        <div className="subsections">
                            <FaCheck size={42}/>
                            <p className="header">Opis</p>
                        </div>
                        <ol>
                            <li>{app.description}</li>
                        </ol>
                        <hr/>

                        <div className="subsections">
                            <FaFile size={42}/>
                            <p className="header">Zrealizowane badania</p>
                        </div>
                        <p>{(app.service ? (app.service.name) : 'Brak badań zrealizowanych podczas wizyty')}</p>
                        <hr/>

                        <div className="subsections">
                            <GiMedicines size={42}/>
                            <p className="header">e-Recepty</p>
                        </div>
                        <p>Brak recept wystawionych na tej wizycie</p>

                    </div>) : null}
            </div>);
}

export default Appointment;