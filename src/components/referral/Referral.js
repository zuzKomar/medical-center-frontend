import React from "react";
import {useHistory} from 'react-router';

const Referral = ({referral}) =>{
    const history = useHistory();

    const handleClick = ()=>{
        history.push({
            pathname: '/nowa-wizyta',
            state: referral
        });
    }

return(
    <div className="referral">
        <div className="referralDiv1">
            <p className="referralHeader">{((referral.service.name).includes('adanie') ? 'Skierowanie na '+ referral.service.name : referral.service.name)}</p>
            <label className="serviceType">{referral.service.name}</label>
        </div>
        <div className="referralDiv2">
            <p>Data wystawienia: {referral.issueDate}</p>
            <p>Skierowanie ważne do: {referral.expiryDate}</p>
            { !referral.used  &&
                <button className="actionButton" onClick={handleClick}>UMÓW WIZYTĘ</button>
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