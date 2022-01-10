import React, {useState, useEffect} from "react";
import {useHistory} from 'react-router';
import {Col, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Formik} from "formik";
import * as yup from "yup";
import {baseUrl} from "../../config/config";

const  today = new Date();

const PatientData = ({t, logout, setLogged}) => {
    const history = useHistory();
    const [redirect, setRedirect] = useState(false);
    const [userId, setUserId] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('id'));
        return saved || undefined;
    });
    const [userToken, setUserToken] = useState(()=>{
        const saved = JSON.parse(sessionStorage.getItem('token'));
        return saved || undefined;
    });

    const schema = yup.object().shape({
        firstName: yup.string().min(2, t("firstNameMinCharacter")).max(50, t("firstNameMaxCharacter")).required(t("required")),
        lastName: yup.string().min(2, t("lastNameMinCharacter")).max(50, t("lastNameMaxCharacter")).required(t("required")),
        pesel: yup.string().min(11, t("peselCharacterError")).max(11, t("peselCharacterError"))
            .test('test-name', t("invalidPeselError"),
                function validatePesel(pesel) {
                    let reg = /^[0-9]{11}$/;
                    if (reg.test(pesel) === false)
                        return false;
                    else {
                        let digits = ("" + pesel).split("");
                        if ((parseInt(pesel.substring(4, 6)) > 31) || (parseInt(pesel.substring(2, 4)) > 12))
                            return false;

                        let checksum = (1 * parseInt(digits[0]) + 3 * parseInt(digits[1]) + 7 * parseInt(digits[2])
                                        + 9 * parseInt(digits[3]) + 1 * parseInt(digits[4]) + 3 * parseInt(digits[5])
                                        + 7 * parseInt(digits[6]) + 9 * parseInt(digits[7]) + 1 * parseInt(digits[8])
                                        + 3 * parseInt(digits[9])) % 10;
                        if (checksum === 0)
                            checksum = 10;
                        checksum = 10 - checksum;

                        return (parseInt(digits[10]) === checksum);
                    }
                }).required(t("required")),
        birthDate: yup.date().max(today, t("dateFromFutureError")).required(t("required")),
        phoneNumber: yup.string().min(9, t("phoneNumberError")).required(t("required")),
        email: yup.string().email(t("emailError")).required(t("required")),
        password: yup.string().min(6, t("passwordMinCharactersError")).max(50, t("passwordMaxCharactersError")),
        confirmPassword: yup.string().oneOf([yup.ref('password'), ''], t("passwordMatch")),
        street: yup.string().min(2).required(t("required")),
        streetNumber: yup.string().required(t("required")),
        city: yup.string().required(t("required")),
        postCode: yup.string().required(t("required")).matches(/[0-9]{2}-[0-9]{3}/, t("postCodeError")),
        country: yup.string().required(t("required"))
    });

    const [data, setPatient] = useState([]);
    const [firstName, setFirstName] = useState(undefined);
    const [lastName, setLastName] = useState(undefined);
    const [pesel, setPesel] = useState(undefined);
    const [birthDate, setBirthDate] = useState(undefined);
    const [phoneNumber, setPhone] = useState(undefined);
    const [email, setEmail] = useState(undefined);
    const [emailChange, setEmailChange] = useState(false);
    const [password, setPassword] = useState(undefined);
    const [confirmPassword, setConfirmPassword] = useState(undefined);
    const [patientsFiles, setPatientFiles] = useState(undefined);

    const [street, setStreet] = useState(undefined);
    const [streetNumber, setStreetNumber] = useState(undefined);
    const [city, setCity] = useState(undefined);
    const [postCode, setPostCode] = useState(undefined);
    const [country, setCountry] = useState(undefined);

    useEffect(() => {
        let controller = new AbortController();

        (async () =>{
            try{
                const patient = await fetchPatient()
                setPatient(patient);
                controller = null;
            }catch (e){
                console.log(e)
                setRedirect(true);
            }
        })();
        return () => controller?.abort();

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
        const res = await fetch(`${baseUrl}/patients/${userId}`,{
            headers: {'Authorization' : `Bearer ${userToken}`}
        })
        if(res.status === 403){
            setRedirect(true);
        }
        const data = await res.json()

        return data
    }

    function handleSubmit(){
        const newObj = {
            "id": userId,
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
            birthDate,
            pesel,
            patientsFiles
        };

        fetch(`${baseUrl}/patients`,{
            method: 'PUT',
            headers: {
                'Authorization' : `Bearer ${userToken}`,
                'Access-Control-Allow-Origin': `${baseUrl}`,
                'Content-Type': 'application/json;charset=UTF-8',
                },
            body: JSON.stringify(newObj)
        }).then((res)=>{
            if(res.status === 403){
                window.alert(t("peselIsUsed"));
                logout(history);
                throw new Error(t("peselIsUsed"))
            }
            res.json()
        }).catch((err)=>console.log(err));


        if(emailChange === true && (password === undefined || password === '')){
            window.alert(t("emailAndPasswordRequired"))
        }
        if(password !== undefined && password !== ''){
            let newAuthObj = {}
            newAuthObj['password'] = password;
            if(emailChange === true){
                newAuthObj['email'] = email;
            }

            fetch(`${baseUrl}/users/${userId}/changeCredentials`,{
                method: 'PATCH',
                headers : {
                    'Authorization' : `Bearer ${userToken}`,
                    'Access-Control-Allow-Origin': `${baseUrl}`,
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                body : JSON.stringify(newAuthObj)
            }).then((res)=>{
                if(res.status === 403){
                    window.alert(t("emailIsUsed"));
                    logout(history);
                    throw new Error(t("emailIsUsed"))
                }
            }).then(()=>{
              if(emailChange === true){
                  window.alert(t("emailChangeLogout"));
                  history.push('/login');
                  sessionStorage.clear();
                  sessionStorage.setItem('logged', 'false');
                  setLogged(false);
              }
            }).catch(err=>console.log(err))
        }
    }

    if(redirect === true) {
        logout(history);
        return (
            <></>
        )
    }else{
        return(
            <div className="itemsList">
                <div className="listHeader">
                    <h2>{t('myData')}</h2>
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
                            password : password,
                            confirmPassword : confirmPassword,
                            street : street,
                            streetNumber : streetNumber,
                            city: city,
                            postCode : postCode,
                            country : country
                        }} >
                    {({
                          handleSubmit,
                          values,
                          touched,
                          errors
                      })=>(
                        <Form className="newAppointmentForm" onSubmit={handleSubmit}>
                            <Row className="align-items-center mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label>{t("firstName")}</Form.Label>
                                        <Form.Control type="text" name="firstName" placeholder={t("firstName")} size="lg" defaultValue={values.firstName} isInvalid={!!errors.firstName} isValid={touched.firstName && !errors.firstName} onChange={(e)=>setFirstName(e.target.value)}/>
                                        <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>{t("lastName")}</Form.Label>
                                        <Form.Control type="text" name="lastName" placeholder={t("lastName")} size="lg"  defaultValue={values.lastName} isInvalid={!!errors.lastName} isValid={touched.lastName && !errors.lastName} onChange={(e)=>setLastName(e.target.value)}/>
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
                                        <Form.Label>{t("birthDate")}</Form.Label>
                                        <Form.Control type="date" name="birthDate" placeholder={t("birthDate")} size="lg" defaultValue={values.birthDate} isInvalid={!!errors.birthDate} isValid={touched.birthDate && !errors.birthDate} onChange={(e)=>setBirthDate(e.target.value)}/>
                                        <Form.Control.Feedback type="invalid">{errors.birthDate}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="align-items-center mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label>{t("phoneNumber")}</Form.Label>
                                        <Form.Control type="text" name="phoneNumber" placeholder={t("phoneNumber")} size="lg" defaultValue={values.phoneNumber} isInvalid={!!errors.phoneNumber} isValid={touched.phoneNumber && !errors.phoneNumber} onChange={(e)=>setPhone(e.target.value)}/>
                                        <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Email:</Form.Label>
                                        <Form.Control type="email" name="email" placeholder="Email" size="lg" defaultValue={values.email} isInvalid={!!errors.email} isValid={touched.email && !errors.email} onChange={(e)=>{
                                            setEmail(e.target.value)
                                            setEmailChange(true);
                                        }}/>
                                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="align-items-center mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label>{t("password")}:</Form.Label>
                                        <Form.Control type="password" name="password" placeholder={t("password")} size="lg" defaultValue={values.password} isInvalid={!!errors.password} isValid={touched.password && !errors.password} onChange={(e)=>setPassword(e.target.value)}/>
                                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>{t("confirmPassword")}:</Form.Label>
                                        <Form.Control type="password" name="confirmPassword" placeholder={t("confirmPassword")} size="lg" defaultValue={values.confirmPassword} isInvalid={!!errors.confirmPassword} isValid={touched.confirmPassword && !errors.confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                                        <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <h6 style={{color: '#e60000'}}>{t("changeEmail")}</h6>
                            <br/>
                            <Row className="align-items-center mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label>{t("street")}</Form.Label>
                                        <Form.Control type="text" name="street" placeholder={t("street")} size="lg" defaultValue={values.street} isInvalid={!!errors.street} isValid={touched.street && !errors.street} onChange={(e)=>setStreet(e.target.value)}/>
                                        <Form.Control.Feedback type="invalid">{errors.street}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>{t("streetNumber")}</Form.Label>
                                        <Form.Control type="text" name="streetNumber" placeholder={t("streetNumber")} size="lg" defaultValue={values.streetNumber} isInvalid={!!errors.streetNumber} isValid={touched.streetNumber && !errors.streetNumber} onChange={(e)=>setStreetNumber(e.target.value)}/>
                                        <Form.Control.Feedback type="invalid">{errors.streetNumber}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="align-items-center mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label>{t("city")}</Form.Label>
                                        <Form.Control type="text" name="city" placeholder={t("city")} size="lg" defaultValue={values.city} isInvalid={!!errors.city} isValid={touched.city && !errors.city} onChange={(e)=>setCity(e.target.value)}/>
                                        <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>{t("postCode")}</Form.Label>
                                        <Form.Control type="text" name="postCode" placeholder={t("postCode")} size="lg" defaultValue={values.postCode} isInvalid={!!errors.postCode} isValid={touched.postCode && !errors.postCode} onChange={(e)=>setPostCode(e.target.value)}/>
                                        <Form.Control.Feedback type="invalid">{errors.postCode}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="align-items-center mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label>{t("country")}</Form.Label>
                                        <Form.Control type="text" name="country" placeholder={t("country")} size="lg" defaultValue={values.country} isInvalid={!!errors.country} isValid={touched.country && !errors.country} onChange={(e)=>setCountry(e.target.value)}/>
                                        <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group/>
                                </Col>
                            </Row>
                            <div style={{display:"flex", justifyContent: 'center'}}>
                                <Button variant="primary" size="lg" type="submit">{t("edit")}</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        )
    }
}

export default PatientData;