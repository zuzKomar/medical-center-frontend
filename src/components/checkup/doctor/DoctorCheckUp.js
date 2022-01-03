import React, {useRef, useState, useEffect} from "react";
import {FaRegUser} from "react-icons/fa";
import moment from "moment";
import {Form} from "react-bootstrap";
import {baseUrl} from "../../../config/config";

const DoctorCheckUp = ({checkup, setSelectedCheckup, t}) => {

    const [userToken, setUserToken] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('token'));
        return saved || undefined;
    });

    const [state, setState] = useState(false);
    const [showAll, setShowAll] = useState(true);
    const [checkUp, setCheckUp] = useState(checkup);
    const [result, setResult] = useState(undefined);
    const [file, setFile] = useState(undefined);
    const [doctorsDescription, setDoctorsDescription] = useState(undefined);
    const [errors, setErrors] = useState({});
    const ref = useRef();
    let a = moment(Date.now());
    let b = moment(checkUp.patient.birthDate)

    function showForm(e) {
        e.preventDefault();
        setState(!state);
    }

    useEffect(()=>{
        if(checkup !== undefined){
            setCheckUp(checkup);
        }
    },[checkup])

    const findFormErrors = () => {
        const newErrors = {};

        if(result === undefined || result === ''){
            newErrors.result = 'Result must be added!';
        }

        if (file === undefined) {
            newErrors.file = 'File must be added!';
        }

        return newErrors;
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
        setFile(array);
    }

    const handleRealization = (e) =>{
        e.preventDefault();
        const errors = findFormErrors();

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
        } else {
            let fetchBody = {};
            fetchBody['result'] = result;
            fetchBody['doctorsDescription'] = doctorsDescription;
            fetchBody['file'] = file;

            fetch(`${baseUrl}/appointments/${checkUp.appointmentId}/testResult/${checkUp.checkUpId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${userToken}`
                },
                body: JSON.stringify(fetchBody)
            })
            .then((res) => res.json())
                .then(()=>new Promise(resolve => setTimeout(resolve, 2000)))
            .then(window.alert(t("checkUpRealized")))
            .catch((err) => console.log(err));
            setSelectedCheckup(checkUp);
            setShowAll(false);
        }
    }

    return(
        <div className="appointmentAndCheckup">
            <div className="top">
                <p className="appointmentAndCheckupHeader">{checkUp.diagnosticTestName}</p>
                <div className="data">
                    <p>{t("date")}</p>
                    <p>{new Date(checkUp.appointmentDate).toISOString().slice(0,10)}</p>
                    <p>{new Date(checkUp.appointmentDate).toISOString().slice(11,16)}</p>
                </div>
            </div>
            <div>
                <p><FaRegUser size={42}/>{(checkUp.patient ? (checkUp.patient.firstName + ' ' + checkUp.patient.lastName) : '')}</p>
                <p>{t("age")}&nbsp;{a.diff(b, 'year')}</p>
            </div>
            {!state &&
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <button className="actionButton" onClick={showForm}>{t("realizeCheckUp")}</button>
            </div>
            }
            {state ? (
                <Form>
                    <Form.Group className="mb-3" controlId="doctorDescription">
                        <Form.Label>{t("description")}:</Form.Label>
                        <Form.Control as="textarea" rows={3} value={doctorsDescription} onChange={e => {
                            setDoctorsDescription(e.target.value)
                        }} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="result">
                        <Form.Label>{t("result")}:</Form.Label>
                        <Form.Control as="textarea" rows={3} isInvalid={!!errors.result} value={result} onChange={e => {
                            setResult(e.target.value);
                            if(!!errors['result'])
                                setErrors({
                                    ...errors,
                                    ['result']:null
                                })
                        }} />
                        <Form.Control.Feedback type='invalid'>{errors.result}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="file" className="mb-2">
                        <Form.Label>{t("file")}</Form.Label>
                        <Form.Control as="input" ref={ref} type="file" isInvalid={!!errors.file} onChange={e => {
                            handleFileUpload(e);
                            if(!!errors['file'])
                                setErrors({
                                    ...errors,
                                    ['file']:null
                                })
                        }}
                        />
                        <Form.Control.Feedback type='invalid'>{errors.file}</Form.Control.Feedback>
                    </Form.Group>
                    {state &&
                    <div className="topBuffer" style={{display: 'flex', justifyContent: 'space-between'}}>
                        <button className="deleteButton" onClick={(e)=>showForm(e)}>{t("cancel").toUpperCase()}</button>
                        <button className="addButton" onClick={e => handleRealization(e)}>{t("accept").toUpperCase()}</button>
                    </div>
                    }
                </Form>) : null}
        </div>
    )
}

export default DoctorCheckUp;