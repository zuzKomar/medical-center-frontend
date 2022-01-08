import React, {useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
import {useHistory} from "react-router";
import CheckUp from "./CheckUp";
import {baseUrl} from "../../config/config";
import Pagination from "@material-ui/lab/Pagination";
import AppointmentDetailsButtonPanel from "../appointment/doctor/AppointmentDetailsButtonPanel";

const CheckUpList = ({t, logout}) =>{
    const [redirect, setRedirect] = useState(false);
    const [userId, setUserId] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('id'));
        return saved || undefined;
    });
    const [userToken, setUserToken] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('token'));
        return saved || undefined;
    });

    const history = useHistory();
    const app = history.location.state;
    const [appointment, setAppointment] = useState(app ? app : undefined);
    const location = useLocation();
    const pageSizes = [3, 5, 10];
    const [checkups, setCheckups] = useState([]);

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

    useEffect(()=>{
        const getCheckups = async () =>{
            const checkUps = await fetchCheckups()
            setCheckups(checkUps.diagnosticTests)
            setCount(checkUps.totalPages)
        }
        getCheckups()
    },[page, pageSize])


    const fetchCheckups = async () =>{
        const params = getRequestParams(page, pageSize);
        let res;
        if(appointment === undefined){
            if(params.page !== null && params.size !== null){
                res = await fetch(`${baseUrl}/patients/${userId}/diagnosticTests?page=${params.page}&size=${params.size}`,{
                    headers: {'Authorization' : `Bearer ${userToken}`}
                })
                if(res.status === 403){
                    setRedirect(true);
                }

            }else if(params.page !== null && params.size === null){
                res = await fetch(`${baseUrl}/patients/${userId}/diagnosticTests?page=${params.page}`,{
                    headers: {'Authorization' : `Bearer ${userToken}`}
                })
                if(res.status === 403){
                    setRedirect(true);
                }

            }else if(params.page === null && params.size !== null){
                res = await fetch(`${baseUrl}/patients/${userId}/diagnosticTests?size=${params.size}`,{
                    headers: {'Authorization' : `Bearer ${userToken}`}
                })
                if(res.status === 403){
                    setRedirect(true);
                }

            }else{
                res = await fetch(`${baseUrl}/patients/${userId}/diagnosticTests`,{
                    headers: {'Authorization' : `Bearer ${userToken}`}
                })
                if(res.status === 403){
                    setRedirect(true);
                }
            }
        }else{
            if(params.page !== null && params.size !== null){
                res = await fetch(`${baseUrl}/patients/${appointment.patient.id}/diagnosticTests?page=${params.page}&size=${params.size}`,{
                    headers: {'Authorization' : `Bearer ${userToken}`}
                })
                if(res.status === 403){
                    setRedirect(true);
                }

            }else if(params.page !== null && params.size === null){
                res = await fetch(`${baseUrl}/patients/${appointment.patient.id}/diagnosticTests?page=${params.page}`,{
                    headers: {'Authorization' : `Bearer ${userToken}`}
                })
                if(res.status === 403){
                    setRedirect(true);
                }

            }else if(params.page === null && params.size !== null){
                res = await fetch(`${baseUrl}/patients/${appointment.patient.id}/diagnosticTests?size=${params.size}`,{
                    headers: {'Authorization' : `Bearer ${userToken}`}
                })
                if(res.status === 403){
                    setRedirect(true);
                }

            }else{
                res = await fetch(`${baseUrl}/patients/${appointment.patient.id}/diagnosticTests`,{
                    headers: {'Authorization' : `Bearer ${userToken}`}
                })
                if(res.status === 403){
                    setRedirect(true);
                }
            }
        }


        const data = await res.json();

        return data;
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
                    <h2>{t("yourCheckUps")}</h2>
                </div>
                <br/>
                {(appointment !== undefined) &&
                <AppointmentDetailsButtonPanel appointment={appointment} t={t}/>
                }
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
                {checkups.map((checkup) => (
                    <CheckUp key={checkup.id} checkup={checkup} t={t} logout={logout}/>
                ))}
                <Pagination className="my-3" count={count} page={page} siblingCount={1} boundaryCount={1}
                            shape="rounded" onChange={handlePageChange}/>
            </div>
        )
    }
}

export default CheckUpList;