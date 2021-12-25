import React from "react";
import {useState, useEffect} from "react";
import {withRouter} from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css"
import NewAppointmentForm from "./NewAppointmentForm";
import AvailableAppointment from "./AvailableAppointment";
import AppointmentModal from "./AppointmentModal";
import {baseUrl} from "../../config/config";
import Pagination from "@material-ui/lab/Pagination";

const NewAppointment = () =>{
    const [appointments, setAppointments] = useState([]);
    const [receivedService, setReceivedService] = useState(undefined);
    const [selectedAppointment, setSelectedAppointment] = useState(undefined);
    const [selectedReferral, setSelectedReferral] = useState(undefined);
    const [openModal, setOpenModal] = useState(false);
    const [dateFrom, setDateFrom] = useState(undefined);
    const [dateTo, setDateTo] = useState(undefined);
    const [doctor, setDoctor] = useState(undefined);
    const [language, setLanguage] = useState(undefined);

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

    function handleAppointmentSearch(appointmentType, language, service, doctor, dateFrom, dateTo, selectedReferral){
        setReceivedService(service);
        setSelectedReferral(selectedReferral);
        setDateFrom(dateFrom);
        setDateTo(dateTo);
        setDoctor(doctor);
        if(language==='polski'){
            setLanguage("PL");
        }else{
            setLanguage("EN");
        }
    }

    useEffect(()=>{
        if(receivedService !== undefined){
            const getAvailableAppointments = async () =>{
                const apps = await fetchAppointments();
                setAppointments(apps.appointments)
                setCount(apps.totalPages);
            }

            getAvailableAppointments()
        }
    },[receivedService, page, pageSize])

    useEffect(()=>{
        if(selectedAppointment!==undefined){
            setSelectedAppointment(selectedAppointment)
        }
    }, [selectedAppointment])

    const fetchAppointments = async ()=>{
        const params = getRequestParams(page, pageSize);
        let res;
        if(doctor!==null){
            if(params.page !== null && params.size !== null){
                res = await fetch(`${baseUrl}/appointments?medicalServiceId=${receivedService.id}&doctorId=${doctor.id}&dateFrom=${dateFrom}T00:00:00&dateTo=${dateTo}T00:00:00&language=${language}&page=${params.page}&size=${params.size}`);
            }else if(params.page !== null && params.size === null){
                res = await fetch(`${baseUrl}/appointments?medicalServiceId=${receivedService.id}&doctorId=${doctor.id}&dateFrom=${dateFrom}T00:00:00&dateTo=${dateTo}T00:00:00&language=${language}&page=${params.page}`);
            }else if(params.page === null && params.size !== null){
                res = await fetch(`${baseUrl}/appointments?medicalServiceId=${receivedService.id}&doctorId=${doctor.id}&dateFrom=${dateFrom}T00:00:00&dateTo=${dateTo}T00:00:00&language=${language}&size=${params.size}`);
            }else{
                res = await fetch(`${baseUrl}/appointments?medicalServiceId=${receivedService.id}&doctorId=${doctor.id}&dateFrom=${dateFrom}T00:00:00&dateTo=${dateTo}T00:00:00&language=${language}`);
            }
        }else{
            if(params.page !== null && params.size !== null){
                res = await fetch(`${baseUrl}/appointments?medicalServiceId=${receivedService.id}&dateFrom=${dateFrom}T00:00:00&dateTo=${dateTo}T00:00:00&language=${language}&page=${params.page}&size=${params.size}`);
            }else if(params.page !== null && params.size === null){
                res = await fetch(`${baseUrl}/appointments?medicalServiceId=${receivedService.id}&dateFrom=${dateFrom}T00:00:00&dateTo=${dateTo}T00:00:00&language=${language}&page=${params.page}`);
            }else if(params.page === null && params.size !== null){
                res = await fetch(`${baseUrl}/appointments?medicalServiceId=${receivedService.id}&dateFrom=${dateFrom}T00:00:00&dateTo=${dateTo}T00:00:00&language=${language}&size=${params.size}`);
            }else{
                res = await fetch(`${baseUrl}/appointments?medicalServiceId=${receivedService.id}&dateFrom=${dateFrom}T00:00:00&dateTo=${dateTo}T00:00:00&language=${language}`);
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

    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>Nowa wizyta</h2>
            </div>
                <NewAppointmentForm getAppointments={handleAppointmentSearch}/>
                <>
                    {appointments.length > 0 ? <h3 style={{fontFamily : 'Montserrat, sans-serif'}}>Dostępne wizyty</h3> : ''}
                    {appointments.length > 0 &&
                        <div className="itemsNumber availableAppsPagination">
                            <p>Ilość elementów na stronie: </p>
                            <select onChange={handlePageSizeChange} value={pageSize}>
                                {pageSizes.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                    }
                    {appointments.length > 0 ?
                        appointments.map((app)=>(
                            <AvailableAppointment key={app.id} appointment={app} setOpenModal={setOpenModal} setSelectedAppointment={setSelectedAppointment}/>
                        )) : (receivedService!== undefined ? 'Brak dostępnych wizyt spełniających wybrane kryteria' : '')}
                    {appointments.length > 0 &&
                    <Pagination className="my-3" count={count} page={page} siblingCount={1} boundaryCount={1} shape="rounded" onChange={handlePageChange}/>
                    }
                    {(openModal && selectedAppointment !== undefined) ? <AppointmentModal selectedAppointment={selectedAppointment} setOpenModal={setOpenModal} selectedReferral={selectedReferral}/> : ''}
                </>
        </div>
    )
}

export default withRouter(NewAppointment);