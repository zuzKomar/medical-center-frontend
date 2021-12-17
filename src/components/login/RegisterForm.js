import React, {useState, useEffect} from "react";
import {Formik} from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";

const  today = new Date();

const schema = yup.object().shape({
    firstName: yup.string().min(2, 'First name should have min. 2 characters!').max(50, 'First name should have max. 50 characters!').required('Field required!'),
    lastName: yup.string().min(2, 'Last name should have min. 2 characters!').max(50, 'Last name should have max. 50 characters!').required('Field required!'),
    pesel: yup.string().min(11, 'Pesel should have 11 digits!').max(11, 'Pesel should have 11 digits!')
        .test('validatePesel', 'Invalid pesel!',
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
            }).required('Field required!'),
    birthDate: yup.date().max(today, 'Date cannot be from the future!').required('Field required!'),
    phoneNumber: yup.string().min(9, 'Phone number should have min. 9 digits!').required('Field required!'),
    email: yup.string().email('Invalid email address!').required('Field required!'),
    street: yup.string().min(2).required('Field required!'),
    streetNumber: yup.string().required('Field required!'),
    city: yup.string().required('Field required!'),
    postCode: yup.string().required('Field required!'),
    country: yup.string().required('Field required!')
});

const RegisterForm = () => {
    const [firstName, setFirstName] = useState(undefined);
    const [lastName, setLastName] = useState(undefined);
    const [pesel, setPesel] = useState(undefined);
    const [birthDate, setBirthDate] = useState(undefined);
    const [phoneNumber, setPhone] = useState(undefined);
    const [email, setEmail] = useState(undefined);
    const [street, setStreet] = useState(undefined);
    const [streetNumber, setStreetNumber] = useState(undefined);
    const [city, setCity] = useState(undefined);
    const [postCode, setPostCode] = useState(undefined);
    const [country, setCountry] = useState(undefined);

    return (
        <div className="center loginForm">
            <Formik validationSchema={schema}
                    enableReinitialize={true}
                    onSubmit={console.log('test')}
                    initialErrors={{}}
                    validateOnChange={true}
                    validateOnMount={true}
                    initialValues={{
                        firstName : '',
                        lastName : '',
                        pesel : '',
                        birthDate : '',
                        phoneNumber : '',
                        email : '',
                        street : '',
                        streetNumber : '',
                        city: '',
                        postCode : '',
                        country : ''
                    }} >
                {({
                      handleChange,
                      handleSubmit,
                      values,
                      touched,
                      isValid,
                      errors
                  })=>(
                    <Form noValidate onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} xs={12} md={6} controlId="firstName">
                                <Form.Label>First name:</Form.Label>
                                <Form.Control type="text" name="firstName" placeholder="First name" defaultValue={values.firstName} isInvalid={!!errors.firstName} isValid={touched.firstName && !errors.firstName} onChange={handleChange} />
                                <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} xs={12} md={6} controlId="lastName">
                                <Form.Label>Last name:</Form.Label>
                                <Form.Control type="text" name="lastName" placeholder="Enter last name" defaultValue={values.lastName} isInvalid={!!errors.lastName} isValid={touched.lastName && !errors.lastName} onChange={handleChange} />
                                <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} xs={12} md={6} controlId="pesel">
                                <Form.Label>PESEL:</Form.Label>
                                <Form.Control type="text" name="pesel" placeholder="PESEL" defaultValue={values.pesel} isInvalid={!!errors.pesel} isValid={touched.pesel && !errors.pesel} onChange={handleChange} />
                                <Form.Control.Feedback type="invalid">{errors.pesel}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} xs={12} md={6} controlId="birthDate">
                                <Form.Label>Birth date:</Form.Label>
                                <Form.Control type="date" name="birthDate" placeholder="Birth date" defaultValue={values.birthDate} isInvalid={!!errors.birthDate} isValid={touched.birthDate && !errors.birthDate} onChange={handleChange} />
                                <Form.Control.Feedback type="invalid">{errors.birthDate}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} xs={12} md={6} controlId="phoneNumber">
                                <Form.Label>Phone number:</Form.Label>
                                <Form.Control type="text" name="phoneNumber" placeholder="Phone number" defaultValue={values.phoneNumber} isInvalid={!!errors.phoneNumber} isValid={touched.phoneNumber && !errors.phoneNumber} onChange={handleChange} />
                                <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} xs={12} md={6} controlId="email">
                                <Form.Label>E-mail:</Form.Label>
                                <Form.Control type="email" name="email" placeholder="E-mail" defaultValue={values.email} isInvalid={!!errors.email} isValid={touched.email && !errors.email} onChange={handleChange} />
                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} xs={12} md={6} controlId="city">
                                <Form.Label>City:</Form.Label>
                                <Form.Control type="text" name="city" placeholder="City" defaultValue={values.city} isInvalid={!!errors.city} isValid={touched.city && !errors.city} onChange={handleChange} />
                                <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} xs={12} md={6} controlId="postCode">
                                <Form.Label>Postcode:</Form.Label>
                                <Form.Control type="text" name="postCode" placeholder="Postcode" defaultValue={values.postCode} isInvalid={!!errors.postCode} isValid={touched.postCode && !errors.postCode} onChange={handleChange} />
                                <Form.Control.Feedback type="invalid">{errors.postCode}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} xs={12} md={6} controlId="country">
                                <Form.Label>Country:</Form.Label>
                                <Form.Control type="text" name="country" placeholder="Country" defaultValue={values.country} isInvalid={!!errors.country} isValid={touched.country && !errors.country} onChange={handleChange} />
                                <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <div>
                            Already have an account?&nbsp;
                            <a href="#">
                                Login
                            </a>
                        </div>
                        <hr/>
                        <Button style={{fontSize:"20px"}} variant="primary" type="submit">Register</Button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default RegisterForm;