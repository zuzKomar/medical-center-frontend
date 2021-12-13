import React from "react";
import {useHistory} from 'react-router';
import {useState, useEffect} from "react";


const Referral = ({referral, setSelectedReferral}) =>{
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

return(
    <div className="referral">
        <div className="referralDiv1">
            <p className="referralHeader">{ref.medicalService.name}</p>
            {/*<label className="serviceType">{ref.medicalServiceDTO.name}</label>*/}
        </div>
        <div className="referralDiv2">
            <p>Data wystawienia: {ref.issueDate}</p>
            <p>Skierowanie ważne do: {ref.expiryDate}</p>
        </div>
        <hr/>
        <div style={{display: 'flex' ,justifyContent: 'flex-end'}}>
            {/*{((new Date(ref.expiryDate).getDate()) >= (new Date().getDate()))  &&*/}
            <button className="actionButton" onClick={(e)=>handleClick(e)}>UMÓW WIZYTĘ</button>
        </div>
    </div>
)}

export default Referral