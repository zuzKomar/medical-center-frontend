import React, {useState, useEffect} from "react";
import {useHistory} from "react-router";
import PrescriptionListTable from "./PrescriptionListTable";
import {baseUrl} from "../../config/config";

const PrescriptionList = ({t, logout}) =>{
    const history = useHistory();
    const [redirect, setRedirect] = useState(false);
    const [userId, ,setUserId] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('id'));
        return saved || undefined;
    });
    const [userToken, setUserToken] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('token'));
        return saved || undefined;
    });

    const [prescriptions, setPrescriptions] = useState([]);

    useEffect(()=>{
        let controller = new AbortController();

        (async () =>{
            try{
                const prescriptions = await fetchPrescriptions()
                setPrescriptions(prescriptions);
                controller = null;
            }catch (e){
                console.log(e)
                setRedirect(true);
            }
        })();
        return () => controller?.abort();
    },[])


    const fetchPrescriptions = async () =>{
        const res = await fetch(`${baseUrl}/patients/${userId}/prescriptions`,{
            headers: {'Authorization' : `Bearer ${userToken}`}
        })
        if(res.status === 403){
            setRedirect(true);
        }
        const data = await res.json();

        return data;
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
                    <h2>{t("yourPrescriptions")}</h2>
                </div>
                <div className="appointmentList">
                    <PrescriptionListTable prescriptionData={prescriptions} t={t}/>
                </div>
            </div>
        )
    }
}


export default PrescriptionList;