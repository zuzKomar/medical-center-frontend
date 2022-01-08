import React, {useState, useEffect} from "react";
import {useHistory} from "react-router";
import Referral from "./Referral";
import {baseUrl} from "../../config/config";
import Pagination from "@material-ui/lab/Pagination";

const ReferralList = ({t, logout}) =>{
    const history = useHistory();
    const [userId, setUserId] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('id'));
        return saved || undefined;
    });
    const [userToken, setUserToken] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('token'));
        return saved || undefined;
    });

    const [referrals, setReferrals] = useState([]);
    const [selectedReferral, setSelectedReferral] = useState(undefined);

    const pageSizes = [3, 5, 10];
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [pageSize, setPageSize] = useState(pageSizes[0]);

    const [redirect, setRedirect] = useState(false);

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
            try{
                const referrals = await fetchReferrals()
                setReferrals(referrals.referrals)
                setCount(referrals.totalPages)
                controller = null;
            }catch (e){
                console.log(e)
                setRedirect(true);
            }
        })();
        return () =>controller?.abort();

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
            res = await fetch(`${baseUrl}/patients/${userId}/referrals?page=${params.page}&size=${params.size}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
            if(res.status === 403){
                setRedirect(true);
            }

        }else if(params.page !== null && params.size === null){
            res = await fetch(`${baseUrl}/patients/${userId}/referrals?page=${params.page}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
            if(res.status === 403){
                setRedirect(true);
        }
        }else if(params.page === null && params.size !== null){
            res = await fetch(`${baseUrl}/patients/${userId}/referrals?size=${params.size}`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
            if(res.status === 403){
                setRedirect(true)
        }
        }else{
            res = await fetch(`${baseUrl}/patients/${userId}/referrals`,{
                headers: {'Authorization' : `Bearer ${userToken}`}
            })
            if(res.status === 403){
                setRedirect(true)
            }
        }

        const data = await res.json()

        return data
    }

    const filterReferrals = (referral) =>{
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

    if(redirect === true){
        logout(history);
        return (
       <></>
        )
    }else{
        return(
            <div className="itemsList">
                <div className="listHeader">
                    <h2>{t("yourReferrals")}</h2>
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

                {referrals.map((referral) =>(
                    <Referral key={referral.id} referral={referral} setSelectedReferral={setSelectedReferral} t={t}/>
                ))}
                <Pagination className="my-3" count={count} page={page} siblingCount={1} boundaryCount={1} shape="rounded" onChange={handlePageChange}/>
            </div>
        )
    }
}

export default ReferralList