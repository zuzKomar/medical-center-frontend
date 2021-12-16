import React, {useState, useEffect, useRef} from "react";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import {baseUrl} from "../../config/config";


function UploadNewFile() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(undefined);
    const [deletedFile, setDeletedFile] = useState(undefined);
    const [fileDescription, setFileDescription] = useState(undefined);
    const [errors, setErrors] = useState({});
    const ref = useRef();

    const reset = () =>{
        ref.current.value = "";
    };

    useEffect(()=>{
        const getPatientFiles = async ()=>{
            if(selectedFile === undefined){
                const patientFiles = await fetchPatientFiles()
                setFiles(patientFiles);
            }
        }
        getPatientFiles()

    },[selectedFile])

    useEffect(()=>{
        const getPatientFiles = async () =>{
            if(deletedFile !== undefined){
                const patientFiles = await fetchPatientFiles()
                setFiles(patientFiles);
                setDeletedFile(undefined);
            }
        }
        getPatientFiles()
    },[deletedFile])

    const fetchPatientFiles = async ()=>{
        const res = await fetch(`${baseUrl}/patients/1/files`)
        const data = await res.json()

        return data;
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

        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

        let fileToUpload = {
            "upload_date" : date,
            "file" : array,
            "type" : e.target.files[0].type,
            "name" : e.target.files[0].name,
        }
        setSelectedFile(fileToUpload);
    }

     const handleSubmit = (e) =>{
        e.preventDefault();

        const errors = findFormErrors();

        if(Object.keys(errors).length > 0){
            setErrors(errors);
        }else{
            if(selectedFile !== undefined && fileDescription !== undefined){
                selectedFile["description"] = fileDescription;

                fetch(`${baseUrl}/patients/1/files`,{
                    method : 'POST',
                    headers :{
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': `${baseUrl}`
                    },
                    body: JSON.stringify(selectedFile)
                }).then(()=>{
                    setSelectedFile(undefined)
                    setFileDescription('');
                    reset();
                })
                    .catch(err=>console.log(err));
            }
        }
     }

     const handleFileDownload = (e, file) => {
         e.preventDefault();
         fetch(`${baseUrl}/patients/1/files/${file.id}`)
             .then(res => res.json())
             .then(res => {
                 let a = window.document.createElement('a');
                 let byteArr = new Uint8Array(res.file);
                 a.href = window.URL.createObjectURL(new Blob([byteArr], {type: file.type}))
                 a.download = res.name;
                 document.body.appendChild(a);
                 a.click();
                 document.body.removeChild(a);
             });
     }

     const handleFileDeletion = (e, file) =>{
        e.preventDefault();

        fetch(`${baseUrl}/patients/1/files/${file.id}`,{
            method: 'DELETE',
        }).then(res => res.json())
            .catch(err => console.log(err))
     }

     const findFormErrors = () =>{
        const newErrors = {};
        const fileTypes = ["image/png", "image/jpeg", "application/pdf", "application/msword"]

        if(selectedFile === undefined){
            newErrors.file = 'Należy wybrać plik';
        }

        if(fileDescription === undefined || fileDescription === ''){
            newErrors.description = 'Należy dodać opis';
        }

        if(selectedFile !== undefined && !fileTypes.includes(selectedFile.type)){
            newErrors.file = 'Akcpeptowane rozszerzenia plików do png, jpeg, pdf, doc';
        }

        return newErrors;
     }

    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>Dodaj nowy plik</h2>
            </div>
            <Form className="newAppointmentForm" >
                <Form.Group controlId="file" className="mb-2">
                    <Form.Label>Plik</Form.Label>
                    <Form.Control as="input" ref={ref} type="file" isInvalid={!!errors.file} onChange={(e)=>{
                        handleFileUpload(e);
                        if(!!errors['file'])
                            setErrors({
                                ...errors,
                                ['file']:null
                            })
                    }}/>
                    <Form.Control.Feedback type='invalid'>{errors.file}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="description" className="mb-2">
                    <Form.Label>Opis pliku</Form.Label>
                    <Form.Control as="textarea" value={fileDescription} isInvalid={!!errors.description} onChange={(e)=>{
                        setFileDescription(e.target.value);
                        if(!!errors['description'])
                            setErrors({
                                ...errors,
                                ['description']:null
                            })
                    }}/>
                    <Form.Control.Feedback type='invalid'>{errors.description}</Form.Control.Feedback>
                </Form.Group>
                <div style={{display:"flex", justifyContent: 'center'}}>
                    <Button variant='primary' onClick={(e)=>handleSubmit(e)}>Dodaj plik</Button>
                </div>
            </Form>
            {files.length > 0 ?
                <Table className="table table-hover table-bordered fileTable" style={{width : '80%'}}>
                    <thead style={{backgroundColor : '#e6eeff'}}>
                    <tr>
                        <th>Nazwa i format pliku</th>
                        <th>Opis pliku</th>
                        <th>Data dodania</th>
                        <th>Akcja</th>
                    </tr>
                    </thead>
                    <tbody>
                    {files.map((file)=>
                        <tr key={file.id}>
                            <td>{file.name}</td>
                            <td>{file.description}</td>
                            <td>{file.uploadDate}</td>
                            <td>
                                <ul className="listActions">
                                    <li>
                                        <Button variant='primary' href={`${baseUrl}/patients/1/files/${file.id}`} onClick={e=>handleFileDownload(e, file)}>Pobierz</Button>
                                    </li>
                                    <li>
                                        <Button variant='danger' href={`${baseUrl}/patients/1/files/${file.id}`} onClick={e=>{
                                            setDeletedFile(file);
                                            handleFileDeletion(e, file)
                                        }}>Usuń</Button>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table> : 'Brak plików pacjenta'
            }
        </div>
        );
}

export default UploadNewFile;