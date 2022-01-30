import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import Appointment from "./Appointment";
import Form from "react-bootstrap/Form";
import "react-datepicker/dist/react-datepicker.css"
import {baseUrl} from "../../config/config";
import Pagination from "@material-ui/lab/Pagination";

const AppointmentList = ({t, logout}) =>{
    let history = useHistory();
    const [redirect, setRedirect] = useState(false);
    const formatYmd = date => date.toISOString().slice(0,10);
    const facility = 'FACILITY';
    const phone = 'TELEPHONE';
    const reserved = 'RESERVED';
    const confirmed = 'CONFIRMED';
    const done = 'DONE';

    const [userId, setUserId] = useState(()=>{
        const savedUserId = JSON.parse(sessionStorage.getItem('id'));
        return savedUserId || undefined;
    });
    const [userToken, setUserToken] = useState(()=>{
        const savedToken = JSON.parse(sessionStorage.getItem('token'));
        return savedToken || undefined;
    });

    const [appointments, setAppointments] = useState([]);
    const [appDate, setAppDate] = useState(undefined);
    const [filteredAppointments, setFilteredAppointments] = useState([appointments]);
    const [canceledAppointment, setCancelledAppointment] = useState(undefined);

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

    useEffect(() =>{
        let controller = new AbortController();

        (async () =>{
            let todaysVisits = [];
            let visitToConfirm =[];
            let futureVisits = [];
            let pastVisits = [];
            let finalApps=[];
            try{
                await fetchAppointments()
                    .then(res=>{
                        setCount(res.totalPages);
                        res.appointments.map((app) => {
                            if(((new Date(app.date.slice(0,10))) > new Date(new Date().setDate(new Date().getDate()+1)))&&app.state === reserved){
                                futureVisits.push(app)
                            }else if(((new Date(new Date().setDate(new Date().getDate()+1))).getDate() === (new Date(app.date.slice(0,10))).getDate()) && app.state === reserved){
                                visitToConfirm.push(app)
                            }else if(app.state === confirmed){
                                todaysVisits.push(app)
                            }else if(app.state === done){
                                pastVisits.push(app)
                            }
                        })
                    }).then(()=>{
                        todaysVisits = todaysVisits.sort((a,b)=>new Date(a.date) - new Date(b.date))
                        finalApps = [...visitToConfirm, ...todaysVisits, ...futureVisits, ...pastVisits];
                    })
                setAppointments(finalApps);
                setFilteredAppointments(finalApps);
                controller = null;
            }catch (e){
                console.log(e)
                setRedirect(true);
            }
        })();
        return () => controller?.abort();

    }, [canceledAppointment, page, pageSize])


    const checkAppId = (app) =>{
        return app.patientId !=null;
    }

    useEffect(()=>{
        if(canceledAppointment!==undefined){
            const result = appointments.filter(checkAppId);
            setAppointments(result);
        }
    },[canceledAppointment])


    const fetchAppointments = async () =>{
        const params = getRequestParams(page, pageSize);
        let res;
        if(params.page !== null && params.size !== null){
            res = await fetch(`${baseUrl}/patients/${userId}/appointments?page=${params.page}&size=${params.size}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
            if(res.status === 403){
                setRedirect(true);
            }

        }else if(params.page !== null && params.size === null){
            res = await fetch(`${baseUrl}/patients/${userId}/appointments?page=${params.page}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
            if(res.status === 403){
                setRedirect(true);
            }

        }else if(params.page === null && params.size !== null){
            res = await fetch(`${baseUrl}/patients/${userId}/appointments?size=${params.size}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
            if(res.status === 403){
                setRedirect(true);
            }

        }else{
            res = await fetch(`${baseUrl}/patients/${userId}/appointments`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
            if(res.status === 403){
                setRedirect(true);
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

    const handleFacilityFilter = () =>{
        let facilityAppointments = appointments.filter(appointment => (appointment.type === facility));
        setFilteredAppointments(facilityAppointments);
    }

    const handlePhoneFilter = () =>{
        let phoneAppointments = appointments.filter(appointment => (appointment.type === phone));
        setFilteredAppointments(phoneAppointments);
    }

    const handleShowAll = () =>{
        setFilteredAppointments(appointments);
    }

    const handleDateFilter = (e) =>{
        e.preventDefault();
        if(e.target.value){
            let x = (new Date()).getTimezoneOffset() * 60000;
            let appointmentsFilteredByDate = appointments
                .filter(appointment => (appointment.date.slice(0,10) === e.target.value))
            setFilteredAppointments(appointmentsFilteredByDate);
        }else{
            setAppDate(formatYmd(new Date()));
        }
    }

    const handleClick = () =>{
        history.push("/new-appointment");
    }

    if(redirect === true){
        logout(history);
        return (
            <></>
        )
    }else {
        return (
            <div className="itemsList">
                <div className="listHeader">
                    <h2>{t("yourAppointments")}</h2>
                </div>
                <div className="appointmentListHeader">
                    <div className="checkBoxesAndButton">
                        <div className="checkboxes">
                            <div className="checkbox">
                                <input type="radio" id="all" name="box" value="all" onChange={handleShowAll}/>
                                <label htmlFor="all">{t("all")}</label>
                            </div>
                            <div className="checkbox">
                                <input type="radio" id="normal" name="box" value="normal"
                                       onChange={handleFacilityFilter}/>
                                <label htmlFor="normal">{t("facilityAppointment")}</label>
                            </div>
                            <div className="checkbox">
                                <input type="radio" id="tele" name="box" value="tele" onChange={handlePhoneFilter}/>
                                <label htmlFor="tele">{t("teleconsultation")}</label>
                            </div>
                        </div>
                        <div>
                            <button className="actionButton" onClick={handleClick}>{t("makeAppointment")}</button>
                        </div>
                    </div>
                </div>
                <div className="test">
                    <div className="appDate">
                        <Form>
                            <Form.Group>
                                <Form.Label>{t("date")}</Form.Label>
                                <Form.Control type='date' onChange={(e) => {
                                    setAppDate(e.target.value)
                                    handleDateFilter(e)
                                }} value={appDate}/>
                            </Form.Group>
                        </Form>
                    </div>
                    {filteredAppointments.length > 0 &&
                    <div className="itemsNumber" style={{height: '4%'}}>
                        <p>{t("elementsNumber")}&nbsp;</p>
                        <select onChange={handlePageSizeChange} value={pageSize}>
                            {pageSizes.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                    }
                </div>
                {filteredAppointments.length > 0 ?
                        <>
                            <div className="appointmentList">
                                {filteredAppointments.map((appointment) => (
                                    <Appointment key={appointment.id} appointment={appointment}
                                                 setCancelledAppointment={setCancelledAppointment} t={t} logout={logout}/>
                                ))}
                            </div>

                            <Pagination className="my-3" count={count} page={page} siblingCount={1} boundaryCount={1}
                                        shape="rounded" onChange={handlePageChange}/>
                        </> : t("noAppointmentsToShow")
                }
            </div>
        )
    }
}

export default AppointmentList;