import React from "react";
import {Formik} from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useHistory} from 'react-router';
import {baseUrl} from "../../config/config";

const RegisterForm = ({t}) => {

    const schema = yup.object().shape({
        email: yup.string().email(t("emailError")).required(t("required")),
        password: yup.string().min(2, t("passwordMinCharactersError")).max(50, t("passwordMaxCharactersError")).required(t("required")),
        confirmPassword: yup.string().oneOf([yup.ref('password'), ''], t("passwordMatch")).required(t("required"))
    });

    const history = useHistory();

    const onSubmit = values =>{
        const newPerson = {
            email : values.email,
            password : values.password
        };

        fetch(`${baseUrl}/users/add`,{
            method : 'POST',
            headers : {'Access-Control-Allow-Origin': `${baseUrl}`,
                'Content-Type': 'application/json;charset=UTF-8'},
            body : JSON.stringify(newPerson)
        }).then((res)=>res.json())
            .catch((err)=>console.log(err))
    }

    return(
        <div className="loginForm" style={{marginTop:"15%", marginBottom:"27%"}}>
            <Formik
                validationSchema={schema}
                enableReinitialize={true}
                onSubmit={onSubmit}
                initialErrors={{}}
                validateOnMount={false}
                initialValues={{
                    email : '',
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
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control type="email" name="email" placeholder="Email" defaultValue={values.email} isInvalid={!!errors.email} isValid={touched.email && !errors.email} onChange={handleChange}/>
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col/>
                        </Row>
                        <Row className="align-items-center mb-3">
                            <Col>
                                <Form.Group>
                                    <Form.Label>{t("password")}:</Form.Label>
                                    <Form.Control type="password" name="password" placeholder={t("password")} defaultValue={values.password} isInvalid={!!errors.password} isValid={touched.password && !errors.password} onChange={handleChange}/>
                                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>{t("confirmPassword")}:</Form.Label>
                                    <Form.Control type="password" name="confirmPassword" placeholder={t("confirmPassword")} defaultValue={values.confirmPassword} isInvalid={!!errors.confirmPassword} isValid={touched.confirmPassword && !errors.confirmPassword} onChange={handleChange}/>
                                    <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                         <div>
                             {t("alreadyHaveAnAccount")}?&nbsp;
                             <Button variant="primary" size="sm" onClick={()=>{
                                 history.push({
                                     pathname : '/logowanie'
                                })
                             }}>Login</Button>
                         </div>
                         <hr/>
                        <div style={{display:"flex", justifyContent: 'center'}}>
                            <Button variant="primary" size="lg" type="submit" disabled={!isValid}>{t("register")}</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default RegisterForm;