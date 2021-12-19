import React, {useEffect, useState, useRef} from 'react';
import Form from "react-bootstrap/Form";
import {Col, Row} from "react-bootstrap";
import {baseUrl} from "../../../config/config";
import RangeSlider from "react-bootstrap-range-slider";
import Button from "react-bootstrap/Button";

const AppointmentDetailsForm = ({appointment}) => {
    const formatYmd = date => date.toISOString().slice(0,10);
    const ref = useRef();

    //dane pobrane
    const [services, setServices] = useState([]);
    const [checkUps, setCheckUps] = useState([]);
    const [medications, setMedications] = useState([]);


    const [app, setApp] = useState(appointment); //id przekazanej wizyty potrzebne do POSTa
    const [description, setDescription] = useState(undefined); //opis wizyty <nullable>
    const [recommendations, setRecommendations] = useState(undefined); //zalecenia <nullable>

    //lista skierowań
    const [service, setService] = useState(undefined);
    const [referralExpiryDate, setReferralExpiryDate] = useState(formatYmd(new Date(new Date().setDate(new Date().getDate()+31))));
    const [referralToDelete, setReferralToDelete] = useState(undefined);
    const [referrals, setReferrals] = useState([]);

    //lista leków
    const [medication, setMedication] = useState(undefined);
    const [medicationDosage, setMedicationDosage] = useState(undefined);
    const [medicationQuantity, setMedicationQuantity] = useState(1);
    const [medicationToDelete, setMedicationToDelete] = useState(undefined);
    const [medicationsToAdd, setMedicationsToAdd] = useState([]);

    //lista badań
    const [selectedCheckup, setSelectedCheckup] = useState(undefined);
    const [checkUpsToAdd, setCheckUpsToAdd] = useState([]);
    const [checkupToDelete, setCheckupToDelete] = useState(undefined);
    const [checkupDescription, setCheckupDescription] = useState(undefined);
    const [checkupResult, setCheckupResult] = useState(undefined);
    const [checkupResultFile, setCheckupResultFile] = useState(undefined);

    const reset = () =>{
        ref.current.value = "";
    };

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

    const handleReferralAddition = (e) => {
        e.preventDefault();
        let referral = {};

        if (service !== undefined) {
            referral["medicalServiceId"] = service.id;
            referral["medicalServiceName"] = service.name;
            referral["expiryDate"] = referralExpiryDate;

            referrals.push(referral)
            setService(undefined);
        }
    }

    const handleReferralDeletion = (e) =>{
        e.preventDefault();
        if(referralToDelete !== undefined){
           const refIndex = referrals.indexOf(referralToDelete);
           if(refIndex > -1){
               referrals.splice(refIndex, 1);
               setReferrals(referrals);
               setReferralToDelete(undefined);
           }
        }
    }

    const handleMedicationAddition = (e) =>{
        e.preventDefault();
        let medicine = {};

        if(medication !== undefined && medicationDosage !== undefined){
            medicine["numberOfPackages"] = medicationQuantity;
            medicine["dosing"] = medicationDosage;
            medicine["medicationId"] = medication.id;
            medicine["name"] = medication.name;

            medicationsToAdd.push(medicine);
            setMedication(undefined);
        }
    }

    const handleMedicationDeletion = (e) =>{
        e.preventDefault();
        if(medicationToDelete !== undefined){
            const medIndex = medicationsToAdd.indexOf(medicationToDelete);
            if(medIndex > -1){
                medicationsToAdd.splice(medIndex, 1);
                setMedicationsToAdd(medicationsToAdd);
                setMedicationToDelete(undefined);
            }
        }
    }

    const handleCheckupAddition = (e) =>{
        e.preventDefault();
        let addedCheckup = {};

        if(selectedCheckup !== undefined){
            addedCheckup["checkUpId"] = selectedCheckup.id;
            addedCheckup["name"] = selectedCheckup.name;

            if(checkupDescription !== undefined){
                addedCheckup["description"] = checkupDescription;
            }
            if(checkupResult !== undefined){
                addedCheckup["result"] = checkupResult;
            }
            if(checkupResultFile !== undefined){
                addedCheckup["file"] = checkupResultFile;
            }

            checkUpsToAdd.push(addedCheckup);
            setSelectedCheckup(undefined);
            setCheckupDescription('');
            setCheckupResult('');
            setCheckupResultFile(undefined);
            reset();
        }
    }

    const handleCheckupDeletion = (e) =>{
        e.preventDefault();
        if(checkupToDelete !== undefined){
            const checkupIndex = checkUpsToAdd.indexOf(checkupToDelete);
            if(checkupIndex > -1){
                checkUpsToAdd.splice(checkupIndex, 1);
                setCheckUpsToAdd(checkUpsToAdd);
                setCheckupToDelete(undefined);
            }
        }
    }

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleFileUpload = async (e) =>{
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        let data = base64.split('base64,')[1];
        let binaryData = atob(data);

        let byteNumbers = new Array(binaryData.length);
        for(let i = 0; i < binaryData.length; i++){
            byteNumbers[i] = binaryData.charCodeAt(i);
        }
        let test = new Uint8Array(byteNumbers);
        let array = Array.from(test);
        setCheckupResultFile(array);
    }

    const seeResult = (e) =>{
        e.preventDefault();
        let prescriptions = [];

        if(medicationsToAdd.length > 0){
            let prescription = {};
            let expiryDate = formatYmd(new Date(new Date().setDate(new Date().getDate()+31)));
            let accessCode = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
            let medications = medicationsToAdd;

            prescription["expiryDate"] = expiryDate;
            prescription["accessCode"] = accessCode;
            prescription["medications"] = medications;
            prescriptions = [prescription]; //do patcha
        }

        let fetchBody = {};
        fetchBody["description"] = description;
        fetchBody["recommendations"] = recommendations;
        fetchBody["referrals"] = referrals;
        fetchBody["prescriptions"] = prescriptions;
        fetchBody["checkUps"] = checkUpsToAdd;


        fetch(`${baseUrl}/appointments/${app.id}/done`,{
            method : 'PATCH',
            headers :{
                'Content-Type': 'application/json',
            },
            body : JSON.stringify(fetchBody)
        }).then((res)=>res.json())
            .then(window.alert('Szczegóły wizyty zostały dodane'))
            .catch((err)=>console.log(err));
    }

    return (
        <Form className="newAppointmentForm">
            <Form.Group className="mb-3" controlId="detailsForm.ControlTextArea1">
                <Form.Label>Visit's description:</Form.Label>
                <Form.Control as="textarea" rows={3} value={description} onChange={(e)=>setDescription(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="detailForm.ControlTextArea2">
                <Form.Label>Recommendations:</Form.Label>
                <Form.Control as="textarea" rows={3} value={recommendations} onChange={(e)=>setRecommendations(e.target.value)}/>
            </Form.Group>
            <Row className="mb-3">
                <Form.Label>Referrals:</Form.Label>
                <Col md>
                    <Form.Group>
                        <Form.Label column="sm">Choose a service: </Form.Label>
                        <Form.Select aria-label="Floating label select example">
                            <option onClick={() => setService(undefined)}>Choose a service</option>
                            {services.map((ser)=>(
                                <option value={ser} onClick={()=>{
                                    setService(ser);
                                }}>{ser.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label column="sm">Choose an expiration date: </Form.Label>
                        <Form.Control type='date' placeholder='Data od:' value={referralExpiryDate} onChange={(e) => setReferralExpiryDate(e.target.value)}/>
                    </Form.Group>
                </Col>
                <Col md>
                    <Form.Label column="sm">Referrals list: </Form.Label>
                    <div style={{overflow: "scroll", height: "100px"}}>
                        {referrals.map((referral) => {
                            return <div className="appointmentFormSubsectionItem" key={referral.id} onClick={()=>{setReferralToDelete(referral)}}>{referral.medicalServiceName + ' do: ' +referral.expiryDate}</div>
                        })}
                    </div>
                </Col>
            </Row>

            <div style={{display: 'flex' ,justifyContent: 'space-between'}}>
                <button className="addButton" onClick={e=>handleReferralAddition(e)}>ADD REFERRAL</button>
                <button className="deleteButton" onClick={e=>handleReferralDeletion(e)}>DELETE REFERRAL</button>
            </div>
            <hr />

            <Row className="mb-3 topBuffer">
                <Col md>
                    <Form.Label>Medications:</Form.Label>
                    <Form.Group>
                        <Form.Label column="sm">Choose a medication: </Form.Label>
                        <Form.Select aria-label="Floating label select example">
                            <option onClick={() => setMedication(undefined)}>Choose a medication</option>
                            {medications.map((medication) =>(
                                <option value={medication} key={medication.id}
                                        onClick={()=>setMedication(medication)}>{medication.name}</option>
                                ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label column="sm">Dosage: </Form.Label>
                        <Form.Control type="text" placeholder="Dosage" onChange={(e)=>setMedicationDosage(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label column="sm">Choose the number of packages: </Form.Label>
                        <RangeSlider
                            value={medicationQuantity}
                            onChange={(e) => setMedicationQuantity(parseInt(e.target.value))}
                        />
                    </Form.Group>
                </Col>
                <Col md>
                    <Form.Label column="sm">Medications list:</Form.Label>
                    <div style={{overflow: "scroll", height: "216px"}}>
                        {medicationsToAdd.map((medication)=>{
                            return <div className="appointmentFormSubsectionItem" key={medication.id} onClick={()=>setMedicationToDelete(medication)}>{medication.name + ', '+medication.numberOfPackages + ' op.'}</div>
                        })}
                    </div>
                </Col>
            </Row>
            <div style={{display: 'flex' ,justifyContent: 'space-between'}}>
                <button className="addButton" onClick={(e)=>handleMedicationAddition(e)}>ADD MEDICATION</button>
                <button className="deleteButton" onClick={(e)=>handleMedicationDeletion(e)}>DELETE MEDICATION</button>
            </div>
            <hr />
            <Row>

            </Row>
            <div className="topBuffer">
                <Form.Label>Check-ups:</Form.Label>
                <Row className="mb-3">
                    <Col md>
                        <Form.Group>
                            <Form.Label column="sm">Choose a check-up: </Form.Label>
                            <Form.Select aria-label="Floating label select example">
                                <option onClick={() => setSelectedCheckup(undefined)}>Choose a checkup</option>
                                {checkUps.map((checkUp)=>(
                                   <option value={checkUp} key={checkUp.id}
                                    onClick={()=>setSelectedCheckup(checkUp)}>{checkUp.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md />
                </Row>
                <Row className="mb-3">
                    <Col md>
                        <Form.Group className="mb-3" controlId="detailForm.ControlTextArea2">
                            <Form.Label column="sm">Description:</Form.Label>
                            <Form.Control as="textarea" rows={3} value={checkupDescription} onChange={(e)=>setCheckupDescription(e.target.value)}/>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group className="mb-3" controlId="detailForm.ControlTextArea2">
                            <Form.Label column="sm">Result:</Form.Label>
                            <Form.Control as="textarea" rows={3} value={checkupResult} onChange={(e)=>setCheckupResult(e.target.value)}/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label column="sm">Add file:</Form.Label>
                            <Form.Control as="input" type="file" ref={ref} size="sm" onChange={(e)=>handleFileUpload(e)}/>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Label column="sm">Check-ups list:</Form.Label>
                        <div style={{overflow: "scroll", height: "150px"}}>
                            {checkUpsToAdd.map((checkup)=>{
                                return <div className="appointmentFormSubsectionItem" onClick={()=>setCheckupToDelete(checkup)}>{checkup.name}</div>
                            })}
                        </div>
                    </Col>
                </Row>
                <div style={{display: 'flex' ,justifyContent: 'space-between'}}>
                    <button className="addButton" onClick={(e)=>handleCheckupAddition(e)}>ADD CHECK-UP</button>
                    <button className="deleteButton" onClick={(e)=>handleCheckupDeletion(e)}>DELETE CHECK-UP</button>
                </div>
                <hr />
            </div>
            <div style={{display:"flex", justifyContent: 'center'}}>
                <div style={{display:"flex", justifyContent: 'space-between'}}>
                    <Button variant='danger'>Cancel</Button>
                    <Button variant='primary' onClick={(e)=>seeResult(e)}>Save changes</Button>
                </div>
            </div>
        </Form>
    )
}

export default AppointmentDetailsForm;