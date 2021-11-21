import React from "react";

const PrescriptionListTableRow = ({prescription}) =>{

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
            <td>Status</td>
            <td>{prescription.accessCode}</td>
        </tr>
    )
}

export default PrescriptionListTableRow;
