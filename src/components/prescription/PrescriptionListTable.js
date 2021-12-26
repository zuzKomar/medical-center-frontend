import React from "react";
import PrescriptionListTableRow from "./PrescriptionListTableRow";

function PrescriptionListTable({prescriptionData, t}){


    return(
        <table className="table table-hover" style={{backgroundColor:"white", width : '90%'}}>
            <thead>
                <tr>
                    <th>{t("issueDate")}</th>
                    <th>{t("medications")}</th>
                    <th>{t("numberOfPackages")}</th>
                    <th>{t("status")}</th>
                    <th>{t("eReceiptCode")}</th>
                </tr>
            </thead>
            <tbody>
            {prescriptionData.map((prescription) =>
                <PrescriptionListTableRow prescription={prescription} key={prescription.id}/>
            )}
            </tbody>
        </table>
    )
}

export default PrescriptionListTable;