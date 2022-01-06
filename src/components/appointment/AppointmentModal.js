import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router';
import {baseUrl} from "../../config/config";

const AppointmentModal = ({selectedAppointment, setOpenModal, selectedReferral, t, logout}) => {
    const [redirect, setRedirect] = useState(false);
    const [userId, setUserId] = useState(()=>{
        const savedUserId = JSON.parse(sessionStorage.getItem('id'));
        return savedUserId || undefined;
    });

    const [userToken, setUserToken] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('token'));
        return saved || undefined;
    });

    const history = useHistory();
    const [appointment, setAppointment] = useState(selectedAppointment);
    const [referral, setReferral] = useState(selectedReferral);
    let x = (new Date()).getTimezoneOffset() * 60000;

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

    const bookAnAppointment = (e) =>{
        e.preventDefault();

        const formatYmd = date => date.toISOString().slice(0, 10);
        let data;
        if(referral !== null){
            data = {
                patientId : userId,
                referralId : referral.id
            }
        }else{
            data = {
                patientId : userId
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
                'Authorization' : `Bearer ${userToken}`
            },
            body: JSON.stringify(data),
        }).then((res) => {
            if(res.status === 403){
                setRedirect(true);
            }else{
                window.alert(t("appointmentReserved"))
            }
            res.json()
        }).then(history.push({
                pathname : '/appointments'
            })).catch((err)=> console.log(err));
    }

    const formatYmd = date => date.toISOString().slice(0, 10);

    if(redirect === true){
        logout(history);
        return (
            <></>
        )
    }else {
        return (
            <div className="modalBackground">
                <div className="modalContainer">
                    <div className="titleCloseBtn">
                        <button onClick={() => setOpenModal(false)}> X</button>
                    </div>
                    <div className="modalTitle">
                        <h2>{t("confirmAppointment")}</h2>
                        <hr/>
                    </div>
                    <div className="modalBody">
                        <div className="modalSection">
                            <p>{t("date")}</p>
                            <p>{new Date(new Date(appointment.date) - x).toISOString().slice(0, 10)}</p>
                        </div>
                        <div className="modalSection">
                            <p>{t("hour")}</p>
                            <p>{new Date(new Date(appointment.date) - x).toISOString().slice(11, 16)}</p>
                        </div>
                        <div className="modalSection">
                            <p>{t("appointmentType")}</p>
                            <p>{appointment.type === 'FACILITY' ? t("facility") : t("teleconsultation")}</p>
                        </div>
                        <div className="modalSection">
                            <p>{t("service")}</p>
                            <p>{t(appointment.service.name)}</p>
                        </div>
                        {appointment.doctor && <div className="modalSection">
                            <p>{t("doctor")}</p>
                            <p>{appointment.doctor.firstName + ' ' + appointment.doctor.lastName}</p>
                        </div>}
                        {referral !== null && <div className="modalSection">
                            <p>{t("usedReferral")}</p>
                            <p>{referral ? t("yes") : t("no")}</p>
                        </div>}
                        {(new Date(new Date(appointment.date) - x).toISOString().slice(0, 10) === (formatYmd(new Date()))) &&
                        <div className="warning">
                            <p>{t("appointmentAutoConfirm")}</p>
                        </div>}
                        <div className="modalFooter">
                            <button onClick={() => setOpenModal(false)} className="cancelButton">{t("cancel")}</button>
                            <button onClick={(e) => bookAnAppointment(e)}>{t("confirm")}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default AppointmentModal;
