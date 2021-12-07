import React, {useState, useEffect} from "react";
import Medication from "../medication/Medication";
import {baseUrl} from "../../config/config";

const PrescriptionRenewal = () =>{

    const [medicines, setMedicines] = useState([]);

    useEffect(() =>{
        const getMedicines = async () => {
            const medicines = await fetchPrescriptions()
            setMedicines(medicines)
        }

        getMedicines()
    },[])



    const fetchPrescriptions = async () =>{
        const res = await fetch(`${baseUrl}/patients/1/prescriptions`)
        const data = await res.json()
        let medicines = [];

        data.map((prescription) =>{
            prescription.medications.map((med)=>{
                if(med.extendable === true){
                    const medicine = {
                        ...med,
                        creationDate : prescription.creationDate,
                        doctor : prescription.doctorFirstName + ' ' + prescription.doctorLastName
                    };
                    medicines.push(medicine);
                }
            })
        })
        return medicines;
    }


    return(
        <div className="itemsList">
            <div className="listHeader">
                <h2>Odnowienie recepty</h2>
                <button type="button" className="actionButton">ODNÓW RECEPTĘ</button>
            </div>
            <div className="prescriptionRenewal">
                <h4>Wybierz leki</h4>
                <h5>Poniżej znajdują się leki, które możesz zamówić online</h5>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Zamów</th>
                        <th>Nazwa leku</th>
                        <th>Ilość</th>
                        <th>Data ostatniego przepisania</th>
                        <th>Pracownik medyczny</th>
                    </tr>
                    </thead>
                    <tbody>
                    {medicines.map((medicine)=>
                        <Medication medication={medicine} key={medicine.id}/>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PrescriptionRenewal;