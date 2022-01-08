import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {baseUrl} from "../../../../config/config";
import ArchivalVisit from "./ArchivalVisit";
import AppointmentDetailsButtonPanel from "../AppointmentDetailsButtonPanel";
import Pagination from "@material-ui/lab/Pagination";

const VisitsHistoryList = ({t, logout}) => {
    const [redirect, setRedirect] = useState(false);
    const [userToken, setUserToken] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('token'));
        return saved || undefined;
    });

    let history = useHistory();
    const appointment = history.location.state;
    const [patientsAppointments, setPatientsAppointments] = useState([]);

    const pageSizes = [3, 5, 10];
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [pageSize, setPageSize] = useState(pageSizes[0]);

    const getRequestParams = (page, pageSize) =>{
        let params = {};

        if(page){
            params["page"] = page - 1;
        }
        if(pageSize){
            params["size"] = pageSize;
        }
        return params;
    }

    useEffect(() => {
        let controller = new AbortController();

        (async () => {
            try{
                const appointments = await fetchAppointments()
                setPatientsAppointments(appointments.appointments)
                controller = null;
            }catch(e){
                console.log(e)
                setRedirect(true);
            }
        })();
        return () =>controller?.abort();

    }, [page, pageSize])

    const fetchAppointments = async () =>{
        const params = getRequestParams(page, pageSize);
        let res;

        if(params.page !== null && params.size !== null){
            res = await fetch(`${baseUrl}/patients/${appointment.patient.id}/doneAppointments?page=${params.page}&size=${params.size}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
            if(res.status === 403){
                setRedirect(true);
            }

        }else if(params.page !== null && params.size === null){
            res = await fetch(`${baseUrl}/patients/${appointment.patient.id}/doneAppointments?page=${params.page}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
            if(res.status === 403){
                setRedirect(true);
            }
        }else if(params.page === null && params.size !== null){
            res = await fetch(`${baseUrl}/patients/${appointment.patient.id}/doneAppointments?size=${params.size}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
            if(res.status === 403){
                setRedirect(true)
            }
        }else{
            res = await fetch(`${baseUrl}/patients/${appointment.patient.id}/doneAppointments`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
            if(res.status === 403){
                setRedirect(true)
            }
        }

        const data = await res.json()

        return data
    }

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPage(1);
    };


    if(redirect === true){
        logout(history);
        return (
            <></>
        )
    }else {
        return (
            <div className="itemsList">
                <div className="listHeader">
                    <h2>{t("appointmentsHistory")}</h2>
                </div>
                <AppointmentDetailsButtonPanel appointment={appointment} t={t}/>
                <div className="itemsNumber">
                    <p>{t("elementsNumber")}&nbsp;</p>
                    <select onChange={handlePageSizeChange} value={pageSize}>
                        {pageSizes.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
                {patientsAppointments.length > 0 ?
                    <div className="appointmentList">
                        {patientsAppointments.map(patientAppointment => <ArchivalVisit key={patientAppointment.id}
                                                                                       appointment={patientAppointment}
                                                                                       t={t}/>)}
                    </div> : <span style={{marginTop: '1%'}}>{t("noAppointmentsToShow")}</span>
                }
                {patientsAppointments.length > 0 &&
                <Pagination className="my-3" count={count} page={page} siblingCount={1} boundaryCount={1}
                            shape="rounded" onChange={handlePageChange}/>
                }

            </div>
        )
    }
}

export default VisitsHistoryList;