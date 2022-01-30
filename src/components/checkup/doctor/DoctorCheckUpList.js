import React, {useEffect, useState} from "react";
import {useHistory} from "react-router";
import {baseUrl} from "../../../config/config";
import DoctorCheckUp from "./DoctorCheckUp";
import Pagination from "@material-ui/lab/Pagination";

const DoctorCheckUpList = ({t, logout}) => {
    const history = useHistory();
    const [redirect, setRedirect] = useState(false);
    const [userId, setUserId] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('id'));
        return saved || undefined;
    });
    const [userToken, setUserToken] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('token'));
        return saved || undefined;
    });

    const pageSizes = [3, 5, 10];
    const [checkUps, setCheckUps] = useState([]);
    const [selectedCheckup, setSelectedCheckup] = useState(undefined);

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [pageSize, setPageSize] = useState(pageSizes[0]);

    const getRequestParams = (page, pageSize) => {
        let params = {};

        if (page) {
            params["page"] = page - 1;
        }
        if (pageSize) {
            params["size"] = pageSize;
        }
        return params;
    }

    useEffect(() => {
        let controller = new AbortController();

        (async () => {
            try{
                const checkUps = await fetchCheckUps()
                setCheckUps(checkUps.checkUps);
                setCount(checkUps.totalPages);
                controller = null;
            }catch (e){
                console.log(e)
                setRedirect(true);
            }
        })();
        return () =>controller?.abort();

    }, [page, pageSize, selectedCheckup])

    useEffect(()=>{
        if(selectedCheckup !== undefined){
            setCheckUps(checkUps.filter(filterCheckups));
        }
    }, [selectedCheckup])


    const fetchCheckUps = async () => {
        const params = getRequestParams(page, pageSize);
        let res;
        if (params.page !== null && params.size !== null) {
            res = await fetch(`${baseUrl}/doctors/${userId}/testsWithoutResults?page=${params.page}&size=${params.size}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
            if(res.status === 403){
                setRedirect(true);
            }
        } else if (params.page !== null && params.size === null) {
            res = await fetch(`${baseUrl}/doctors/${userId}/testsWithoutResults?page=${params.page}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
            if(res.status === 403){
                setRedirect(true);
            }
        } else if (params.page === null && params.size !== null) {
            res = await fetch(`${baseUrl}/doctors/${userId}/testsWithoutResults?size=${params.size}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
            if(res.status === 403){
                setRedirect(true);
            }
        } else {
            res = await fetch(`${baseUrl}/doctors/${userId}/testsWithoutResults`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
            if(res.status === 403){
                setRedirect(true);
            }
        }

        const data = await res.json();

        return data;
    }

    const filterCheckups = (checkup) =>{
        if(checkup.appointmentId !== selectedCheckup.appointmentId && checkup.checkUpId !== selectedCheckup.checkUpId){
            return checkup;
        }
    }

    const handlePageChange = (event, value) => {
        setPage(value);
    }

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
                    <h2>{t("checkUpsToRealize")}</h2>
                </div>
                {checkUps.length > 0 ?
                <>
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
                    {checkUps.map(checkUp => (
                        <DoctorCheckUp checkup={checkUp} setSelectedCheckup={setSelectedCheckup} t={t}/>
                    ))}
                    <Pagination className="my-3" count={count} page={page} siblingCount={1} boundaryCount={1}
                                shape="rounded" onChange={handlePageChange}/>
                </> : t("noCheckUps")
                }
            </div>
        )
    }
}

export default DoctorCheckUpList;