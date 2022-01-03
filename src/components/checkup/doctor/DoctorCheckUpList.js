import React, {useEffect, useState} from "react";
import {baseUrl} from "../../../config/config";
import DoctorCheckUp from "./DoctorCheckUp";
import Pagination from "@material-ui/lab/Pagination";

const DoctorCheckUpList = ({t}) => {

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
        const getCheckUps = async () => {
            const checkUps = await fetchCheckUps()
            setCheckUps(checkUps.checkUps);
            setCount(checkUps.totalPages);
        }
        getCheckUps()
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
        } else if (params.page !== null && params.size === null) {
            res = await fetch(`${baseUrl}/doctors/${userId}/testsWithoutResults?page=${params.page}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
        } else if (params.page === null && params.size !== null) {
            res = await fetch(`${baseUrl}/doctors/${userId}/testsWithoutResults?size=${params.size}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
        } else {
            res = await fetch(`${baseUrl}/doctors/${userId}/testsWithoutResults`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
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

    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>{t("checkUpsToRealize")}</h2>
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
            {checkUps.map(checkUp => (
                <DoctorCheckUp checkup={checkUp} setSelectedCheckup={setSelectedCheckup} t={t}/>
            ))}
            <Pagination className="my-3" count={count} page={page} siblingCount={1} boundaryCount={1} shape="rounded" onChange={handlePageChange}/>
        </div>
    )
}

export default DoctorCheckUpList;