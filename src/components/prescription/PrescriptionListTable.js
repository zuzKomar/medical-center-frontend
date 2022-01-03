import React from "react";
import PrescriptionListTableRow from "./PrescriptionListTableRow";

const PrescriptionListTable = ({prescriptionData, t}) =>{

    return(
        <table className="table table-hover fileTable" style={{backgroundColor:"white", width : '90%'}}>
            <thead>
                <tr>
                    <th>{t("issueDate")}</th>
                    <th>{t("medications")}</th>
                    <th>{t("numberOfPackages")}</th>
                    <th>{t("status")}</th>
                    <th>{t("eReceiptCode")}</th>
                    <th>{t("doctor")}</th>
                    <th>PWZ:</th>
                </tr>
            </thead>
            <tbody>
            {prescriptionData.map((prescription) =>
                <PrescriptionListTableRow t={t} prescription={prescription} key={prescription.id}/>
            )}
            </tbody>
        </table>
    )
}

export default PrescriptionListTable;