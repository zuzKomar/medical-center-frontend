import React, {useState, useEffect, useRef} from "react";
import {useHistory} from 'react-router';
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import {baseUrl} from "../../config/config";

const UploadNewFile = ({t, logout}) =>{
    const history = useHistory();

    const [userId, setUserId] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('id'));
        return saved || undefined;
    });
    const [userToken, setUserToken] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('token'));
        return saved || undefined;
    });

    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(undefined);
    const [deletedFile, setDeletedFile] = useState(undefined);
    const [fileDescription, setFileDescription] = useState(undefined);
    const [errors, setErrors] = useState({});
    const ref = useRef();
    const [redirect, setRedirect] = useState(false);

    const reset = () =>{
        ref.current.value = "";
    };

    useEffect(()=>{
        let controller = new AbortController();

        (async ()=>{
            try{
                if(selectedFile === undefined){
                    const patientFiles = await fetchPatientFiles()
                    setFiles(patientFiles);
                    controller = null;
                }
            }catch (e){
                console.log(e)
                setRedirect(true);
            }
        })();
        return () =>controller?.abort();

    },[selectedFile])

    useEffect(()=>{
        let controller = new AbortController();

        (async () =>{
            if(deletedFile !== undefined){
                try{
                    const patientFiles = await fetchPatientFiles()
                    setFiles(patientFiles);
                    setDeletedFile(undefined);
                    controller = null;
                }catch (e){
                    console.log(e)
                    setRedirect(true);
                }
            }
        })();
        return () =>controller?.abort();

    },[deletedFile])

    const fetchPatientFiles = async ()=>{
        const res = await fetch(`${baseUrl}/patients/${userId}/files`,{
            headers: {'Authorization' : `Bearer ${userToken}`}
        })
        if(res.status === 403){
            setRedirect(true);
        }
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

                fetch(`${baseUrl}/patients/${userId}/files`,{
                    method : 'POST',
                    headers :{
                        'Authorization' : `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': `${baseUrl}`
                    },
                    body: JSON.stringify(selectedFile)
                }).then((res)=>{
                    setSelectedFile(undefined)
                    setFileDescription('');
                    reset();
                    if(res.status === 403){
                        setRedirect(true);
                    }
                })
                    .catch(err=>console.log(err));
            }
        }
     }

     const handleFileDownload = (e, file) => {
         e.preventDefault();
         fetch(`${baseUrl}/patients/${userId}/files/${file.id}`,{
             headers: {'Authorization' : `Bearer ${userToken}`}
         })
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

        fetch(`${baseUrl}/patients/${userId}/files/${file.id}`,{
            headers: {'Authorization' : `Bearer ${userToken}`},
            method: 'DELETE',
        }).then(res => {
            if(res.status === 403){
                setRedirect(true);
            }
        }).catch(err => console.log(err))
     }

     const findFormErrors = () =>{
        const newErrors = {};
        const fileTypes = ["image/png", "image/jpeg", "application/pdf", "application/msword"]

        if(selectedFile === undefined){
            newErrors.file = t("selectFileError");
        }

        if(fileDescription === undefined || fileDescription === ''){
            newErrors.description = t("fileDescriptionError");
        }

        if(selectedFile !== undefined && !fileTypes.includes(selectedFile.type)){
            newErrors.file = t("uploadFileFormatsError");
        }

        return newErrors;
     }

    if(redirect === true){
        logout(history);
        return (
            <></>
        )
    }else {
        return (
            <div className="itemsList">
                <div className="listHeader">
                    <h2>{t("addNewFile")}</h2>
                </div>
                <Form className="newAppointmentForm">
                    <Form.Group controlId="file" className="mb-2">
                        <Form.Label>{t("file")}</Form.Label>
                        <Form.Control as="input" ref={ref} type="file" isInvalid={!!errors.file} onChange={(e) => {
                            handleFileUpload(e);
                            if (!!errors['file'])
                                setErrors({
                                    ...errors,
                                    ['file']: null
                                })
                        }}/>
                        <Form.Control.Feedback type='invalid'>{errors.file}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="description" className="mb-2">
                        <Form.Label>{t("fileDescription")}</Form.Label>
                        <Form.Control as="textarea" value={fileDescription} isInvalid={!!errors.description}
                                      onChange={(e) => {
                                          setFileDescription(e.target.value);
                                          if (!!errors['description'])
                                              setErrors({
                                                  ...errors,
                                                  ['description']: null
                                              })
                                      }}/>
                        <Form.Control.Feedback type='invalid'>{errors.description}</Form.Control.Feedback>
                    </Form.Group>
                    <div style={{display: "flex", justifyContent: 'center'}}>
                        <Button variant='primary' onClick={(e) => handleSubmit(e)}>{t("addFile")}</Button>
                    </div>
                </Form>
                {files.length > 0 ?
                    <Table className="table table-hover table-bordered fileTable" style={{width: '80%'}}>
                        <thead style={{backgroundColor: '#e6eeff'}}>
                        <tr>
                            <th>{t("fileNameFormat")}</th>
                            <th>{t("fileDescription")}</th>
                            <th>{t("createDate")}</th>
                            <th>{t("action")}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {files.map((file) =>
                            <tr key={file.id}>
                                <td>{file.name}</td>
                                <td>{file.description}</td>
                                <td>{file.uploadDate}</td>
                                <td>
                                    <ul className="listActions">
                                        <li>
                                            <Button variant='primary' href={`${baseUrl}/patients/1/files/${file.id}`}
                                                    onClick={e => handleFileDownload(e, file)}>{t("download")}</Button>
                                        </li>
                                        <li>
                                            <Button variant='danger' href={`${baseUrl}/patients/1/files/${file.id}`}
                                                    onClick={e => {
                                                        setDeletedFile(file);
                                                        handleFileDeletion(e, file)
                                                    }}>{t("delete")}</Button>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table> : t("noFiles")
                }
            </div>
        );
    }
}

export default UploadNewFile;