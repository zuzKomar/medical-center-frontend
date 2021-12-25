import React, {useState, useEffect} from "react";
import {FaRegUser, FaCheck, FaFile, FaRegListAlt} from 'react-icons/fa'
import {Button} from "react-bootstrap";
import {baseUrl} from "../../config/config";

const CheckUp = ({checkup}) =>{
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
                a.download = 'Wynik_badania_wizyta_' + String(date);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
    }


    return(
        <div className="appointmentAndCheckup" onClick={(e)=> togglePanel(e)}>
            <div className="top">
                <p className="appointmentAndCheckupHeader">{checkUp.diagnosticTestName}</p>
                <div className="data">
                    <p>Data:</p>
                    <p>{new Date(checkUp.appointmentDate).toISOString().slice(0,10)}</p>
                    <p>{new Date(checkUp.appointmentDate).toISOString().slice(11,16)}</p>
                </div>
            </div>
            <div>
                <FaRegUser size={42}/>
                Pracownik medyczny
            </div>

            {state ? (
                <div>
                    <hr/>
                    <div className="subsections">
                        <FaRegListAlt size={42}/>
                        <p className="header">Opis badania</p>
                    </div>
                    <div className="subsections">
                        <p>{checkUp.doctorsDescription}</p>
                    </div>
                    <hr/>

                    <div className="subsections">
                        <FaCheck size={42}/>
                        <p className="header">Wynik</p>
                    </div>
                    <div>
                        <p>{checkUp.result ? checkUp.result : 'Wynik nie jest jeszcze dostępny'}</p>
                    </div>

                    {(checkUp.result !== null && checkUp.file) &&
                    <>
                        <hr/>
                        <div className="subsections">
                            <FaFile size={42}/>
                            <p className="header">Pobierz wynik PDF</p>
                            <Button className="download" href={`${baseUrl}/patients/1/diagnosticTests`} onClick={(e)=>{
                                handleFileDownload(e, checkup);
                            }}>Pobierz</Button>
                        </div>
                    </>}
                </div>) : null}
        </div>);
}
export default CheckUp;