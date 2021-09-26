import React from "react";
import Referral from "./Referral";



const ReferralList = ({referrals}) =>{
    return(
        <div className="referralList">
            {referrals.map((referral) =>(
                <Referral key={referral.id} referral={referral}/>
                ))}
        </div>
    )
}

export default ReferralList