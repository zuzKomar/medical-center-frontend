import React, {useState, useEffect} from "react";

const HomePage = () => {

    const [data, setPatient] = useState([]);

    useEffect(() => {
        const getPatient = async () =>{
            const patient = await fetchPatient()
            setPatient(patient)
        }

        getPatient()
    }, [])

    const fetchPatient = async () => {
        const res = await fetch('http://localhost:5000/patients/1')
        const data = await res.json()

        console.log("lala")
        console.log(data)
        return data
    }

    return(
        <main style={{width:"70%"}}>
            <div>
                <form className="form">

                    <label htmlFor="firstName">Imię</label>
                    <input type="text" name="firstName" defaultValue={data.firstName} />

                    <label htmlFor="lastName">Nazwisko</label>
                    <input type="text" name="lastName" defaultValue={data.lastName} />

                    <label htmlFor="pesel">Pesel</label>
                    <input type="text" name="pesel" defaultValue={data.pesel} />

                    <label htmlFor="birthdate">Data urodzenia</label>
                    <input type="text" name="birthdate" defaultValue={data.birthDate} />

                    <label htmlFor="phone">Numer telefonu</label>
                    <input type="text" name="phone" defaultValue={data.patient.phone} />

                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" defaultValue={data.email} />

                    <label htmlFor="country">Państwo</label>
                    <input type="text" name="country" defaultValue={data.patient.address.country} />

                    <label htmlFor="city">Miasto</label>
                    <input type="text" name="city" defaultValue={data.patient.address.city} />

                    <label htmlFor="street">Ulica</label>
                    <input type="text" name="street" defaultValue={data.patient.address.street + ' ' +data.patient.address.streetNumber} />
                </form>
            </div>
        </main>
    )

}

export default HomePage;