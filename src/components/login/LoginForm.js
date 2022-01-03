import {Button, Col, Form, Row} from "react-bootstrap";
import {Formik} from 'formik';
import * as yup from "yup";
import React from "react";
import {useHistory} from 'react-router';
import LanguageChanger from "./LanguageChanger";
import {baseUrl} from "../../config/config";
import jwtDecode from "jwt-decode";

const LoginForm = ({t, changeLanguage, setLogged, setRole}) => {
    const patient = 'PATIENT';
    const doctor = 'DOCTOR';
    const history = useHistory();
    const onSubmit = values =>{

        fetch(`${baseUrl}/login`,{
            method : 'POST',
            headers : {'Access-Control-Allow-Origin': `${baseUrl}`,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body : new URLSearchParams({
                'userEmail' : values.email,
                'password' : values.password
            }),
        })
            .then(res=>res.json())
            .then((res)=>{
                sessionStorage.setItem('logged', 'true');
                sessionStorage.setItem('token', JSON.stringify(res.access_token));
                sessionStorage.setItem('id', JSON.stringify(res.user_id));
                sessionStorage.setItem('logged', 'true');
                setLogged(true);
                let decoded = jwtDecode(res.access_token);
                setRole(decoded.role);
                sessionStorage.setItem('role', JSON.stringify(decoded.role));

                if(decoded.role === patient){
                    history.push({
                        pathname : '/wizyty'})
                }else if(decoded.role === doctor){
                    history.push({
                        pathname : '/today-visits'})
                }
            })
            .catch(err=>console.log(err))
    }

    const schema = yup.object().shape({
        email: yup.string().email(t("emailError")).required(t("required")),
        password: yup.string().required(t("required"))
    });

    return (
        <div className="loginForm" style={{marginTop:"17%", marginBottom:"27%"}}>
            <LanguageChanger changeLanguage={changeLanguage} t={t}/>
            <Formik
                validationSchema={schema}
                onSubmit={onSubmit}
                initialErrors={{}}
                validateOnChange={true}
                validateOnMount={false}
                initialValues={{
                    email: '',
                    password: '',
                }}>
                {({
                      handleSubmit,
                      handleChange,
                      values,
                      touched,
                      isValid,
                      errors
                  }) => (
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} xs={12} md={6} controlId="email">
                                <Form.Label>E-mail:</Form.Label>
                                <Form.Control type="email" name="email" placeholder={t("enterEmail")} defaultValue={values.email} isInvalid={!!errors.email} isValid={touched.email && !errors.email} onChange={handleChange} />
                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} xs={12} md={6} controlId="password">
                                <Form.Label>{t("password")}:</Form.Label>
                                <Form.Control type="password" name="password" placeholder={t("enterPassword")} defaultValue={values.password} isInvalid={!!errors.password} isValid={touched.password && !errors.password} onChange={handleChange}/>
                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <div>
                            {t("newUser")}?&nbsp;
                            <Button variant="primary" size="sm" onClick={()=>{
                                history.push({
                                    pathname : '/rejestracja'
                                })
                            }}>{t("createAccount")}</Button>
                        </div>
                        <hr/>
                        <div style={{display: 'flex',justifyContent: 'center'}}>
                            <Button style={{fontSize:"20px"}} variant="primary" type="submit" disabled={!isValid}>{t("login")}</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default LoginForm;