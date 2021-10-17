import React, {useState, useEffect} from "react";
import Medication from "../medication/Medication";

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
        const res = await fetch('http://localhost:5000/prescriptions')
        const data = await res.json()
        let medicines = [];

        data.map((prescription) =>{
            prescription.medicines.map((med)=>{
                if(med.medicine.extandable === true){
                    const medicine = {
                        ...med,
                        dateFrom : prescription.dateFrom,
                        doctor : prescription.doctor.person.firstName + ' ' + prescription.doctor.person.lastName
                    };
                    medicines.push(medicine);
                }
            })
        })
        return medicines;
    }


    return(
        <main>
            <div className="listHeader">
                <h2>Odnowienie recepty</h2>
                <button type="button" className="btn btn-outline-primary btn-rounded waves-effect">ODNÓW RECEPTĘ</button>
            </div>
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
        </main>
    )
}

export default PrescriptionRenewal;