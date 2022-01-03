import React from "react";
import {Formik} from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useHistory} from 'react-router';
import {baseUrl} from "../../config/config";
import LanguageChanger from "./LanguageChanger";

const RegisterForm = ({changeLanguage, t}) => {

    const schema = yup.object().shape({
        email: yup.string().email(t("emailError")).required(t("required")),
        pesel: yup.string().min(11, t("peselCharacterError")).max(11, t("peselCharacterError"))
            // .test('validatePesel', t("invalidPeselError"),
            //     function validatePesel(pesel) {
            //         let reg = /^[0-9]{11}$/;
            //         if(reg.test(pesel) === false)
            //             return false;
            //         else
            //         {
            //             let digits = (""+pesel).split("");
            //             if ((parseInt(pesel.substring( 4, 6)) > 31)||(parseInt(pesel.substring( 2, 4)) > 12))
            //                 return false;
            //
            //             let checksum = (1*parseInt(digits[0]) + 3*parseInt(digits[1]) + 7*parseInt(digits[2]) + 9*parseInt(digits[3]) + 1*parseInt(digits[4]) + 3*parseInt(digits[5]) + 7*parseInt(digits[6]) + 9*parseInt(digits[7]) + 1*parseInt(digits[8]) + 3*parseInt(digits[9]))%10;
            //             if(checksum === 0)
            //                 checksum = 10;
            //             checksum = 10 - checksum;
            //
            //             return (parseInt(digits[10]) === checksum);
            //         }
            //     })
            .required(t("required")),
        password: yup.string().min(6, t("passwordMinCharactersError")).max(50, t("passwordMaxCharactersError")).required(t("required")),
        confirmPassword: yup.string().oneOf([yup.ref('password'), ''], t("passwordMatch")).required(t("required"))
    });

    const history = useHistory();

    const onSubmit = values =>{
        const newPerson = {
            pesel : values.pesel,
            email : values.email,
            password : values.password
        };

        fetch(`${baseUrl}/registration`,{
            method : 'POST',
            headers : {'Access-Control-Allow-Origin': `${baseUrl}`,
                'Content-Type': 'application/json;charset=UTF-8'},
            body : JSON.stringify(newPerson),
        })
            .then(res=>{
                if(!res.ok){
                    window.alert(t("userWithPeselNotFound"));
                    throw new Error(t("userWithPeselNotFound"))
                }else{
                    window.alert(t("registerSuccessful"));
                    history.push({
                        pathname:'/login'
                    })}
            })
            .catch(err=>{
                console.log(err.message)
            })
    }

    return(
        <div className="loginForm" style={{marginTop:"15%", marginBottom:"27%"}}>
            <LanguageChanger changeLanguage={changeLanguage} t={t} />
            <Formik
                validationSchema={schema}
                enableReinitialize={true}
                onSubmit={onSubmit}
                initialErrors={{}}
                validateOnMount={false}
                initialValues={{
                    email : '',
                    pesel : '',
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
                                    <Form.Label>Pesel:</Form.Label>
                                    <Form.Control type="text" name="pesel" placeholder="Pesel" defaultValue={values.email} isInvalid={!!errors.pesel} isValid={touched.pesel && !errors.pesel} onChange={handleChange}/>
                                    <Form.Control.Feedback type="invalid">{errors.pesel}</Form.Control.Feedback>
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
                                     pathname : '/login'
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