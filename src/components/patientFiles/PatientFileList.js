import React, {useState, useEffect} from "react";
import File from "./File";
import {baseUrl} from "../../config/config";

const PatientFileList = () =>{

    const [patientFiles, setPatientFiles] = useState([]);

    useEffect(()=>{
        const getPatientFiles = async ()=>{
            const patientFiles = await fetchPatientFiles()
            setPatientFiles(patientFiles);
        }
        getPatientFiles()
    },[])

    const fetchPatientFiles = async ()=>{
        const res = await fetch(`${baseUrl}/patients/1/files`)
        const data = await res.json()

        return data;
    }

    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>Twoje pliki</h2>
            </div>
            {patientFiles.length > 0 ?
                patientFiles.map((file) =>(
                    <File key={file.id} file={file}/>
                    )) : 'Brak plików do wyświetlenia'}
        </div>
    )
}

export default PatientFileList