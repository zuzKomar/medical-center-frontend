import React, {useState, useEffect} from "react";
import Referral from "./Referral";
import {baseUrl} from "../../config/config";
import Pagination from "@material-ui/lab/Pagination";

const ReferralList = () =>{
    const pageSizes = [3, 5, 10];
    const [referrals, setReferrals] = useState([]);
    const [selectedReferral, setSelectedReferral] = useState(undefined);

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
        const getReferrals = async () =>{
                const referrals = await fetchReferrals()
                setReferrals(referrals.referrals)
                setCount(referrals.totalPages)
        }
        getReferrals()
    },[page, pageSize])

    useEffect(()=>{
        if(selectedReferral!==undefined) {
            setReferrals(referrals.filter(filterReferrals));

        }
    },[selectedReferral])


    const fetchReferrals = async() => {
        const params = getRequestParams(page, pageSize);
        let res;
        if(params.page !== null && params.size !== null){
            res = await fetch(`${baseUrl}/patients/1/referrals?page=${params.page}&size=${params.size}`)
        }else if(params.page !== null && params.size === null){
            res = await fetch(`${baseUrl}/patients/1/referrals?page=${params.page}`)
        }else if(params.page === null && params.size !== null){
            res = await fetch(`${baseUrl}/patients/1/referrals?size=${params.size}`)
        }else{
            res = await fetch(`${baseUrl}/patients/1/referrals`)
        }

        const data = await res.json()

        return data
    }

    function filterReferrals(referral){
        if(referral.id !== selectedReferral.id){
            return referral;
        }
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
                <h2>Twoje skierowania</h2>
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

            {referrals.map((referral) =>(
                <Referral key={referral.id} referral={referral} setSelectedReferral={setSelectedReferral}/>
                ))}
            <Pagination className="my-3" count={count} page={page} siblingCount={1} boundaryCount={1} shape="rounded" onChange={handlePageChange}/>
        </div>
    )
}

export default ReferralList