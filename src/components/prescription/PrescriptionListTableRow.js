import React from "react";

const PrescriptionListTableRow = ({prescription}) =>{

    return(
        <tr key={prescription.id}>
            <td>{prescription.dateFrom}</td>
            <td>
                {(prescription.medicines ?
                    <ul>
                    {prescription.medicines.map((medicine)=>(
                        <li key={medicine.id}>{medicine.medicine.name}</li>
                    ))}
                    </ul> : '')}
            </td>
            <td>
                {(prescription.medicines ?
                    <ul>
                    {prescription.medicines.map((medicine)=>(
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
