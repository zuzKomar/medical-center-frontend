import React from "react";
import {useState, useEffect, useRef} from 'react';
import {Col, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Schedule from "./Schedule";
import {baseUrl} from "../../config/config";

const ScheduleForm = ({t}) =>{

    const [userToken, setUserToken] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('token'));
        return saved || undefined;
    });

    const [specializations, setSpecializations] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState(undefined);
    const [selectedDoctor, setSelectedDoctor] = useState(undefined);
    const [schedule, setSchedule] = useState(undefined);
    const [errors, setErrors] = useState({});
    const ref = useRef();

    const reset = () =>{
        ref.current.value = t("chooseDoctor");
    };

    useEffect(()=>{
        const getSpecializations = async () =>{
            const specializations = await fetchSpecializations()
            setSpecializations(specializations)
        }

        getSpecializations();
    },[])


    useEffect(()=>{
        if(selectedSpecialization!==undefined){
            const getDoctors = async () =>{
                const doctors = await fetchDoctors()
                setDoctors(doctors)
            }

            getDoctors()
        }

    }, [selectedSpecialization])

    const fetchSpecializations = async () =>{
        const res = await fetch(`${baseUrl}/specializations`,{
            headers: {'Authorization' : `Bearer ${userToken}`}
        })
        const data = await res.json()

        return data
    }

    const fetchDoctors = async () =>{
        const res = await fetch(`${baseUrl}/doctors/specialization?id=${selectedSpecialization.id}`,{
            headers: {'Authorization' : `Bearer ${userToken}`}
        })
        const data = await res.json()

        return data
    }

    function clearSpecialization(){
        setSelectedSpecialization(undefined);
        setDoctors([]);
        setSchedule(undefined);
    }

    function clearDoctor(){
        setSelectedDoctor(undefined);
        setSchedule(undefined);
    }

    const findFormErrors = () =>{
        const newErrors = {};
        if(selectedSpecialization === undefined){
            newErrors.specialization = t("specializationError");
        }

        if(selectedDoctor === undefined){
            newErrors.doctor = t("doctorError");
        }

        return newErrors;
    }

    function handleSubmit(e){
        e.preventDefault();
        const errors = findFormErrors();

        if(Object.keys(errors).length > 0){
            setErrors(errors);
        }else{
            fetch(`${baseUrl}/doctors/${selectedDoctor.id}/schedule?specializationId=${selectedSpecialization.id}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
                .then((res)=>res.json())
                .then((obj)=>{
                    setSchedule(obj)
                })
                .catch((err)=>console.log(err));
        }
    }

    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>{t("doctorSchedule")}</h2>
            </div>
            <Form className="newAppointmentForm">
                <Row className="align-items-center mb-3">
                    <Col>
                        <Form.Group>
                            <Form.Label>{t("chooseSpecialization")}:</Form.Label>
                            <Form.Select id="selectedSpecialization" isInvalid={!!errors.specialization}>
                                <option onClick={clearSpecialization}>{t("chooseSpecialization")}</option>
                                {specializations.map((spec)=>(
                                    <option value={spec} onClick={(e)=>{
                                        setSelectedDoctor(undefined);
                                        reset();
                                        setSchedule(undefined);
                                        setSelectedSpecialization(spec);

                                        if(!!errors['specialization'])
                                            setErrors({
                                                ...errors,
                                                ['specialization']:null
                                            })
                                    }}>{spec.name}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type='invalid'>{errors.specialization}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="align-items-center mb-3">
                    <Col>
                        <Form.Group>
                            <Form.Label>{t("chooseDoctor")}:</Form.Label>
                            <Form.Select id="selectedDoctor" isInvalid={!!errors.doctor} ref={ref}>
                                <option onClick={clearDoctor}>{t("chooseDoctor")}</option>
                                {doctors.map((doc)=>(
                                    <option value={doc} onClick={(e)=>{
                                        setSelectedDoctor(doc);
                                        setSchedule(undefined);
                                        if(!!errors['doctor'])
                                            setErrors({
                                                ...errors,
                                                ['doctor']:null
                                            })
                                    }}>{doc.firstName +  ' ' + doc.lastName}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type='invalid'>{errors.doctor}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
                <div style={{display:"flex", justifyContent: 'center'}}>
                    <Button variant='primary' onClick={e=>handleSubmit(e)}>{t("showSchedule")}</Button>
                </div>
            </Form>
            {(schedule !== undefined && selectedDoctor !== undefined && selectedSpecialization !== undefined) &&
            <Schedule schedule={schedule} />}
        </div>
    )
}

export default ScheduleForm;
