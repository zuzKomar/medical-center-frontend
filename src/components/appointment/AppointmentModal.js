import React from 'react';
import {useState, useEffect} from "react";
import {useHistory} from 'react-router';

const AppointmentModal = ({selectedAppointment, setOpenModal}) => {
    const history = useHistory();
    const [appointment, setAppointment] = useState(selectedAppointment);

    useEffect(()=>{
        if(selectedAppointment!==undefined){
            setAppointment(selectedAppointment);
        }
    }, [selectedAppointment])

    function bookAnAppointment(e){
        e.preventDefault();

        fetch(`http://localhost:5000/appointments/${selectedAppointment.id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                patientId : 1
            }),
        }).then((res) => res.json())
            .then(window.alert('umówiono wizytę'))
            .then(history.push({
                pathname : '/wizyty'
            })).catch((err)=> console.log(err));
    }


    return (
        <div className="modalBackground">
            <div className='modalContainer'>
                <div className="titleCloseBtn">
                    <button onClick={()=>setOpenModal(false)}> X </button>
                </div>
                <div className="modalTitle">
                    <h2>Potwierdź umówienie wizyty</h2>
                    <hr/>
                </div>
                <div className="modalBody">
                    <div className="modalSection">
                        <p>Data:</p>
                        <p>{new Date(appointment.date).toISOString().slice(0,10)}</p>
                    </div>
                    <div className="modalSection">
                        <p>Godzina:</p>
                        <p>{new Date(appointment.date).toISOString().slice(11,16)}</p>
                    </div>
                    <div className="modalSection">
                        <p>Usługa:</p>
                        <p>{appointment.service.name}</p>
                    </div>
                    {appointment.doctor &&  <div className="modalSection">
                        <p>Doktor:</p>
                        <p>{appointment.doctor.firstName + ' ' + appointment.doctor.lastName}</p>
                    </div>}
                </div>
                <div className="modalFooter">
                    <button onClick={()=>setOpenModal(false)} className="cancelButton">Anuluj</button>
                    <button onClick={(e)=>bookAnAppointment(e)}>Potwierdź</button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentModal;
