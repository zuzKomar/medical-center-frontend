import React, {useRef, useState} from "react";
import {FaRegUser} from "react-icons/fa";
import moment from "moment";
import {Button, Form} from "react-bootstrap";
import {baseUrl} from "../../../config/config";

const DoctorCheckUp = ({checkup}) => {
    const [state, setState] = useState(false);
    const [checkUp, setCheckUp] = useState(checkup);
    const [result, setResult] = useState(undefined);
    const [file, setFile] = useState(undefined);
    const [doctorsDescription, setDoctorsDescription] = useState(undefined);

    let a = moment(Date.now());
    let b = moment(checkUp.patient.birthDate)
    const ref = useRef();

    function showForm(e) {
        e.preventDefault();
        setState(!state);
    }

    function handleRealization(e){
        e.preventDefault();

        let fetchBody = {};
        fetchBody['result'] = result;
        fetchBody['doctorsDescription'] = doctorsDescription
        fetchBody['file'] = file;

        fetch(`${baseUrl}/appointments/${checkUp.appointmentId}/testResult/${checkUp.checkUpId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fetchBody)
        }).then(res => res.json())
            .then(window.alert("Check-up have been realized"))
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

    return(
        <div className="appointmentAndCheckup">
            <div className="top">
                <p className="appointmentAndCheckupHeader">{checkUp.diagnosticTestName}</p>
                <div className="data">
                    <p>Data:</p>
                    <p>{new Date(checkUp.appointmentDate).toISOString().slice(0,10)}</p>
                    <p>{new Date(checkUp.appointmentDate).toISOString().slice(11,16)}</p>
                </div>
            </div>
            <div>
                <p><FaRegUser size={42}/>{(checkUp.patient ? (checkUp.patient.firstName + ' ' + checkUp.patient.lastName) : '')}</p>
                <p>Age: {a.diff(b, 'year')}</p>
            </div>
            {!state &&
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <button className="actionButton" onClick={showForm}>REALIZE CHECKUP</button>
                </div>
            }
            {state ? (
                <Form>
                    <Form.Group className="mb-3" controlId="doctorDescription">
                        <Form.Label>Doctor's description:</Form.Label>
                        <Form.Control as="textarea" rows={3} value={doctorsDescription} onChange={e => {
                            setDoctorsDescription(e.target.value)
                        }} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="result">
                        <Form.Label>Result:</Form.Label>
                        <Form.Control as="textarea" rows={3} value={result} onChange={e => {
                            setResult(e.target.value);
                        }} />
                    </Form.Group>
                    <Form.Group controlId="file" className="mb-2">
                        <Form.Label>File:</Form.Label>
                        <Form.Control as="input" ref={ref} type="file" onChange={e => handleFileUpload(e)}/>
                    </Form.Group>
                    {state &&
                    <div className="topBuffer" style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button className="deleteButton" onClick={showForm}>CANCEL</Button>
                        <button className="addButton" onClick={e => handleRealization(e)}>ACCEPT</button>
                    </div>
                    }
                </Form>
             ) : null}
        </div>
    )
}

export default DoctorCheckUp;