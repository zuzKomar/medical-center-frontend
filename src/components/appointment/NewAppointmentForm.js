import React from "react";
import {withRouter} from "react-router-dom";
import {useState, useEffect} from 'react';
import {useHistory} from 'react-router';
import {Col, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {baseUrl} from "../../config/config";

const NewAppointmentForm = ({getAppointments, t}) =>{

    const [userId, setUserId] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('id'));
        return saved || undefined;
    });
    const [userToken, setUserToken] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('token'));
        return saved || undefined;
    });

    let history = useHistory();
    const formatYmd = date => date.toISOString().slice(0,10);
    const referral = history.location.state;
    const languages = ["polski", "english"];

    const [appointmentType, setAppointmentType] = useState(undefined);
    const [language, setLanguage] = useState(languages[0]);
    const [service, setService] = useState(undefined);
    const [receivedReferral, setReceivedReferral] = useState(referral ? referral : undefined);
    const [selectedReferral, setSelectedReferral] = useState(receivedReferral ? receivedReferral : undefined);
    const [doctor, setSelectedDoctor] = useState(undefined);

    const [referrals, setReferrals] = useState([]);
    const [services, setServices] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [dateFrom, setDateFrom] = useState(formatYmd(new Date()));
    const [dateTo, setDateTo] = useState(formatYmd(new Date(new Date().setDate(new Date().getDate()+14))));
    const [errors, setErrors] = useState({});

    useEffect(()=>{
        if(appointmentType !== undefined){
            if(appointmentType === 'facility'){
                const getServices = async () =>{
                    const services = await fetchServices(true)
                    services.forEach(service => service.name = t(service.name));
                    setServices(services)
                }
                getServices();

            }else{
                const getServices = async () =>{
                    const services = await fetchServices(false)
                    services.forEach(service => service.name = t(service.name));
                    setServices(services)
                }
                getServices();
            }
        }
    },[appointmentType])

    useEffect(()=>{
        if(service !== undefined){
            const getDoctors = async () =>{
                const doctors = await fetchDoctors()
                setDoctors(doctors)
                const doctorSelect = document.querySelector('#doctorr');
                doctorSelect.disabled = false;
            }
            getDoctors()
        }
    },[service])

    useEffect(()=>{
        if(receivedReferral !== undefined){
            setSelectedReferral(receivedReferral);
            let element = document.getElementById('selectedReferral');
            element.value = receivedReferral;
            if(receivedReferral.medicalService.facilityService === true){
                setAppointmentType('facility');
                const radioBtnFacility = document.querySelector('#facility');
                radioBtnFacility.checked = true;
            }else{
                setAppointmentType('phone');
                const radioBtnPhone = document.querySelector('#phone');
                radioBtnPhone.checked = true;
            }
            receivedReferral.medicalService.name = t(receivedReferral.medicalService.name)
            setService(receivedReferral.medicalService);
            const serviceSelect = document.querySelector('#selectService');
            serviceSelect.disabled = true;
        }

    },[receivedReferral])

    useEffect(()=>{
        if(selectedReferral !== undefined){
            let element = document.getElementById('selectedReferral');
            element.value = selectedReferral;
            if(selectedReferral.medicalService.facilityService === true){
                setAppointmentType('facility');
                const radioBtnFacility = document.querySelector('#facility');
                radioBtnFacility.checked = true;
                radioBtnFacility.disabled = true;
                const radioBtnPhone = document.querySelector('#phone');
                radioBtnPhone.disabled = true;
            }else{
                setAppointmentType('phone');
                const radioBtnPhone = document.querySelector('#phone');
                radioBtnPhone.checked = true;
                radioBtnPhone.disabled = true;
                const radioBtnFacility = document.querySelector('#facility');
                radioBtnFacility.disabled = true;
            }
            setService(selectedReferral.medicalService);
            const serviceSelect = document.querySelector('#selectService');
            serviceSelect.disabled = true;
        }

    }, [selectedReferral])

    useEffect(()=>{
        const getReferrals = async () =>{
            const formatYmd = date => date.toISOString().slice(0, 10);
            const referrals = await fetchReferrals()
            const availableReferrals = referrals.referrals.filter(ref=>(formatYmd(new Date(ref.expiryDate)) >= formatYmd(new Date())));
            availableReferrals.forEach(referral => {
                referral.medicalService.name = t(referral.medicalService.name)
            })
            setReferrals(availableReferrals);
        }
        getReferrals()
    }, [])


    const fetchReferrals = async () =>{
        const res = await fetch(`${baseUrl}/patients/${userId}/referrals?size=100`,{
            headers: {'Authorization' : `Bearer ${userToken}`}
        });
        const data = await res.json();

        return data;
    }

    const fetchDoctors = async () =>{
        let res;
        if(language === 'polski'){
            res = await fetch(`${baseUrl}/doctors/services?language=PL&medicalServiceId=${service.id}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            });
        }else{
            res = await fetch(`${baseUrl}/doctors/services?language=EN&medicalServiceId=${service.id}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            });
        }

        const data = await res.json();

        return data;
    }

    const fetchServices = async (type) =>{
        let res;
        if(type === true){
            res = await fetch(`${baseUrl}/medicalServices?type=FACILITY`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            });
        }else{
            res = await fetch(`${baseUrl}/medicalServices?type=TELEPHONE`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            });
        }

        const data = await res.json();

        return data;
    }


    const findFormErrors = () =>{
        const newErrors = {};
        if(appointmentType === undefined){
            newErrors.appType = t("appointmentTypeError");
        }

        if(service === undefined){
            newErrors.serviceMess = t("serviceError");
        }

        return newErrors;
    }

    const clearReferralFields = (e) =>{
        e.preventDefault();
        setSelectedReferral(undefined);
        setReceivedReferral(undefined);
        setAppointmentType(undefined);
        const radioBtnFacility = document.querySelector('#facility');
        radioBtnFacility.checked = false;
        radioBtnFacility.disabled = false;
        const radioBtnPhone = document.querySelector('#phone');
        radioBtnPhone.checked = false;
        radioBtnPhone.disabled = false;
        setService(undefined);
        const serviceSelect = document.querySelector('#selectService');
        serviceSelect.disabled = false;
        setServices([]);
        setDoctors([]);
    }

    const clearService = (e) =>{
        if(selectedReferral === undefined){
            e.preventDefault();
            setService(undefined);
            setDoctors([]);
        }
    }

    const handleSubmit = (e) =>{
        e.preventDefault();

        const errors = findFormErrors();

        if(Object.keys(errors).length > 0){
            setErrors(errors)
        }else{
            if(doctor !== undefined){
                if(selectedReferral !== undefined){
                    getAppointments(appointmentType, language, service, doctor, dateFrom, dateTo, selectedReferral);
                }else{
                    getAppointments(appointmentType, language, service, doctor, dateFrom, dateTo, null);
                }
            }else{
                if(selectedReferral !== undefined){
                    getAppointments(appointmentType, language, service, null,  dateFrom, dateTo, selectedReferral);
                }else{
                    getAppointments(appointmentType, language, service, null,  dateFrom, dateTo, null);
                }
            }
        }
    }

    return(
        <Form className="newAppointmentForm">
            <Form.Group className="mb-3">
                <Form.Label >{t("appointmentType")}</Form.Label>
                <Form.Check type="radio" name="type" id="facility" label={t("facility")} onClick={(e)=>{
                    setAppointmentType('facility');
                    if(!!errors['appType'])
                        setErrors({
                            ...errors,
                            ['appType']:null
                        })
                }} isInvalid={!!errors.appType}/>
                <Form.Check type="radio" name="type" id="phone" label={t("teleconsultation")} onClick={(e)=>{
                    setAppointmentType('phone');
                    if(!!errors['appType'])
                        setErrors({
                            ...errors,
                            ['appType']:null
                        })
                }} isInvalid={!!errors.appType}/>
                <Form.Control.Feedback type='invalid'>{errors.appType}</Form.Control.Feedback>
            </Form.Group>
            <Row className="align-items-center mb-3">
                <Col>
                    <Form.Group>
                        <Form.Label>{t("language")}:</Form.Label>
                        <Form.Select id='selectedLanguage'>
                            {languages.map((lang)=>(
                                <option value={lang} onClick={(e)=>setLanguage(lang)}>{lang}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>{t("referral")}:</Form.Label>
                        <Form.Select id='selectedReferral' defaultValue={receivedReferral}>

                            {!receivedReferral &&
                            <>
                                <option onClick={e=>{clearReferralFields(e)}} value="0">{t("useReferral")}</option>
                                {referrals.map((ref) => (
                                    <option value={ref} key={ref.id} onClick={(e)=>{
                                        setSelectedReferral(ref)
                                        setErrors({
                                            ['serviceMess']:null,
                                            ['appType']:null
                                        })
                                    }}>{ref.medicalService ? (t("dueTo") + " " + ref.expiryDate + ' - ' + ref.medicalService.name) : ''}</option>
                                ))}
                            </>
                            }

                            {receivedReferral &&
                                <>
                                    <option value={receivedReferral}>{(t("dueTo") + " " + receivedReferral.expiryDate + ' - ' + receivedReferral.medicalService.name)}</option>
                                    <option onClick={e=>{clearReferralFields(e)}} value="0">{t("useReferral")}</option>

                                    {referrals.filter(ref=>ref.id!==receivedReferral.id).map((ref) => (
                                        <option value={ref} key={ref.id} onClick={(e)=>{
                                            setSelectedReferral(ref)
                                            setErrors({
                                                ['serviceMess']:null,
                                                ['appType']:null
                                            })
                                        }}>{ref.medicalService ? (t("dueTo") + " " + ref.expiryDate + ' - ' + ref.medicalService.name) : ''}</option>
                                    ))}
                                </>
                            }
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className="mb-3">
                <Form.Label>{t("service")}</Form.Label>
                <Form.Select id = 'selectService' isInvalid={!!errors.serviceMess}>
                    <option onClick={e=>clearService(e)}>{selectedReferral ? selectedReferral.medicalService.name : t("chooseService")}</option>
                    {services.map((ser)=>(
                        <option value={ser.name} onClick={(e)=>{
                            setService(ser);
                            if(!!errors['serviceMess'])
                                setErrors({
                                    ...errors,
                                    ['serviceMess']:null
                                })
                        }}>{ser.name}</option>
                    ))}
                </Form.Select>
                <Form.Control.Feedback type='invalid'>{errors.serviceMess}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>{t("doctor")}</Form.Label>
                <Form.Select id='doctorr'>
                    <option value="0">{t("chooseDoctor")}</option>
                    {doctors.map((doc) =>(
                        <option value={doc.firstName + ' ' + doc.lastName} onClick={(e)=>setSelectedDoctor(doc)}>{doc.firstName + ' ' + doc.lastName}</option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Row className="align-items-center mb-3">
                <Col>
                    <Form.Group>
                        <Form.Label>{t("dateFrom")}</Form.Label>
                        <Form.Control type='date' placeholder={t("dateFrom")} value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)}/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>{t("dateTo")}</Form.Label>
                        <Form.Control type='date' placeholder={t("dateTo")} value={dateTo} onChange={(e)=>setDateTo(e.target.value)}/>
                    </Form.Group>
                </Col>
            </Row>
            <div style={{display:"flex", justifyContent: 'center'}}>
                <Button variant='primary' onClick={e=>handleSubmit(e)}>{t("searchAppointment")}</Button>
            </div>
        </Form>
    )
}

export default withRouter(NewAppointmentForm);
