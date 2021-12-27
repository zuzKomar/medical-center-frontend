import React, {useState, useEffect} from "react";
import {Col, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Formik} from "formik";
import * as yup from "yup";
import {baseUrl} from "../../config/config";

const  today = new Date();

const schema = yup.object().shape({
    firstName: yup.string().min(2, 'Imię powinno zawierać min. 2 znaki').max(50, 'Imię powinno zawierać maks. 50 znaków').required('Pole wymagane!'),
    lastName: yup.string().min(2, 'Nazwisko powinno zawierać min. 2 znaki').max(50, 'Nazwisko powinno zawierać maks. 50 znaków').required('Pole wymagane!'),
    pesel: yup.string().min(11, 'Pesel powinien zawierać 11 cyfr').max(11, 'Pesel powinien zawierać 11 cyfr')
        .test('test-name', 'Nieprawidłowy numer pesel',
            function validatePesel(pesel) {
                let reg = /^[0-9]{11}$/;
                if(reg.test(pesel) === false)
                    return false;
                else
                {
                    let digits = (""+pesel).split("");
                    if ((parseInt(pesel.substring( 4, 6)) > 31)||(parseInt(pesel.substring( 2, 4)) > 12))
                        return false;

                    let checksum = (1*parseInt(digits[0]) + 3*parseInt(digits[1]) + 7*parseInt(digits[2]) + 9*parseInt(digits[3]) + 1*parseInt(digits[4]) + 3*parseInt(digits[5]) + 7*parseInt(digits[6]) + 9*parseInt(digits[7]) + 1*parseInt(digits[8]) + 3*parseInt(digits[9]))%10;
                    if(checksum === 0)
                        checksum = 10;
                    checksum = 10 - checksum;

                    return (parseInt(digits[10]) === checksum);
                }
            }).required('Pole jest wymagane'),
    birthDate: yup.date().max(today, 'Data nie może być późniejsza niż data dzisiejsza').required('Pole wymagane!'),
    phoneNumber: yup.string().min(9, 'Numer telefonu powinien miec min. 9 cyfr').required('Pole wymagane!'),
    email: yup.string().email('Nieprawidłowy adres email').required('Pole wymagane!'),
    street: yup.string().min(2).required('Pole wymagane!'),
    streetNumber: yup.string().required('Pole wymagane!'),
    city: yup.string().required('Pole wymagane!'),
    postCode: yup.string().required('Pole wymagane!'),
    country: yup.string().required('Pole wymagane!')
});

const PatientData = () => {

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
        const res = await fetch(`${baseUrl}/patients/1`)
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

        fetch(`${baseUrl}/patients`,{
            method: 'PUT',
            headers: {'Access-Control-Allow-Origin': `${baseUrl}`,
                'Content-Type': 'application/json;charset=UTF-8'},
            body: JSON.stringify(newObj)
        }).then((res)=>res.json())
            .catch((err)=>console.log(err));
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
                            enableReinitialize={true}
                            onSubmit={handleSubmit}
                            initialErrors={{}}
                            validateOnChange={true}
                            validateOnMount={true}
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
                            handleChange,
                            handleSubmit,
                            values,
                            touched,
                            isValid,
                            errors
                        })=>(
                            <Form className="newAppointmentForm" onSubmit={handleSubmit}>
                                <Row className="align-items-center mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Imię:</Form.Label>
                                            <Form.Control type="text" name="firstName" placeholder="Imię" size="lg" defaultValue={values.firstName} isInvalid={!!errors.firstName} isValid={touched.firstName && !errors.firstName} onChange={(e)=>setFirstName(e.target.value)}/>
                                            <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Nazwisko:</Form.Label>
                                            <Form.Control type="text" name="lastName" placeholder="Nazwisko" size="lg"  defaultValue={values.lastName} isInvalid={!!errors.lastName} isValid={touched.lastName && !errors.lastName} onChange={(e)=>setLastName(e.target.value)}/>
                                            <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="align-items-center mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>PESEL:</Form.Label>
                                            <Form.Control type="text" name="pesel" placeholder="PESEL" size="lg" defaultValue={values.pesel} isInvalid={!!errors.pesel} isValid={touched.pesel && !errors.pesel} onChange={(e)=>setPesel(e.target.value)}/>
                                            <Form.Control.Feedback type="invalid">{errors.pesel}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Data urodzenia:</Form.Label>
                                            <Form.Control type="date" name="birthDate" placeholder="Data urodzenia" size="lg" defaultValue={values.birthDate} isInvalid={!!errors.birthDate} isValid={touched.birthDate && !errors.birthDate} onChange={(e)=>setBirthDate(e.target.value)}/>
                                            <Form.Control.Feedback type="invalid">{errors.birthDate}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="align-items-center mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Telefon:</Form.Label>
                                            <Form.Control type="text" name="phoneNumber" placeholder="Telefon" size="lg" defaultValue={values.phoneNumber} isInvalid={!!errors.phoneNumber} isValid={touched.phoneNumber && !errors.phoneNumber} onChange={(e)=>setPhone(e.target.value)}/>
                                            <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Email:</Form.Label>
                                            <Form.Control type="email" name="email" placeholder="Email" size="lg" defaultValue={values.email} isInvalid={!!errors.email} isValid={touched.email && !errors.email} onChange={(e)=>setEmail(e.target.value)}/>
                                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <br/>
                                <Row className="align-items-center mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Ulica:</Form.Label>
                                            <Form.Control type="text" name="street" placeholder="Ulica" size="lg" defaultValue={values.street} isInvalid={!!errors.street} isValid={touched.street && !errors.street} onChange={(e)=>setStreet(e.target.value)}/>
                                            <Form.Control.Feedback type="invalid">{errors.street}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Numer:</Form.Label>
                                            <Form.Control type="text" name="streetNumber" placeholder="Numer" size="lg" defaultValue={values.streetNumber} isInvalid={!!errors.streetNumber} isValid={touched.streetNumber && !errors.streetNumber} onChange={(e)=>setStreetNumber(e.target.value)}/>
                                            <Form.Control.Feedback type="invalid">{errors.streetNumber}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="align-items-center mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Miasto:</Form.Label>
                                            <Form.Control type="text" name="city" placeholder="Miasto" size="lg" defaultValue={values.city} isInvalid={!!errors.city} isValid={touched.city && !errors.city} onChange={(e)=>setCity(e.target.value)}/>
                                            <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Kod pocztowy:</Form.Label>
                                            <Form.Control type="text" name="postCode" placeholder="Kod pocztowy" size="lg" defaultValue={values.postCode} isInvalid={!!errors.postCode} isValid={touched.postCode && !errors.postCode} onChange={(e)=>setPostCode(e.target.value)}/>
                                            <Form.Control.Feedback type="invalid">{errors.postCode}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="align-items-center mb-3">
                                    <Col>
                                        <Form.Group>
                                            <Form.Label>Państwo:</Form.Label>
                                            <Form.Control type="text" name="country" placeholder="Państwo" size="lg" defaultValue={values.country} isInvalid={!!errors.country} isValid={touched.country && !errors.country} onChange={(e)=>setCountry(e.target.value)}/>
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

export default PatientData;