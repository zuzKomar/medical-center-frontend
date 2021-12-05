import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import PrescriptionListTable from "./PrescriptionListTable";
import {baseUrl} from "../../config/config";

const PrescriptionList = () =>{

    const [prescriptions, setPrescriptions] = useState([]);
    let history = useHistory();

    useEffect(()=>{
        const getPrescriptions = async () =>{
            const prescriptions = await fetchPrescriptions()
            setPrescriptions(prescriptions)
        }

        getPrescriptions()
    },[])


    const fetchPrescriptions = async () =>{
        const res = await fetch(`${baseUrl}/patients/1/prescriptions`)
        const data = await res.json();

        return data;
    }

    function handleClick(){
        history.push("/nowa-recepta")
    }

    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>Twoje recepty</h2>
                <button type="button" className="actionButton" onClick={handleClick}>ODNÓW RECEPTĘ</button>
            </div>
            <div className="appointmentList">
                <PrescriptionListTable prescriptionData={prescriptions}/>
            </div>
        </div>
    )
}


export default PrescriptionList;