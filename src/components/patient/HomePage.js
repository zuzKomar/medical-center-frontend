import React, {useState, useEffect} from "react";
import {Col, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Formik} from "formik";
import * as yup from "yup";

const schema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    pesel: yup.string().required(),
    birthDate: yup.date().required(),
    phoneNumber: yup.string().required(),
    email: yup.string().required(),
    street: yup.string().required(),
    streetNumber: yup.string().required(),
    city: yup.string().required(),
    postCode: yup.string().required(),
    country: yup.string().required()
});

const HomePage = () => {

    const [data, setPatient] = useState([]);
    const [firstName, setFirstName] = useState(undefined);
    const [lastName, setLastName] = useState(undefined);
    const [pesel, setPesel] = useState(undefined);
    const [birthDate, setBirthDate] = useState(undefined);
    const [phoneNumber, setPhone] = useState(undefined);
    const [email, setEmail] = useState(undefined);
    const [patientsFiles, setPatientFiles] = useState(undefined);

    const [street, setStreet] = useState(undefined);
    const [streetNumber, setStreetNumber] = useState(undefined);
    const [city, setCity] = useState(undefined);
    const [postCode, setPostCode] = useState(undefined);
    const [country, setCountry] = useState(undefined);


    useEffect(() => {
        const getPatient = async () =>{
            const patient = await fetchPatient()
            setPatient(patient);
        }

        getPatient()
    }, [])

    useEffect(()=>{
        if(data !== undefined){
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setPesel(data.pesel);
            setBirthDate(data.birthDate);
            setPhone(data.phoneNumber);
            setEmail(data.email);
            setPatientFiles(data.patientsFiles);
            data.address ? setStreet(data.address.street) : setStreet(undefined);
            data.address ? setStreetNumber(data.address.streetNumber) : setStreetNumber(undefined);
            data.address ? setCity(data.address.city) : setCity(undefined);
            data.address ? setPostCode(data.address.postCode) : setPostCode(undefined);
            data.address ? setCountry(data.address.country) : setCountry(undefined);
        }
    },[data])

    const fetchPatient = async () => {
        const res = await fetch('http://localhost:8080/patients/1')
        const data = await res.json()

        return data
    }

    function handleSubmit(){
        const newObj = {
            "id": 1,
            address: {
                street,
                streetNumber,
                postCode,
                city,
                country
            },
            phoneNumber,
            firstName,
            lastName,
            email,
            birthDate,
            pesel,
            patientsFiles,
            };

        fetch('http://localhost:8080/patients',{
            method: 'PUT',
            headers: {'Access-Control-Allow-Origin': 'http://localhost:8080',
                'Content-Type': 'application/json;charset=UTF-8'},
            body: JSON.stringify(newObj)
        }).then((res)=>res.json())
            .catch((err)=>console.log(err));
        console.log(firstName);
    }

    if(!data) {
        return null;
    }else{
        return(
                <div className="itemsList">
                    <div className="listHeader">
                        <h2>Twoje dane</h2>
                    </div>
                    <Formik validationSchema={schema}
                            enableReinitialize
                            onSubmit={(e)=>handleSubmit(e)}
                            initialValues={{
                        firstName : firstName,
                        lastName : lastName,
                        pesel : pesel,
                        birthDate : birthDate,
                        phoneNumber : phoneNumber,
                        email : email,
                        street : street,
                        streetNumber : streetNumber,
                        city: city,
                        postCode : postCode,
                        country : country
                    }} >
                        {({
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            values,
                            touched,
                            isValid,
                            errors
                        })=>(
                            <Form className="newAppointmentForm" onSubmit={handleSubmit} noValidate>
                                <Row className="align-items-center mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Imię:</Form.Label>
                                            <Form.Control type="text" name="firstName" placeholder="Imię" size="lg" defaultValue={values.firstName} isValid={touched.firstName && !errors.firstName} onChange={(e)=>{setFirstName(e.target.value)}}/>
                                            <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Nazwisko:</Form.Label>
                                            <Form.Control type="text" name="lastName" placeholder="Nazwisko" size="lg" defaultValue={values.lastName} isValid={touched.lastName && !errors.lastName} onChange={(e)=>{setLastName(e.target.value)}}/>
                                            <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="align-items-center mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Pesel:</Form.Label>
                                            <Form.Control type="text" name="pesel" placeholder="PESEL" size="lg" defaultValue={values.pesel} isValid={touched.pesel && !errors.pesel} onChange={(e)=>setPesel(e.target.value)}/>
                                            <Form.Control.Feedback type="invalid">{errors.pesel}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Data urodzenia:</Form.Label>
                                            <Form.Control type="date" name="birthDate" placeholder="Data urodzenia" size="lg" defaultValue={values.birthDate} isValid={touched.birthDate && !errors.birthDate} onChange={(e)=>setBirthDate(e.target.value)}/>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="align-items-center mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Telefon:</Form.Label>
                                            <Form.Control type="text" name="phoneNumber "placeholder="Telefon" size="lg" defaultValue={values.phoneNumber} isValid={touched.phoneNumber && !errors.phoneNumber} onChange={(e)=>setPhone(e.target.value)}/>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Email:</Form.Label>
                                            <Form.Control type="email" name="email" placeholder="Email" size="lg" defaultValue={values.email} isValid={touched.email && !errors.email} onChange={(e)=>setEmail(e.target.value)}/>
                                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <br/>
                                <Row className="align-items-center mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Ulica:</Form.Label>
                                            <Form.Control type="text" name="street "placeholder="Ulica" size="lg" defaultValue={values.street} isValid={touched.street && !errors.street} onChange={(e)=>setStreet(e.target.value)}/>
                                            <Form.Control.Feedback type="invalid">{errors.street}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Numer:</Form.Label>
                                            <Form.Control type="text" name="streetNumber" placeholder="Numer" size="lg" defaultValue={values.streetNumber} isValid={touched.streetNumber && !errors.streetNumber} onChange={(e)=>setStreetNumber(e.target.value)}/>
                                            <Form.Control.Feedback type="invalid">{errors.streetNumber}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="align-items-center mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Miasto:</Form.Label>
                                            <Form.Control type="text" name="city" placeholder="Miasto" size="lg" defaultValue={values.city} isValid={touched.city && !errors.city} onChange={(e)=>setCity(e.target.value)}/>
                                            <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Kod pocztowy:</Form.Label>
                                            <Form.Control type="text" name="postCode" placeholder="Kod pocztowy" size="lg" defaultValue={values.postCode} isValid={touched.postCode && !errors.postCode} onChange={(e)=>setPostCode(e.target.value)}/>
                                            <Form.Control.Feedback type="invalid">{errors.postCode}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="align-items-center mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Państwo:</Form.Label>
                                            <Form.Control type="text" name="country" placeholder="Państwo" size="lg"defaultValue={values.country} isValid={touched.country && !errors.country} onChange={(e)=>setCountry(e.target.value)}/>
                                            <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group/>
                                    </Col>
                                </Row>
                                <div style={{display:"flex", justifyContent: 'center'}}>
                                    <Button variant="primary" size="lg" type="submit">Edytuj</Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
        )
    }
}

export default HomePage;