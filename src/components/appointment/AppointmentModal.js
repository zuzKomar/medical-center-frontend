import React from 'react';
import {useState, useEffect} from "react";
import {useHistory} from 'react-router';
import {baseUrl} from "../../config/config";

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

    var x = (new Date()).getTimezoneOffset() * 60000;

    function bookAnAppointment(e){
        e.preventDefault();

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

        if(formatYmd(new Date()) === new Date(new Date(appointment.date)-x).toISOString().slice(0,10)){
            data = {
                ...data,
                confirmed : true
            };
        }

        fetch(`${baseUrl}/appointments/${selectedAppointment.id}/reserve`,{
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


    const formatYmd = date => date.toISOString().slice(0, 10);
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
                        <p>{new Date(new Date(appointment.date)-x).toISOString().slice(0,10)}</p>
                    </div>
                    <div className="modalSection">
                        <p>Godzina:</p>
                        <p>{new Date(new Date(appointment.date)-x).toISOString().slice(11,16)}</p>
                    </div>
                    <div className="modalSection">
                        <p>Typ wizyty:</p>
                        <p>{appointment.type === 'FACILITY' ? 'Wizyta w placówce' : 'Teleporada'}</p>
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
                    {(new Date(new Date(appointment.date)-x).toISOString().slice(0,10) === (formatYmd(new Date()))) && <div className="warning">
                        <p>Wizyta zostanie automatycznie potwierdzona</p>
                    </div>}
                <div className="modalFooter">
                    <button onClick={()=>setOpenModal(false)} className="cancelButton">Anuluj</button>
                    <button onClick={(e)=>bookAnAppointment(e)}>Potwierdź</button>
                </div>
            </div>
        </div>
        </div>
    );
};

export default AppointmentModal;
