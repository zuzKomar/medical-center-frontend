import React, {useEffect, useState} from 'react';
import Form from "react-bootstrap/Form";
import {Col, Row} from "react-bootstrap";
import {baseUrl} from "../../../config/config";
import RangeSlider from "react-bootstrap-range-slider";

const AppointmentDetailsForm = () => {
    const [services, setServices] = useState([]);
    const [referralExpiryDate, setReferralExpiryDate] = useState([Date.now()]);
    const [checkUps, setCheckUps] = useState([]);
    const [medications, setMedications] = useState([]);
    const [medicationQuantity, setMedicationQuantity] = useState(1);

    useEffect(() => {
        const getServices = async () => {
            const services = await fetchServices()
            setServices(services)
        }
        getServices();
    }, [])

    const fetchServices = async () =>{
        const res = await fetch(`${baseUrl}/medicalServices`);
        return await res.json();
    }

    useEffect(() => {
        const getCheckUps = async () => {
            const checkUps = await fetchCheckUps()
            setCheckUps(checkUps)
        }
        getCheckUps()
    }, [])

    const fetchCheckUps = async () =>{
        const res = await fetch(`${baseUrl}/checkups`);
        return await res.json();
    }

    useEffect(() => {
        const getMedications = async () => {
            const checkUps = await fetchMedications()
            setMedications(checkUps)
        }
        getMedications()
    }, [])

    const fetchMedications = async () =>{
        const res = await fetch(`${baseUrl}/medications`);
        return await res.json();
    }

    return (
        <Form className="newAppointmentForm">
            <Form.Group className="mb-3" controlId="detailsForm.ControlTextArea1">
                <Form.Label>Visit's description:</Form.Label>
                <Form.Control as="textarea" rows={3} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="detailForm.ControlTextArea2">
                <Form.Label>Recommendations:</Form.Label>
                <Form.Control as="textarea" rows={3} />
            </Form.Group>
            <Row className="mb-3">
                <Col md>
                    <Form.Label>Referrals:</Form.Label>
                    <Form.Group>
                        <Form.Label column="sm">Choose a service: </Form.Label>
                        <Form.Select aria-label="Floating label select example">
                            {services.map(function (service) {
                                return <option key={service.id} value={service.id}>{service.name}</option>
                            })}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label column="sm">Choose an expiration date: </Form.Label>
                        <Form.Control type='date' placeholder='Data od:' value={referralExpiryDate} onChange={e => setReferralExpiryDate(e.target.value)}/>
                    </Form.Group>
                </Col>
                <Col md>

                </Col>
            </Row>
            <hr />
            <div style={{display: 'flex' ,justifyContent: 'space-between'}}>
                <button className="addButton">ADD REFERRAL</button>
                <button className="deleteButton">DELETE REFERRAL</button>
            </div>
            <Row className="mb-3 topBuffer">
                <Col md>
                    <Form.Label>Medications:</Form.Label>
                    <Form.Group>
                        <Form.Label column="sm">Choose a medication: </Form.Label>
                        <Form.Select aria-label="Floating label select example">
                            {medications.map(function (medication) {
                                return <option key={medication.id} value={medication.id}>{medication.name}</option>
                            })}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label column="sm">Dosage: </Form.Label>
                        <Form.Control type="text" placeholder="Dosage" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label column="sm">Choose the number of packages: </Form.Label>
                        <RangeSlider
                            value={medicationQuantity}
                            onChange={e => setMedicationQuantity(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col md>

                </Col>
            </Row>
            <hr />
            <div style={{display: 'flex' ,justifyContent: 'space-between'}}>
                <button className="addButton">ADD MEDICATION</button>
                <button className="deleteButton">DELETE MEDICATION</button>
            </div>
            <Row>

            </Row>
            <div className="topBuffer">
                <Form.Label>Check-ups:</Form.Label>
                <Row className="mb-3">
                    <Col md>
                        <Form.Group>
                            <Form.Label column="sm">Choose a check-up: </Form.Label>
                            <Form.Select aria-label="Floating label select example">
                                {checkUps.map(function (checkUp) {
                                    return <option key={checkUp.id} value={checkUp.id}>{checkUp.name}</option>
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md />
                </Row>
                <Row className="mb-3">
                    <Col md>
                        <Form.Group className="mb-3" controlId="detailForm.ControlTextArea2">
                            <Form.Label column="sm">Recommendations:</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group className="mb-3" controlId="detailForm.ControlTextArea2">
                            <Form.Label column="sm">Result:</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label column="sm">Add file:</Form.Label>
                            <Form.Control type="file" size="sm" />
                        </Form.Group>
                    </Col>
                    <Col md />
                </Row>
            </div>
        </Form>
    )
}

export default AppointmentDetailsForm;