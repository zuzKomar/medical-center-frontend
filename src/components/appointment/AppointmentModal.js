import React from 'react';
import {useState, useEffect} from "react";
import {useHistory} from 'react-router';

const AppointmentModal = ({selectedAppointment, setOpenModal, selectedReferral}) => {
    const history = useHistory();
    const [appointment, setAppointment] = useState(selectedAppointment);
    const [referral, setReferral] = useState(selectedReferral);

    useEffect(()=>{
        if(selectedAppointment !== undefined){
            setAppointment(selectedAppointment);

        }
    }, [selectedAppointment])

    useEffect(()=>{
        if(selectedReferral !== undefined){
            setReferral(selectedReferral);
        }
    },[selectedReferral])

    function bookAnAppointment(e){
        e.preventDefault();

        //bedzie inna koncowka
        //http://localhost:8080/appointments/{id}/reservation    PATCH

        const formatYmd = date => date.toISOString().slice(0, 10);
        let data;
        if(referral !== null){
            data = {
                patientId : 1,
                referralId : referral.id
            }
        }else{
            data = {
                patientId : 1
            }
        }

        if(formatYmd(new Date()) === appointment.date.slice(0,10)){
            data = {
                ...data,
                confirmed : true
            };
        }

        fetch(`http://localhost:5000/appointments/${selectedAppointment.id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((res) => res.json())
            .then(window.alert('Umówiono wizytę'))
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
                    {referral !== null && <div className="modalSection">
                        <p>Wykorzystane skierowanie:</p>
                        <p>{referral ? 'tak' : 'nie'}</p>
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
