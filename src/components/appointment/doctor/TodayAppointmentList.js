import React, {useState, useEffect} from "react";
import {useHistory} from "react-router";
import {baseUrl} from "../../../config/config";
import DoctorAppointment from "./DoctorAppointment";
import Pagination from "@material-ui/lab/Pagination";

const TodayAppointmentList = ({t, logout}) => {
    const history = useHistory();
    const [userId, setUserId] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('id'));
        return saved || undefined;
    });
    const [userToken, setUserToken] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('token'));
        return saved || undefined;
    });

    const pageSizes = [3, 5, 10];
    const [appointments, setAppointments] = useState([]);
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
        logout(history);
    },[])

    useEffect(() => {
        const getAppointments = async () => {
            const appointments = await fetchAppointments()
            setAppointments(appointments.appointments)
            setCount(appointments.totalPages)
        }
        getAppointments();
    }, [page, pageSize])

    const fetchAppointments = async () =>{
        const params = getRequestParams(page, pageSize);
        let res;
        if(params.page !== null && params.size !== null){
            res = await fetch(`${baseUrl}/doctors/${userId}/todaysVisits?page=${params.page}&size=${params.size}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            });
        }else if(params.page !== null && params.size === null){
            res = await fetch(`${baseUrl}/doctors/${userId}/todaysVisits?page=${params.page}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            });
        }else if(params.page === null && params.size !== null){
            res = await fetch(`${baseUrl}/doctors/${userId}/todaysVisits?size=${params.size}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            });
        }else{
            res = await fetch(`${baseUrl}/doctors/${userId}/todaysVisits`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            });
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

    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>{t("todayAppointments")}</h2>
            </div>
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
            <div className="appointmentList">
                {appointments.map(appointment => <DoctorAppointment key={appointment.id} app={appointment} t={t} />)}
            </div>
            <Pagination className="my-3" count={count} page={page} siblingCount={1} boundaryCount={1} shape="rounded" onChange={handlePageChange}/>
        </div>
    )
}

export default TodayAppointmentList;