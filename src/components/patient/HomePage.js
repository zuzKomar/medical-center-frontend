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

    if(!data) {
        return null;
    }else{

        return(
            <main>
                <div>
                    <form className="form">
                        <div>
                            <label htmlFor="firstName">Imię</label>
                            <input type="text" name="firstName" defaultValue={data.firstName} />
                        </div>

                        <div>
                            <label htmlFor="lastName">Nazwisko</label>
                            <input type="text" name="lastName" defaultValue={data.lastName} />
                        </div>

                        <div>
                            <label htmlFor="pesel">Pesel</label>
                            <input type="text" name="pesel" defaultValue={data.pesel} />
                        </div>

                        <div>
                            <label htmlFor="birthdate">Data urodzenia</label>
                            <input type="text" name="birthdate" defaultValue={data.birthDate} />
                        </div>

                        <div>
                            <label htmlFor="phone">Numer telefonu</label>
                            <input type="text" name="phone" defaultValue={(data.patient) ? data.patient.phone : ''} />

                        </div>

                        <div>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" defaultValue={data.email} />
                        </div>

                        <div>
                            <label htmlFor="country">Państwo</label>
                            <input type="text" name="country" defaultValue={(data.patient) ? data.patient.address.country : ''} />
                        </div>

                        <div>
                            <label htmlFor="city">Miasto</label>
                            <input type="text" name="city" defaultValue={(data.patient) ? data.patient.address.city : ''} />
                        </div>

                        <div>
                            <label htmlFor="street">Ulica</label>
                            <input type="text" name="street" defaultValue={(data.patient) ? (data.patient.address.street + ' ' +data.patient.address.streetNumber) : ''} />
                        </div>
                    </form>
                </div>
            </main>
        )
    }
}

export default HomePage;