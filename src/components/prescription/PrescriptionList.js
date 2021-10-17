import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import PrescriptionListTable from "./PrescriptionListTable";

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
        const res = await fetch('http://localhost:5000/prescriptions')
        const data = await res.json();

        return data;
    }

    function handleClick(){
        history.push("/nowa-recepta")
    }

    return(
        <main>
            <div className="listHeader">
                <h2>Twoje recepty</h2>
                <button type="button" className="btn btn-outline-primary btn-rounded waves-effect" onClick={handleClick}>ODNÓW RECEPTĘ</button>
            </div>
            <div className="appointmentList">
                <PrescriptionListTable prescriptionData={prescriptions}/>
            </div>
        </main>
    )
}


export default PrescriptionList;