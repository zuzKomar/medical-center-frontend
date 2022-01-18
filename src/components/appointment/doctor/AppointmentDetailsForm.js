import React, {useEffect, useState, useRef} from 'react';
import {useHistory} from 'react-router';
import Form from "react-bootstrap/Form";
import {Col, Row} from "react-bootstrap";
import {baseUrl} from "../../../config/config";
import RangeSlider from "react-bootstrap-range-slider";
import Button from "react-bootstrap/Button";

const AppointmentDetailsForm = ({appointment, t, logout}) => {
    const [redirect, setRedirect] = useState(false);
    const [userToken, setUserToken] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('token'));
        return saved || undefined;
    });
    const facility = 'FACILITY';

    const history = useHistory();
    const ref = useRef();
    const formatYmd = date => date.toISOString().slice(0,10);
    const [errors, setErrors] = useState({});

    const [services, setServices] = useState([]);
    const [checkUps, setCheckUps] = useState([]);
    const [medications, setMedications] = useState([]);

    const [app, setApp] = useState(appointment);
    const [description, setDescription] = useState(()=>{
        const saved = sessionStorage.getItem('description');
        return saved || undefined;
    });

    const [recommendations, setRecommendations] = useState(()=>{
        const saved = sessionStorage.getItem('recommendations');
        return saved || undefined;
    });

    const [service, setService] = useState(undefined);
    const [referralExpiryDate, setReferralExpiryDate] = useState(formatYmd(new Date(new Date().setDate(new Date().getDate()+31))));
    const [referralToDelete, setReferralToDelete] = useState(undefined);
    const [referrals, setReferrals] = useState(()=>{
        const saved = sessionStorage.getItem('referrals');
        const savedReferrals = JSON.parse(saved);
        return savedReferrals || [];
    });

    const [medication, setMedication] = useState(undefined);
    const [medicationDosage, setMedicationDosage] = useState(undefined);
    const [medicationQuantity, setMedicationQuantity] = useState(1);
    const [medicationToDelete, setMedicationToDelete] = useState(undefined);
    const [medicationsToAdd, setMedicationsToAdd] = useState(()=>{
        const saved = sessionStorage.getItem('medications');
        const savedMedications = JSON.parse(saved);
        return savedMedications || [];
    });

    const [selectedCheckup, setSelectedCheckup] = useState(undefined);
    const [checkupDescription, setCheckupDescription] = useState(undefined);
    const [checkupResult, setCheckupResult] = useState(undefined);
    const [checkupResultFile, setCheckupResultFile] = useState(undefined);
    const [checkupToDelete, setCheckupToDelete] = useState(undefined);
    const [checkUpsToAdd, setCheckUpsToAdd] = useState(()=>{
        const saved = sessionStorage.getItem('checkups');
        const savedCheckups = JSON.parse(saved);
        return savedCheckups || [];
    });

    const reset = () =>{
        ref.current.value = "";
    };

    useEffect(() => {
        let controller = new AbortController();

        (async () => {
            try{
                const services = await fetchServices()
                services.forEach(service => {
                    service.name = t(service.name)
                })
                setServices(services)
                controller = null;
            }catch (e){
                console.log(e)
                setRedirect(true);
            }
        })();
        return () =>controller?.abort();

    }, [])

    const fetchServices = async () =>{
        const res = await fetch(`${baseUrl}/medicalServices`,{
            headers: {'Authorization' : `Bearer ${userToken}`}
        });
        if(res.status === 403){
            setRedirect(true);
        }
        return await res.json();
    }

    useEffect(() => {
        let controller = new AbortController();

        (async () => {
            try{
                const checkUps = await fetchCheckUps()
                checkUps.forEach(checkUp => {
                    checkUp.name = t(checkUp.name)
                })
                setCheckUps(checkUps)
                controller = null;
            }catch (e){
                console.log(e)
                setRedirect(true);
            }
        })();
        return () =>controller?.abort();

    }, [])

    const fetchCheckUps = async () =>{
        const res = await fetch(`${baseUrl}/checkups`,{
            headers: {'Authorization' : `Bearer ${userToken}`}
        });
        if(res.status === 403){
            setRedirect(true);
        }
        return await res.json();
    }

    useEffect(() => {
        let controller = new AbortController();

        (async () => {
            try{
                const medications = await fetchMedications()
                setMedications(medications);
                controller = null;
            }catch (e){
                console.log(e)
                setRedirect(true);
            }
        })();
        return () =>controller?.abort();

    }, [])

    const fetchMedications = async () =>{
        const res = await fetch(`${baseUrl}/medications`,{
            headers: {'Authorization' : `Bearer ${userToken}`}
        });
        if(res.status === 403){
            setRedirect(true);
        }
        return await res.json();
    }

    function handleServiceChange(event){
        let serviceId = parseInt(event.target.value);
        setService(services.find(service => service.id === serviceId));
    }

    const handleReferralAddition = (e) => {
        e.preventDefault();
        let referral = {};

        if (service !== undefined) {
            referral["medicalServiceId"] = service.id;
            referral["medicalServiceName"] = service.name;
            referral["expiryDate"] = referralExpiryDate;

            referrals.push(referral);
            sessionStorage.setItem('referrals', JSON.stringify(referrals));
            setService(undefined);
            let element = document.getElementById('serviceSelect');
            element.value = t("chooseService");
            setReferralExpiryDate(formatYmd(new Date(new Date().setDate(new Date().getDate()+31))));
        }
    }

    const handleReferralDeletion = (e) =>{
        e.preventDefault();
        if(referralToDelete !== undefined){
           const refIndex = referrals.indexOf(referralToDelete);
           if(refIndex > -1){
               referrals.splice(refIndex, 1);
               setReferrals(referrals);
               sessionStorage.setItem('referrals', JSON.stringify(referrals));
               setReferralToDelete(undefined);
           }
        }
    }

    function handleMedicationChange(event){
        let medId = parseInt(event.target.value);
        setMedication(medications.find(med => med.id === medId));
    }

    const handleMedicationAddition = (e) =>{
        e.preventDefault();
        let medicine = {};

        if(medication !== undefined && medicationDosage !== undefined){
            if(medicationsToAdd.filter(e=>e.medicationId === medication.id).length === 0){
                medicine["numberOfPackages"] = medicationQuantity;
                medicine["dosing"] = medicationDosage;
                medicine["medicationId"] = medication.id;
                medicine["name"] = medication.name;

                medicationsToAdd.push(medicine);
                sessionStorage.setItem('medications', JSON.stringify(medicationsToAdd));
                setMedication(undefined);
                let element = document.getElementById('medicationSelect');
                element.value = t("chooseMedication");
                setMedicationDosage('');
                setMedicationQuantity(1);
            }else{
                window.alert(t("referralAddMedicationError"));
            }
        }
    }

    const handleMedicationDeletion = (e) =>{
        e.preventDefault();
        if(medicationToDelete !== undefined){
            const medIndex = medicationsToAdd.indexOf(medicationToDelete);
            if(medIndex > -1){
                medicationsToAdd.splice(medIndex, 1);
                setMedicationsToAdd(medicationsToAdd);
                sessionStorage.setItem('medications', JSON.stringify(medicationsToAdd));
                setMedicationToDelete(undefined);
            }
        }
    }

    function handleCheckupChange(event){
        let checkupId = parseInt(event.target.value);
        setSelectedCheckup(checkUps.find(checkup => checkup.id === checkupId));
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
            if(checkupResult !== undefined && checkupResult !== ''){
                addedCheckup["result"] = checkupResult;
            }
            if(checkupResultFile !== undefined){
                addedCheckup["file"] = checkupResultFile;
            }

            checkUpsToAdd.push(addedCheckup);
            sessionStorage.setItem('checkups', JSON.stringify(checkUpsToAdd));
            setSelectedCheckup(undefined);
            let element = document.getElementById('checkupSelect');
            element.value = t("chooseCheckUp");
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
                sessionStorage.setItem('checkups', JSON.stringify(checkUpsToAdd));
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

    const handleSubmit = (e) =>{
        e.preventDefault();
        const errors = findFormErrors();

        if(Object.keys(errors).length > 0){
            setErrors(errors);
        }else{
            let prescriptions = [];
            if(medicationsToAdd.length > 0){
                let prescription = {};
                let expiryDate = formatYmd(new Date(new Date().setDate(new Date().getDate()+31)));
                let accessCode = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
                let medications = medicationsToAdd;

                prescription["expiryDate"] = expiryDate;
                prescription["accessCode"] = accessCode;
                prescription["medications"] = medications;
                prescriptions = [prescription];
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
                    'Access-Control-Allow-Origin': `${baseUrl}`,
                    'Authorization' : `Bearer ${userToken}`
                },
                body : JSON.stringify(fetchBody)
            }).then((res)=>{
                if(res.status === 403){
                    logout(history);
                }else{
                    window.alert(t("appointmentDetailsMessage"));
                    history.push({
                        pathname : '/today-visits'
                    })
                }
            }).catch((err)=>console.log(err));

            sessionStorage.removeItem('description');
            sessionStorage.removeItem('recommendations');
            sessionStorage.removeItem('referrals');
            sessionStorage.removeItem('medications');
            sessionStorage.removeItem('checkups');
        }
    }

    const handleCancel = (e) =>{
        e.preventDefault();
        sessionStorage.removeItem('description');
        sessionStorage.removeItem('recommendations');
        sessionStorage.removeItem('referrals');
        sessionStorage.removeItem('medications');
        sessionStorage.removeItem('checkups');
        history.push({
            pathname : '/today-visits'
        })
    }

    const findFormErrors = () =>{
        const newErrors = {};

        if(description === undefined || description === ''){
            newErrors.description = t("appointmentDescriptionRequired");
        }
        return newErrors;
    }

    return (
        <Form className="newAppointmentForm">
            <Form.Group className="mb-3" controlId="detailsForm.ControlTextArea1">
                <Form.Label>{t("appointmentDescription")}</Form.Label>
                <Form.Control as="textarea" rows={3} value={description} isInvalid={!!errors.description} onChange={(e)=>{
                    setDescription(e.target.value);
                    sessionStorage.setItem('description', e.target.value);
                    if(!!errors['description'])
                        setErrors({
                            ...errors,
                            ['description']:null
                        })
                }}/>
                <Form.Control.Feedback type='invalid'>{errors.description}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="detailForm.ControlTextArea2">
                <Form.Label>{t("recommendations")}:</Form.Label>
                <Form.Control as="textarea" rows={3} value={recommendations} onChange={(e)=>{
                    setRecommendations(e.target.value)
                    sessionStorage.setItem('recommendations', e.target.value);
                }}/>
            </Form.Group>
            <Row className="mb-3">
                <Form.Label>{t("referrals")}:</Form.Label>
                <Col md>
                    <Form.Group>
                        <Form.Label column="sm">{t("chooseService")}:</Form.Label>
                        <Form.Select id="serviceSelect" onChange={handleServiceChange}>
                            <option onClick={() => setService(undefined)}>{t("chooseService")}</option>
                            {services.map((ser)=>(
                                <option value={ser.id}>{ser.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label column="sm">{t("chooseExpirationDate")}</Form.Label>
                        <Form.Control type='date' value={referralExpiryDate} onChange={(e) => setReferralExpiryDate(e.target.value)}/>
                    </Form.Group>
                </Col>
                <Col md>
                    <Form.Label column="sm">{t("referralsList")}</Form.Label>
                    <div style={{overflow: "scroll", height: "100px"}}>
                        {referrals.map((referral) => {
                            return <div className="appointmentFormSubsectionItem" key={referral.id} onClick={()=>{
                                setReferralToDelete(referral);
                            }}>{referral.medicalServiceName + ' ' + t("to") + ': ' +referral.expiryDate}</div>
                        })}
                    </div>
                </Col>
            </Row>

            <div style={{display: 'flex' ,justifyContent: 'space-between'}}>
                <button className="addButton" onClick={e=>handleReferralAddition(e)}>{t("addReferral")}</button>
                <button className="deleteButton" onClick={e=>handleReferralDeletion(e)}>{t("deleteReferral")}</button>
            </div>
            <hr />

            <Row className="mb-3 topBuffer">
                <Col md>
                    <Form.Label>{t("medications")}</Form.Label>
                    <Form.Group>
                        <Form.Label column="sm">{t("chooseMedication")}:</Form.Label>
                        <Form.Select id="medicationSelect" onChange={handleMedicationChange}>
                            <option onClick={() => setMedication(undefined)}>{t("chooseMedication")}</option>
                            {medications.map((medication) =>(
                                <option value={medication.id}>{medication.name}</option>
                                ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label column="sm">{t("dosage")}:</Form.Label>
                        <Form.Control type="text" placeholder={t("dosage")} value={medicationDosage} onChange={(e)=>setMedicationDosage(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label column="sm">{t("choosePackagesNumber")}</Form.Label>
                        <RangeSlider
                            value={medicationQuantity}
                            onChange={(e) => setMedicationQuantity(parseInt(e.target.value))}
                        />
                    </Form.Group>
                </Col>
                <Col md>
                    <Form.Label column="sm">{t("medicationsList")}</Form.Label>
                    <div style={{overflow: "scroll", height: "216px"}}>
                        {medicationsToAdd.map((medication)=>{
                            return <div className="appointmentFormSubsectionItem" key={medication.id} onClick={()=>{
                                setMedicationToDelete(medication);
                            }}>{medication.name + ', '+medication.numberOfPackages + ' ' + t("package") + '. '}</div>
                        })}
                    </div>
                </Col>
            </Row>
            <div style={{display: 'flex' ,justifyContent: 'space-between'}}>
                <button className="addButton" onClick={(e)=>handleMedicationAddition(e)}>{t("addMedication")}</button>
                <button className="deleteButton" onClick={(e)=>handleMedicationDeletion(e)}>{t("deleteMedication")}</button>
            </div>
            <hr />
            <Row>

            </Row>
            {appointment.type === facility &&
            <div className="topBuffer">
                <Form.Label>{t("checkups")}:</Form.Label>
                <h6 style={{color: '#e60000'}}>{t("checkUpsInfo")}</h6>
                <Row className="mb-3">
                    <Col md>
                        <Form.Group>
                            <Form.Label column="sm">{t("chooseCheckUp")}:</Form.Label>
                            <Form.Select id="checkupSelect" onChange={handleCheckupChange}>
                                <option onClick={() => setSelectedCheckup(undefined)}>{t("chooseCheckUp")}</option>
                                {checkUps.map((checkUp)=>(
                                   <option value={checkUp.id}>{checkUp.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md />
                </Row>
                <Row className="mb-3">
                    <Col md>
                        <Form.Group className="mb-3">
                            <Form.Label column="sm">{t("description")}:</Form.Label>
                            <Form.Control as="textarea" rows={3} value={checkupDescription} onChange={(e)=>setCheckupDescription(e.target.value)}/>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Group className="mb-3">
                            <Form.Label column="sm">{t("result")}:</Form.Label>
                            <Form.Control as="textarea" rows={3} value={checkupResult} onChange={(e)=>setCheckupResult(e.target.value)}/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label column="sm">{t("addFile")}:</Form.Label>
                            <Form.Control as="input" type="file" ref={ref} size="sm" onChange={(e)=>handleFileUpload(e)}/>
                        </Form.Group>
                    </Col>
                    <Col md>
                        <Form.Label column="sm">{t("checkUpsList")}:</Form.Label>
                        <div style={{overflow: "scroll", height: "150px"}}>
                            {checkUpsToAdd.map((checkup)=>{
                                return <div className="appointmentFormSubsectionItem" key={checkup.id} onClick={()=>{
                                    setCheckupToDelete(checkup);
                                }}>{checkup.name}</div>
                            })}
                        </div>
                    </Col>
                </Row>
                <div style={{display: 'flex' ,justifyContent: 'space-between'}}>
                    <button className="addButton" onClick={(e)=>handleCheckupAddition(e)}>{t("addCheckUp")}</button>
                    <button className="deleteButton" onClick={(e)=>handleCheckupDeletion(e)}>{t("deleteCheckUp")}</button>
                </div>
                <hr />
            </div>}
            <div style={{display:"flex", justifyContent: 'center'}}>
                <Button style={{marginLeft : '1%', marginRight:'1%'}} variant='danger' onClick={(e)=>handleCancel(e)}>{t("cancel")}</Button>
                <Button style={{marginLeft : '1%', marginRight:'1%'}} variant='primary' onClick={(e)=>handleSubmit(e)}>{t("saveChanges")}</Button>
            </div>
        </Form>
    )
}

export default AppointmentDetailsForm;