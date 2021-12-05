import React, {useState, useEffect} from "react";
import Referral from "./Referral";
import {baseUrl} from "../../config/config";


const ReferralList = () =>{
    const [referrals, setReferrals] = useState([]);
    const [selectedReferral, setSelectedReferral] = useState(undefined);

    useEffect(() =>{
        const getReferrals = async () =>{
                const referrals = await fetchReferrals()
                setReferrals(referrals);
        }

        getReferrals()
    },[])

    useEffect(()=>{
        if(selectedReferral!==undefined) {
            setReferrals(referrals.filter(filterReferrals));

        }
    },[selectedReferral])


    const fetchReferrals = async() => {
        const res = await fetch(`${baseUrl}/patients/1/referrals`)
        const data = await res.json()

        return data
    }

    function filterReferrals(referral){
        if(referral.id !== selectedReferral.id){
            return referral;
        }
    }

    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>Twoje skierowania</h2>
            </div>
            {referrals.map((referral) =>(
                <Referral key={referral.id} referral={referral} setSelectedReferral={setSelectedReferral}/>
                ))}
        </div>
    )
}

export default ReferralList