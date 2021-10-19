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
        const res = await fetch('http://localhost:8080/patients/1')
        const data = await res.json()

        return data
    }

    if(!data) {
        return null;
    }else{

        return(
            <main>
                <div>
                    <div className="listHeader">
                        <h2>Twoje dane</h2>
                    </div>
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
                            <input type="text" name="phone" defaultValue={data.phoneNumber} />

                        </div>

                        <div>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" defaultValue={data.email} />
                        </div>

                        <div>
                            <label htmlFor="country">Państwo</label>
                            <input type="text" name="country" defaultValue={data.address.country} />
                        </div>

                        <div>
                            <label htmlFor="city">Miasto</label>
                            <input type="text" name="city" defaultValue={data.address.city} />
                        </div>

                        <div>
                            <label htmlFor="street">Ulica</label>
                            <input type="text" name="street" defaultValue={data.address.street + ' ' +data.address.streetNumber} />
                        </div>
                    </form>
                </div>
            </main>
        )
    }
}

export default HomePage;