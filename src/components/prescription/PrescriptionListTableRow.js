import React from "react";

const PrescriptionListTableRow = ({prescription, t}) =>{
    return(
        <tr key={prescription.id}>
            <td>{prescription.creationDate}</td>
            <td>
                {(prescription.medications ?
                    <ul>
                    {prescription.medications.map((medicine)=>(
                        <li key={medicine.id}>{medicine.name}</li>
                    ))}
                    </ul> : '')}
            </td>
            <td>
                {(prescription.medications ?
                    <ul>
                    {prescription.medications.map((medicine)=>(
                        <li key={medicine.id}>{medicine.numberOfPackages}</li>
                    ))}
                    </ul> : '')}
            </td>
            <td>{t("issued")}</td>
            <td>{prescription.accessCode}</td>
            <td>{prescription.doctorFirstName + ' ' + prescription.doctorLastName}</td>
            <td>{prescription.doctorPwz}</td>
        </tr>
    )
}
export default PrescriptionListTableRow;
