import React from "react";

const Referral = ({referral}) =>{

return(
    <div className="referral">
        <div className="referralDiv1">
            <p className="referralHeader">Internista - konsultacja telefoniczna</p>
            <label className="serviceType">Wizyta kontrolna</label>
        </div>
        <div className="referralDiv2">
            <p>Data wystawienia: {referral.dateFrom}</p>
            <p>Skierowanie ważne do: {referral.dateTo}</p>
            { !referral.used  &&
                <button className="registerReferralButton">Umów</button>
            }
        </div>
        <hr/>
        <div>
            <p>Wizyta zlecona przez:</p>
            lek.med. {referral.doctor}
        </div>
    </div>
)}

export default Referral