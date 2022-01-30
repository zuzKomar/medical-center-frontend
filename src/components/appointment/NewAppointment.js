import React from "react";
import {useState, useEffect} from "react";
import {withRouter} from "react-router-dom";
import {useHistory} from "react-router";
import "react-datepicker/dist/react-datepicker.css"
import NewAppointmentForm from "./NewAppointmentForm";
import AvailableAppointment from "./AvailableAppointment";
import AppointmentModal from "./AppointmentModal";
import {baseUrl} from "../../config/config";
import Pagination from "@material-ui/lab/Pagination";

const NewAppointment = ({t, logout}) =>{
    const history = useHistory();
    const [redirect, setRedirect] = useState(false);
    const [userToken, setUserToken] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('token'));
        return saved || undefined;
    });

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

    const handleAppointmentSearch = (appointmentType, language, service, doctor, dateFrom, dateTo, selectedReferral) =>{
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

    function filterAppointmentsByHour(app){
        let time = new Date()
        return new Date(app.date) > time;
    }

    useEffect(()=>{
        if(receivedService !== undefined){
            const getAvailableAppointments = async () =>{
                const apps = await fetchAppointments();
                const filteredApps = apps.appointments.filter(filterAppointmentsByHour);
                setCount(apps.totalPages);
                setAppointments(filteredApps);
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
                res = await fetch(`${baseUrl}/appointments?medicalServiceId=${receivedService.id}&doctorId=${doctor.id}&dateFrom=${dateFrom}T00:00:00&dateTo=${dateTo}T23:59:00&language=${language}&page=${params.page}&size=${params.size}`,{
                    headers: {'Authorization' : `Bearer ${userToken}`}
                });
                if(res.status === 403){
                    setRedirect(true);
                }

            }else if(params.page !== null && params.size === null){
                res = await fetch(`${baseUrl}/appointments?medicalServiceId=${receivedService.id}&doctorId=${doctor.id}&dateFrom=${dateFrom}T00:00:00&dateTo=${dateTo}T23:59:00&language=${language}&page=${params.page}`,{
                    headers: {'Authorization' : `Bearer ${userToken}`}
                });
                if(res.status === 403){
                    setRedirect(true);
                }
            }else if(params.page === null && params.size !== null){
                res = await fetch(`${baseUrl}/appointments?medicalServiceId=${receivedService.id}&doctorId=${doctor.id}&dateFrom=${dateFrom}T00:00:00&dateTo=${dateTo}T23:59:00&language=${language}&size=${params.size}`,{
                    headers: {'Authorization' : `Bearer ${userToken}`}
                });
                if(res.status === 403){
                    setRedirect(true);
                }
            }else{
                res = await fetch(`${baseUrl}/appointments?medicalServiceId=${receivedService.id}&doctorId=${doctor.id}&dateFrom=${dateFrom}T00:00:00&dateTo=${dateTo}T23:59:00&language=${language}`,{
                    headers: {'Authorization' : `Bearer ${userToken}`}
                });
                if(res.status === 403){
                    setRedirect(true);
                }
            }
        }else{
            if(params.page !== null && params.size !== null){
                res = await fetch(`${baseUrl}/appointments?medicalServiceId=${receivedService.id}&dateFrom=${dateFrom}T00:00:00&dateTo=${dateTo}T23:59:00&language=${language}&page=${params.page}&size=${params.size}`,{
                    headers: {'Authorization' : `Bearer ${userToken}`}
                });
                if(res.status === 403){
                    setRedirect(true);
                }

            }else if(params.page !== null && params.size === null){
                res = await fetch(`${baseUrl}/appointments?medicalServiceId=${receivedService.id}&dateFrom=${dateFrom}T00:00:00&dateTo=${dateTo}T23:59:00&language=${language}&page=${params.page}`,{
                    headers: {'Authorization' : `Bearer ${userToken}`}
                });
                if(res.status === 403){
                    setRedirect(true);
                }

            }else if(params.page === null && params.size !== null){
                res = await fetch(`${baseUrl}/appointments?medicalServiceId=${receivedService.id}&dateFrom=${dateFrom}T00:00:00&dateTo=${dateTo}T23:59:00&language=${language}&size=${params.size}`,{
                    headers: {'Authorization' : `Bearer ${userToken}`}
                });
                if(res.status === 403){
                    setRedirect(true);
                }

            }else{
                res = await fetch(`${baseUrl}/appointments?medicalServiceId=${receivedService.id}&dateFrom=${dateFrom}T00:00:00&dateTo=${dateTo}T23:59:00&language=${language}`,{
                    headers: {'Authorization' : `Bearer ${userToken}`}
                });
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
                    <h2>{t("newAppointment")}</h2>
                </div>
                <NewAppointmentForm getAppointments={handleAppointmentSearch} t={t} logout={logout}/>
                <>
                    {appointments.length > 0 &&
                    <>
                        <h3 style={{fontFamily: 'Montserrat, sans-serif'}}>{t("availableAppointments")}</h3>
                        <div className="itemsNumber availableAppsPagination">
                            <p>{t("elementsNumber")}&nbsp;</p>
                            <select onChange={handlePageSizeChange} value={pageSize}>
                                {pageSizes.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>

                    }
                    {appointments.length > 0 ?
                        (appointments.map((app) => (
                            <AvailableAppointment key={app.id} appointment={app} setOpenModal={setOpenModal}
                                                  setSelectedAppointment={setSelectedAppointment} t={t}/>
                        ))) : (receivedService !== undefined ? t("noAppointments") : '')}
                    {appointments.length > 0 &&
                    <Pagination className="my-3" count={count} page={page} siblingCount={1} boundaryCount={1}
                                shape="rounded" onChange={handlePageChange}/>
                    }
                    {(openModal && selectedAppointment !== undefined) ?
                        <AppointmentModal selectedAppointment={selectedAppointment} setOpenModal={setOpenModal}
                                          selectedReferral={selectedReferral} t={t} logout={logout}/> : ''}
                </>
            </div>
        )
    }
}

export default withRouter(NewAppointment);