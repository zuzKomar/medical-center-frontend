import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";

const TodayAppointmentList = () => {

    useEffect(() => {
        const getAppointments = async () => {
            const appointments = await fetchAppointments()
        }
    })

    const fetchAppointments = async () =>{

    }

    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>Today's Visits</h2>
            </div>
            <div className="appointmentListHeader">

            </div>
        </div>
    )
}

export default TodayAppointmentList;