import React from "react";
import {useState, useEffect} from 'react';
import {Col, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Schedule from "./Schedule";

const ScheduleForm = () =>{
    const [specializations, setSpecializations] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState(undefined);
    const [selectedDoctor, setSelectedDoctor] = useState(undefined);
    const [schedule, setSchedule] = useState(undefined);
    const [errors, setErrors] = useState({});

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
        const res = await fetch('http://localhost:8080/specializations')
        const data = await res.json()

        return data
    }

    const fetchDoctors = async () =>{
        const res = await fetch(`http://localhost:8080/doctors/specialization?id=${selectedSpecialization.id}`)
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
            newErrors.specialization = 'Należy określić specjalizację';
        }

        if(selectedDoctor === undefined){
            newErrors.doctor = 'Należy określić lekarza';
        }

        return newErrors;
    }

    function handleSubmit(e){
        e.preventDefault();
        const errors = findFormErrors();

        if(Object.keys(errors).length > 0){
            setErrors(errors);
        }else{
            fetch(`http://localhost:8080/doctors/${selectedDoctor.id}/schedule?specializationId=${selectedSpecialization.id}`)
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
                <h2>Grafik lekarzy</h2>
            </div>
            <Form className="newAppointmentForm">
                <Row className="align-items-center mb-3">
                    <Col>
                        <Form.Group>
                            <Form.Label>Wybierz specjalizację:</Form.Label>
                            <Form.Select id="selectedSpecialization" isInvalid={!!errors.specialization}>
                                <option onClick={clearSpecialization}>{'Wybierz specjalizację'}</option>
                                {specializations.map((spec)=>(
                                    <option value={spec} onClick={(e)=>{
                                        setSelectedSpecialization(spec);
                                        setSchedule(undefined);
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
                            <Form.Label>Wybierz lekarza:</Form.Label>
                            <Form.Select id="selectedDoctor" isInvalid={!!errors.doctor}>
                                <option onClick={clearDoctor}>{'Wybierz lekarza'}</option>
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
                    <Button variant='primary' onClick={e=>handleSubmit(e)}>Pokaż grafik</Button>
                </div>
            </Form>
            {(schedule !== undefined && selectedDoctor !== undefined && selectedSpecialization !== undefined) &&
            <Schedule schedule={schedule} />}
        </div>
    )
}

export default ScheduleForm;
