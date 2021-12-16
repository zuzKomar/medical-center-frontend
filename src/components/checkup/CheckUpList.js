import React, {useState, useEffect} from "react";
import CheckUp from "./CheckUp";
import {baseUrl} from "../../config/config";
import Pagination from "@material-ui/lab/Pagination";

const CheckUpList = () =>{
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
                const checkups = await fetchCheckups()
                setCheckups(checkups.diagnosticTests)
                setCount(checkups.totalPages)
        }
        getCheckups()
    },[page, pageSize])


    const fetchCheckups = async () =>{
        const params = getRequestParams(page, pageSize);
        let res;
        if(params.page !== null && params.size !== null){
            res = await fetch(`${baseUrl}/patients/1/diagnosticTests?page=${params.page}&size=${params.size}`)
        }else if(params.page !== null && params.size === null){
            res = await fetch(`${baseUrl}/patients/1/diagnosticTests?page=${params.page}`)
        }else if(params.page === null && params.size !== null){
            res = await fetch(`${baseUrl}/patients/1/diagnosticTests?size=${params.size}`)
        }else{
            res = await fetch(`${baseUrl}/patients/1/diagnosticTests`)
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
                <h2>Twoje badania</h2>
            </div>
            <div className="itemsNumber">
                <p>Ilość elementów na stronie: </p>
                <select onChange={handlePageSizeChange} value={pageSize}>
                    {pageSizes.map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>
            {checkups.map((checkup) =>(
                <CheckUp key={checkup.id} checkup={checkup}/>
            ))}
            <Pagination className="my-3" count={count} page={page} siblingCount={1} boundaryCount={1} shape="rounded" onChange={handlePageChange}/>
        </div>
    )
}

export default CheckUpList;