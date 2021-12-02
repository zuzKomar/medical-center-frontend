import React, {useState} from "react";
import {useHistory} from 'react-router';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function UploadNewFile(){
    const history = useHistory();
    const [selectedFile, setSelectedFile] = useState(null);


    function readFileDataAsBase64(e) {
        let file = e.target.files[0];


        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                resolve(event.target.result);
            };

            reader.onerror = (err) => {
                reject(err);
            };

            reader.readAsDataURL(file);
            //setSelectedFile(file);
        });

    }

      function handleSubmit(){
         if(selectedFile!==null){
             const newObj = {
                 file : selectedFile,
                 id: 1,
                 name : selectedFile.name
             }

             fetch('http://localhost:8080/patients/1/files',{
                 method: 'POST',
                 headers : {
                     'Content-Type': 'application/json',
                     'Access-Control-Allow-Origin': 'http://localhost:8080'
                 },
                 body: newObj
             }).then((res)=>res.json())
                 .catch((err)=>console.log(err));
            console.log('poszlo');

             history.push({
                 pathname : '/moje-pliki'
             });
         }else{
             window.alert('Należy wybrać plik');
         }
     }

    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>Dodaj nowy plik</h2>
            </div>
            <Form className="newAppointmentForm" >
                <Form.Group controlId="formFile" className="mb-4">
                    <Form.Label>Dodaj plik</Form.Label>
                    <Form.Control type="file" value={selectedFile} onChange={(e)=>setSelectedFile(e.target.value)}/>
                </Form.Group>
                <div style={{display:"flex", justifyContent: 'center'}}>
                    <Button variant='primary' onClick={handleSubmit}>Dodaj plik</Button>
                </div>
            </Form>
        </div>
        );
}

export default UploadNewFile;