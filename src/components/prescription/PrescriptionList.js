import React, {useState, useEffect} from "react";
import PrescriptionListTable from "./PrescriptionListTable";
import {baseUrl} from "../../config/config";

const PrescriptionList = ({t}) =>{

    const [prescriptions, setPrescriptions] = useState([]);

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

    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>{t("yourPrescriptions")}</h2>
            </div>
            <div className="appointmentList">
                <PrescriptionListTable prescriptionData={prescriptions} t={t}/>
            </div>
        </div>
    )
}


export default PrescriptionList;