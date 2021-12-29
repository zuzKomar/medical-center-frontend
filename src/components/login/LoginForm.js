import {Button, Col, Form, Row} from "react-bootstrap";
import {Formik} from 'formik';
import * as yup from "yup";
import React from "react";
import {useHistory} from 'react-router';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email address!').required('Field required!'),
    password: yup.string().required('Field required!')
});

const LoginForm = ({t}) => {
    const history = useHistory();

    //TODO add login logic
    const onSubmit = values =>{
        console.log(values);
    }

    return (
        <div className="loginForm" style={{marginTop:"17%", marginBottom:"27%"}}>
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
                                    pathname : '/sprawdzPesel'
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