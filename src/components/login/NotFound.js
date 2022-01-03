import React from "react";
import errorImage from '../../404.png';

const NotFound = () =>(
    <div className="loginForm" style={{marginTop:"10%", marginBottom:"27%"}}>
        <img style={{width: "100%"}} src={errorImage} alt={"404 not found"}/>
        <h1 style={{display: "flex", justifyContent: "center"}}>Sorry, this page could not be found.</h1>
    </div>
);

export default NotFound;