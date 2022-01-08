import React from "react";
import {useHistory} from "react-router-dom";

const AppointmentDetailsButtonPanel = ({appointment, t}) => {
    let history = useHistory();
    const visitButton = 'visitButton';
    const checkUpButton = 'checkUpButton';
    const backButton = 'backButton';

    const handleClick = e => {
        e.preventDefault();

        const button = e.target.id;
        if (button === visitButton) {
            history.push({
                pathname: `/today-visits/${appointment.id}/details/visits-history`,
                state: appointment
            })
        }
        else if (button === checkUpButton) {
            history.push({
                pathname: `/today-visits/${appointment.id}/details/check-ups`,
                state:  appointment
            })
        }
        else if (button === backButton) {
            history.push({
                pathname: `/today-visits/${appointment.id}/details`,
                state: appointment
            })
        }
        else {
            history.push({
                pathname: `/today-visits/${appointment.id}/details/files`,
                state: appointment
            })
        }
    }

    return (
        <div className="topBuffer" style={{display: 'flex' ,justifyContent: 'space-between', width:'60%'}}>
            {(window.location.href.indexOf('visits-history') > -1 || window.location.href.indexOf('check-ups') > -1 || window.location.href.indexOf('details/files') > -1) &&  <button id="backButton" className="actionButton" onClick={handleClick}>{t("backToDetailsButton")}</button>}
            {window.location.href.indexOf('visits-history') < 0 && <button id="visitButton" className="actionButton" onClick={handleClick}>{t("visitsHistoryButton")}</button> }
            {window.location.href.indexOf('check-ups') < 0 && <button id="checkUpButton" className="actionButton" onClick={handleClick}>{t("checkUpsButton")}</button> }
            {window.location.href.indexOf('details/files') < 0 && <button id="filesButton" className="actionButton" onClick={handleClick}>{t("patientFilesButton")}</button> }
        </div>
    )
}

export default AppointmentDetailsButtonPanel;