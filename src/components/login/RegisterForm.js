import React from "react";
import {Formik} from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useHistory} from 'react-router';
import {baseUrl} from "../../config/config";

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
    country: yup.string().required('Field required!'),
    password: yup.string().min(2, 'Password should have min. 2 characters!').max(50, 'Password should have max. 50 characters!').required('Field required!'),
    confirmPassword: yup.string().oneOf([yup.ref('password'), ''], 'Password must match!').required('Field required!')
});

const RegisterForm = () => {
    const history = useHistory();

    const onSubmit = values =>{
        const newPerson = {
            address : {
                city : values.city,
                country : values.country,
                postCode : values.postCode,
                street : values.street,
                streetNumber : values.streetNumber
            },
            birthDate : values.birthDate,
            email : values.email,
            firstName : values.firstName,
            lastName : values.lastName,
            patientsFiles: [],
            pesel : values.pesel,
            phoneNumber : values.phoneNumber
        };

        fetch(`${baseUrl}/patients`,{
            method : 'POST',
            headers : {'Access-Control-Allow-Origin': `${baseUrl}`,
                'Content-Type': 'application/json;charset=UTF-8'},
            body : JSON.stringify(newPerson)
        }).then((res)=>res.json())
            .catch((err)=>console.log(err))
    }

    return(
        <div className="loginForm" style={{marginTop:"1%", marginBottom:"12%"}}>
            <Formik
                validationSchema={schema}
                enableReinitialize={true}
                onSubmit={onSubmit}
                initialErrors={{}}
                validateOnChange={true}
                validateOnMount={false}
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
                    country : '',
                    password: '',
                    confirmPassword: ''
                }} >
                {({
                      handleChange,
                      handleSubmit,
                      values,
                      touched,
                      isValid,
                      errors
                  })=>(
                    <Form  onSubmit={handleSubmit}>
                        <Row className="align-items-center mb-3">
                            <Col>
                                <Form.Group>
                                    <Form.Label>Imię:</Form.Label>
                                    <Form.Control type="text" name="firstName" placeholder="Imię" defaultValue={values.firstName} isInvalid={!!errors.firstName} isValid={touched.firstName && !errors.firstName} onChange={handleChange}/>
                                    <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Nazwisko:</Form.Label>
                                    <Form.Control type="text" name="lastName" placeholder="Nazwisko" defaultValue={values.lastName} isInvalid={!!errors.lastName} isValid={touched.lastName && !errors.lastName} onChange={handleChange}/>
                                    <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="align-items-center mb-3">
                            <Col>
                                <Form.Group>
                                    <Form.Label>PESEL:</Form.Label>
                                    <Form.Control type="text" name="pesel" placeholder="PESEL" defaultValue={values.pesel} isInvalid={!!errors.pesel} isValid={touched.pesel && !errors.pesel} onChange={handleChange}/>
                                    <Form.Control.Feedback type="invalid">{errors.pesel}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Data urodzenia:</Form.Label>
                                    <Form.Control type="date" name="birthDate" placeholder="Data urodzenia" defaultValue={values.birthDate} isInvalid={!!errors.birthDate} isValid={touched.birthDate && !errors.birthDate} onChange={handleChange}/>
                                    <Form.Control.Feedback type="invalid">{errors.birthDate}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="align-items-center mb-3">
                            <Col>
                                <Form.Group>
                                    <Form.Label>Telefon:</Form.Label>
                                    <Form.Control type="text" name="phoneNumber" placeholder="Telefon" defaultValue={values.phoneNumber} isInvalid={!!errors.phoneNumber} isValid={touched.phoneNumber && !errors.phoneNumber} onChange={handleChange}/>
                                    <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control type="email" name="email" placeholder="Email" defaultValue={values.email} isInvalid={!!errors.email} isValid={touched.email && !errors.email} onChange={handleChange}/>
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="align-items-center mb-3">
                            <Col>
                                <Form.Group>
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control type="password" name="password" placeholder="Password" defaultValue={values.password} isInvalid={!!errors.password} isValid={touched.password && !errors.password} onChange={handleChange}/>
                                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Confirm Password:</Form.Label>
                                    <Form.Control type="password" name="confirmPassword" placeholder="Confirm Password" defaultValue={values.confirmPassword} isInvalid={!!errors.confirmPassword} isValid={touched.confirmPassword && !errors.confirmPassword} onChange={handleChange}/>
                                    <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <br/>
                        <Row className="align-items-center mb-3">
                            <Col>
                                <Form.Group>
                                    <Form.Label>Ulica:</Form.Label>
                                    <Form.Control type="text" name="street" placeholder="Ulica" defaultValue={values.street} isInvalid={!!errors.street} isValid={touched.street && !errors.street} onChange={handleChange}/>
                                    <Form.Control.Feedback type="invalid">{errors.street}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Numer:</Form.Label>
                                    <Form.Control type="text" name="streetNumber" placeholder="Numer" defaultValue={values.streetNumber} isInvalid={!!errors.streetNumber} isValid={touched.streetNumber && !errors.streetNumber} onChange={handleChange}/>
                                    <Form.Control.Feedback type="invalid">{errors.streetNumber}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="align-items-center mb-3">
                            <Col>
                                <Form.Group>
                                    <Form.Label>Miasto:</Form.Label>
                                    <Form.Control type="text" name="city" placeholder="Miasto" defaultValue={values.city} isInvalid={!!errors.city} isValid={touched.city && !errors.city} onChange={handleChange}/>
                                    <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Kod pocztowy:</Form.Label>
                                    <Form.Control type="text" name="postCode" placeholder="Kod pocztowy" defaultValue={values.postCode} isInvalid={!!errors.postCode} isValid={touched.postCode && !errors.postCode} onChange={handleChange}/>
                                    <Form.Control.Feedback type="invalid">{errors.postCode}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="align-items-center mb-3">
                            <Col>
                                <Form.Group>
                                    <Form.Label>Państwo:</Form.Label>
                                    <Form.Control type="text" name="country" placeholder="Państwo" defaultValue={values.country} isInvalid={!!errors.country} isValid={touched.country && !errors.country} onChange={handleChange}/>
                                    <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group/>
                            </Col>
                        </Row>
                         <div>
                             Already have an account?&nbsp;
                             <Button variant="primary" size="sm" onClick={()=>{
                                 history.push({
                                     pathname : '/logowanie'
                                })
                             }}>Login</Button>
                         </div>
                         <hr/>
                        <div style={{display:"flex", justifyContent: 'center'}}>
                            <Button variant="primary" size="lg" type="submit" disabled={!isValid}>Register</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default RegisterForm;