import React, {useState, useEffect} from "react";
import {FaRegUser, FaCheck, FaFile, FaRegListAlt} from 'react-icons/fa'
import {Button} from "react-bootstrap";
import {baseUrl} from "../../config/config";

const CheckUp = ({checkup, t}) =>{
    const [state, setState] = useState(false);
    const [checkUp, setChekup] = useState(checkup);

    useEffect(()=>{
        if(checkup !== undefined){
            setChekup(checkup);
        }
    }, [checkup])

    function togglePanel(e){
        e.preventDefault();
        setState(!state)
    }

    function handleFileDownload(e, checkup){
        e.preventDefault();

        fetch(`${baseUrl}/appointments/diagnosticTests?appointmentId=${checkup.appointmentId}&checkUpId=${checkup.checkUpId}`)
            .then(res => res.json())
            .then(res =>{
                let a = window.document.createElement('a');
                let byteArr = new Uint8Array(res.file);
                a.href = window.URL.createObjectURL(new Blob([byteArr], {type : "application/pdf"}))
                let date = new Date(res.appointmentDate).toISOString().slice(0,10);
                a.download = t("checkUpFileName") + String(date);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
    }

    return(
        <div className="appointmentAndCheckup" onClick={(e)=> togglePanel(e)}>
            <div className="top">
                <p className="appointmentAndCheckupHeader">{t(checkUp.diagnosticTestName)}</p>
                <div className="data">
                    <p>{t("date")}</p>
                    <p>{new Date(checkUp.appointmentDate).toISOString().slice(0,10)}</p>
                    <p>{new Date(checkUp.appointmentDate).toISOString().slice(11,16)}</p>
                </div>
            </div>
            <div>
                <FaRegUser size={42}/>
                {t("medicalStaff")}
            </div>

            {state ? (
                <div>
                    <hr/>
                    <div className="subsections">
                        <FaRegListAlt size={42}/>
                        <p className="header">{t("checkUpDescription")}</p>
                    </div>
                    <div className="subsections">
                        <p>{checkUp.doctorsDescription}</p>
                    </div>
                    <hr/>

                    <div className="subsections">
                        <FaCheck size={42}/>
                        <p className="header">{t("result")}</p>
                    </div>
                    <div>
                        <p>{checkUp.result ? checkUp.result : t("resultNotAvailable")}</p>
                    </div>

                    {(checkUp.result !== null && checkUp.file) &&
                    <>
                        <hr/>
                        <div className="subsections">
                            <FaFile size={42}/>
                            <p className="header">{t("downloadResultPDF")}</p>
                            <Button className="download" href={`${baseUrl}/patients/1/diagnosticTests`} onClick={(e)=>{
                                handleFileDownload(e, checkup);
                            }}>{t("download")}</Button>
                        </div>
                    </>}
                </div>) : null}
        </div>);
}
export default CheckUp;