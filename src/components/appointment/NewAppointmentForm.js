import React from "react";
import {withRouter} from "react-router-dom";
import {useState, useEffect} from 'react';
import {useHistory} from 'react-router';
import {Col, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {baseUrl} from "../../config/config";


const NewAppointmentForm = ({getAppointments}) =>{

    let history = useHistory();
    const formatYmd = date => date.toISOString().slice(0,10);

    const languages = ["polski", "angielski"];

    const referral = history.location.state;

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
                    setServices(services)
                }
                getServices();

            }else{
                const getServices = async () =>{
                    const services = await fetchServices(false)
                    setServices(services)
                }
                getServices();
            }
        }
    },[appointmentType])

    useEffect(()=>{
        if(service !== undefined){
            if(service.doneByMedicalStaff === false){
                const getDoctors = async () =>{
                    const doctors = await fetchDoctors()
                    setDoctors(doctors)
                    const doctorSelect = document.querySelector('#doctorr');
                    doctorSelect.disabled = false;
                }
                getDoctors()
            }else{
                const doctorSelect = document.querySelector('#doctorr');
                doctorSelect.disabled = true;
            }
        }

    },[service])

    useEffect(()=>{
        if(receivedReferral !== undefined){
            setSelectedReferral(receivedReferral);
            if(receivedReferral.medicalService.facilityService === true){
                setAppointmentType('facility');
                const radioBtnFacility = document.querySelector('#facility');
                radioBtnFacility.checked = true;
            }else{
                setAppointmentType('phone');
                const radioBtnPhone = document.querySelector('#phone');
                radioBtnPhone.checked = true;
            }
            setService(receivedReferral.medicalService);
        }

    },[receivedReferral])

    useEffect(()=>{
        if(selectedReferral !== undefined){
            if(selectedReferral.medicalService.facilityService === true){
                setAppointmentType('facility');
                const radioBtnFacility = document.querySelector('#facility');
                radioBtnFacility.checked = true;
            }else{
                setAppointmentType('phone');
                const radioBtnPhone = document.querySelector('#phone');
                radioBtnPhone.checked = true;
            }
            setService(selectedReferral.medicalService);
        }

    }, [selectedReferral])



    useEffect(()=>{
        const getReferrals = async () =>{
            const referrals = await fetchReferrals()
            setReferrals(referrals)
        }
        getReferrals()
    }, [])


    const fetchReferrals = async () =>{
        const res = await fetch(`${baseUrl}/patients/1/referrals`);
        const data = await res.json();

        return data;
    }

    const fetchDoctors = async () =>{
        let res;
        if(language === 'polski'){
            res = await fetch(`${baseUrl}/doctors/services?language=PL&medicalServiceId=`+service.id);
        }else{
            res = await fetch(`${baseUrl}/doctors/services?language=EN&medicalServiceId=`+service.id);
        }

        const data = await res.json();

        return data;
    }

    const fetchServices = async (type) =>{
        let res;
        if(type === true){
            res = await fetch(`${baseUrl}/medicalServices?type=FACILITY`);
        }else{
            res = await fetch(`${baseUrl}/medicalServices?type=TELEPHONE`);
        }

        const data = await res.json();

        return data;
    }


    const findFormErrors = () =>{
        const newErrors = {};
        if(appointmentType === undefined){
            newErrors.appType = 'Należy określić typ wizyty';
        }

        if(service === undefined){
            newErrors.serviceMess = 'Należy określić usługę';
        }

        return newErrors;
    }

    function clearReferralFields(e){
        e.preventDefault();
        setSelectedReferral(undefined);
        setAppointmentType(undefined);
        const radioBtnFacility = document.querySelector('#facility');
        radioBtnFacility.checked = false;
        const radioBtnPhone = document.querySelector('#phone');
        radioBtnPhone.checked = false;
        setService(undefined);
        setServices([]);
        setDoctors([]);
    }

    function clearService(e){
        if(selectedReferral === undefined){
            e.preventDefault();
            setService(undefined);
            setDoctors([]);
        }
    }


    function handleSubmit(e){
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
                            <Form.Label >Typ wizyty:</Form.Label>
                            <Form.Check type="radio" name="type" id="facility" label="W placówce" onClick={(e)=>{
                                setAppointmentType('facility');
                                if(!!errors['appType'])
                                    setErrors({
                                        ...errors,
                                        ['appType']:null
                                    })
                            }} isInvalid={!!errors.appType}/>
                            <Form.Check type="radio" name="type" id="phone" label="Teleporada" onClick={(e)=>{
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
                                    <Form.Label>Język:</Form.Label>
                                    <Form.Select id='selectedLanguage'>
                                        {languages.map((lang)=>(
                                            <option value={lang} onClick={(e)=>setLanguage(lang)}>{lang}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Skierowanie:</Form.Label>
                                    <Form.Select id='selectedReferral'>
                                        <option>{ selectedReferral ? selectedReferral.issueDate : 'Wykorzystaj skierowanie'}</option>
                                        {selectedReferral &&
                                        <option onClick={e=>{clearReferralFields(e)}}>Wykorzystaj skierowanie</option>
                                        }
                                        {referrals.map((ref) => (
                                            <option value={ref} onClick={(e)=>setSelectedReferral(ref)}>{ref.issueDate}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Usługa:</Form.Label>
                            <Form.Select id = 'selectService' isInvalid={!!errors.serviceMess}>
                                <option onClick={e=>clearService(e)}>{selectedReferral? selectedReferral.medicalService.name : "Wybierz usługę"}</option>
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
                            <Form.Label>Lekarz:</Form.Label>
                            <Form.Select id='doctorr'>
                                <option value="0">Wybierz lekarza</option>
                                {doctors.map((doc) =>(
                                    <option value={doc.firstName + ' ' + doc.lastName} onClick={(e)=>setSelectedDoctor(doc)}>{doc.firstName + ' ' + doc.lastName}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Row className="align-items-center mb-3">
                            <Col>
                                <Form.Group>
                                    <Form.Label>Data od:</Form.Label>
                                    <Form.Control type='date' placeholder='Data od:' value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Data do:</Form.Label>
                                    <Form.Control type='date' placeholder='Data do:' value={dateTo} onChange={(e)=>setDateTo(e.target.value)}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <div style={{display:"flex", justifyContent: 'center'}}>
                            <Button variant='primary' onClick={e=>handleSubmit(e)}>Szukaj wizyty</Button>
                        </div>
                    </Form>
    )
}

export default withRouter(NewAppointmentForm);
