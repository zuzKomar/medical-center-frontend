import React from "react";
import PrescriptionListTableRow from "./PrescriptionListTableRow";

function PrescriptionListTable({prescriptionData}){


    return(
        <table className="table table-hover" style={{backgroundColor:"white", width : '90%'}}>
            <thead>
                <tr>
                    <th>Data złożenia</th>
                    <th>Leki</th>
                    <th>Ilość opakowań</th>
                    <th>Status recepty</th>
                    <th>Kod e-Recepty</th>
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