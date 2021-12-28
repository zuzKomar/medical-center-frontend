import React from "react";
import {useHistory} from 'react-router';
import {useState, useEffect} from "react";


const Referral = ({referral, setSelectedReferral, t}) =>{
    const history = useHistory();
    const [ref, setRef] = useState(referral);

    useEffect(()=>{
        if(referral !== undefined){
            setRef(referral);
        }
    },[referral])

    const handleClick = (e)=>{
        e.preventDefault();
        setSelectedReferral(referral);

        history.push({
            pathname: '/nowa-wizyta',
            state: ref
        });
    }

    const formatYmd = date => date.toISOString().slice(0, 10);

return(
    <div className="referral">
        <div className="referralDiv1">
            <p className="referralHeader">{ref.medicalService.name}</p>
        </div>
        <div className="referralDiv2">
            <p>{t("issueDate")}&nbsp;{ref.issueDate}</p>
            <p>{t("referralValidUntil")}&nbsp;{ref.expiryDate}</p>
        </div>
        <hr/>
        <div style={{display: 'flex' ,justifyContent: 'flex-end'}}>
            {formatYmd(new Date(ref.expiryDate))>= formatYmd(new Date()) ?
            <button className="actionButton" onClick={(e) => handleClick(e)}>UMÓW WIZYTĘ</button>
           : <p style={{color : 'red'}}>{t("referralInvalid")}</p> }
        </div>
    </div>
)}

export default Referral