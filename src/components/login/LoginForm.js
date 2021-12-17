import {Button, Col, Form, Row} from "react-bootstrap";
import {Formik} from 'formik';
import * as yup from "yup";
import React from "react";

const schema = yup.object().shape({
    email: yup.string().email('Invalid email address!').required('Field required!'),
});

const LoginForm = () => {
    return (
        <div className="center loginForm">
            <Formik
                validationSchema={schema}
                onSubmit={console.log('test')}
                initialValues={{
                    username: "",
                    password: "",
                }}
            >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} xs={12} md={6} controlId="email">
                                <Form.Label>E-mail:</Form.Label>
                                <Form.Control type="email" name="email" placeholder="Enter email" defaultValue={values.email} isInvalid={!!errors.email} isValid={touched.email && !errors.email} onChange={handleChange} />
                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} xs={12} md={6} controlId="password">
                                <Form.Label>Password:</Form.Label>
                                <Form.Control type="password" name="password" placeholder="Enter password" />
                            </Form.Group>
                        </Row>
                        <div>
                            New user?&nbsp;
                            <a href="#">
                                Create an account
                            </a>
                        </div>
                        <hr/>
                        <Button style={{fontSize:"20px"}} variant="primary" type="submit">Login</Button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default LoginForm;