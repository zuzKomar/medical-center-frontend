import React, {useState, useEffect} from "react";
import {baseUrl} from "../../../config/config";
import DoctorAppointment from "./DoctorAppointment";
import Pagination from "@material-ui/lab/Pagination";

const TodayAppointmentList = ({t}) => {
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
            res = await fetch(`${baseUrl}/doctors/7/todaysVisits?page=${params.page}&size=${params.size}`);
        }else if(params.page !== null && params.size === null){
            res = await fetch(`${baseUrl}/doctors/7/todaysVisits?page=${params.page}`);
        }else if(params.page === null && params.size !== null){
            res = await fetch(`${baseUrl}/doctors/7/todaysVisits?size=${params.size}`);
        }else{
            res = await fetch(`${baseUrl}/doctors/7/todaysVisits`);
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