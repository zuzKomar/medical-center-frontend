import React from 'react'

const Medication = ({medication}) =>{

    return(
        <tr key={medication.id}>
            <td><input className="form-check-input" type="checkbox" id={medication.id}/></td>
            <td>{medication.medicine.name}</td>
            <td>{medication.numberOfPackages}</td>
            <td>{medication.dateFrom}</td>
            <td>{medication.doctor}</td>
        </tr>
    )
}

export default Medication;