import React, {useState, useEffect} from "react";
import Referral from "./Referral";


const ReferralList = () =>{

    const [referrals, setReferrals] = useState([]);

    useEffect(() =>{
        const getReferrals = async () =>{
            const referrals = await fetchReferrals()
            setReferrals(referrals)
        }

        getReferrals()
    },[])


    const fetchReferrals = async() => {
        const res = await fetch('http://localhost:5000/referrals')
        const data = await res.json()

        return data
    }

    return(
        <div className="referralList">
            {referrals.map((referral) =>(
                <Referral key={referral.id} referral={referral}/>
                ))}
        </div>
    )
}

export default ReferralList