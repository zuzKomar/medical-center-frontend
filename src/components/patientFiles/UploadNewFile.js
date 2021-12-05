import React, {useState} from "react";
import {useHistory} from 'react-router';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function UploadNewFile() {
    const history = useHistory();
    const [selectedFile, setSelectedFile] = useState(undefined);

    const createImage = (newImage) => fetch('http://localhost:8080/patients/1/files', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': 'http://localhost:8080'
        },
        body: newImage
    }).then(res =>res.blob())
        .then(console.log)

    const createPost = async (post) => {
        try{
            await createImage(post);
        }catch (err){
            console.log(err);
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

    const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
    }

    const handleFileUpload = async (e) =>{
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        let data = base64.split('base64,')[1];
        let binaryData = atob(data);
        setSelectedFile(binaryData);

        // let byteNumbers = new Array(binaryData.length);
        // for(let i = 0; i<binaryData.length; i++){
        //     byteNumbers[i] = binaryData.charCodeAt(i);
        // }
        //
        // let test = new Uint8Array(byteNumbers);
        // console.log(byteNumbers);
    }

     const handleSubmit = (e) =>{
        e.preventDefault();
        console.log(selectedFile);
        createPost(selectedFile)
            .then(()=>{
                history.push({
                    pathname : '/moje-pliki'
                });
            })
     }

    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>Dodaj nowy plik</h2>
            </div>
            <Form className="newAppointmentForm" >
                <Form.Group controlId="formFile" className="mb-4">
                    <Form.Label>Dodaj plik</Form.Label>
                    <input type="file" accept=".jpeg, .png, .jpg" onChange={(e)=>handleFileUpload(e)}/>
                </Form.Group>
                <div style={{display:"flex", justifyContent: 'center'}}>
                    <Button variant='primary' onClick={(e)=>handleSubmit(e)}>Dodaj plik</Button>
                </div>
            </Form>
        </div>
        );
}

export default UploadNewFile;