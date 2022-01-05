import React from "react";
import errorImage from '../../img/404.png';

const NotFound = ({t}) =>(
    <div className="loginForm" style={{marginTop:"10%", marginBottom:"27%"}}>
        <img style={{width: "100%"}} src={errorImage} alt={"404 not found"}/>
        <h1 style={{display: "flex", justifyContent: "center"}}>{t("notFound")}</h1>
    </div>
);

export default NotFound;