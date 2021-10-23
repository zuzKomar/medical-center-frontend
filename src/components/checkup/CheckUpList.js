import React, {useState, useEffect} from "react";
import CheckUp from "./CheckUp";

const CheckUpList = () =>{

    const [checkups, setCheckups] = useState([]);

    useEffect(()=>{
        const getCheckups = async () =>{
            const checkups = await fetchCheckups()
            setCheckups(checkups)
        }
        getCheckups()
    },[])

    const fetchCheckups = async () =>{
        const res = await fetch('http://localhost:5000/appointmentCheckups')
        const data = await res.json();

        return data;
    }

    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>Twoje badania</h2>
            </div>
                {checkups.map((checkup) =>(
                    <CheckUp key={checkup.id} checkup={checkup}/>
                ))}
        </div>
    )
}

export default CheckUpList;