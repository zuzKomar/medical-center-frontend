import {Button, Form} from "react-bootstrap";
import React, {useState}from "react";
import {useHistory} from 'react-router';
import {baseUrl} from "../../config/config";
import LanguageChanger from "./LanguageChanger";

const CheckPeselForm = ({t, changeLanguage}) =>{
    const history = useHistory();
    const [correctPesel, setCorrectPesel] = useState(false);
    const [pesel, setPesel] = useState(undefined);
    const [errors, setErrors] = useState({});

    const findFormErrors = () =>{
        const newErrors = {};
        let reg = /^[0-9]{11}$/;

        if(pesel === undefined || pesel === ''){
            newErrors.pesel = t("peselRequired")
        }else{
            if(reg.test(pesel) === false){
                newErrors.pesel = t("peselCharacterError")
            }else{
                let digits = (""+pesel).split("");
                if ((parseInt(pesel.substring( 4, 6)) > 31)||(parseInt(pesel.substring( 2, 4)) > 12)){
                    newErrors.pesel = t("invalidPeselError")
                }
                let checksum = (1*parseInt(digits[0]) + 3*parseInt(digits[1]) + 7*parseInt(digits[2]) + 9*parseInt(digits[3]) + 1*parseInt(digits[4]) + 3*parseInt(digits[5]) + 7*parseInt(digits[6]) + 9*parseInt(digits[7]) + 1*parseInt(digits[8]) + 3*parseInt(digits[9]))%10;
                if(checksum === 0)
                    checksum = 10;
                checksum = 10 - checksum;

                if(!(parseInt(digits[10]) === checksum)){
                    newErrors.pesel = t("invalidPeselError")
                }
            }
        }
        return newErrors;
    }

    const handlePeselCheck = (e) =>{
        e.preventDefault();

        const errors = findFormErrors();
        if(Object.keys(errors).length > 0){
            setErrors(errors);
        }else{
            fetch(`${baseUrl}/patients/1/prescriptions`)
                .then(()=>{
                    window.alert(t("userWithPeselFound"))
                    setCorrectPesel(true);
                }).catch(()=>{
                window.alert(t("userWithPeselNotFound"))
            })
        }
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        history.push({
            pathname : '/rejestracja'
        })
    }

    return (
        <div className="loginForm" style={{marginTop:"17%", marginBottom:"27%"}}>
            <LanguageChanger changeLanguage={changeLanguage} t={t} />
            <Form>
                <Form.Group controlId="pesel" >
                    <Form.Label>Pesel:</Form.Label>
                    <Form.Control as="input" type="text" isInvalid={!!errors.pesel} onChange={(e)=>{
                        setPesel(e.target.value);
                        if(!!errors['pesel'])
                            setErrors({
                                ...errors,
                                ['pesel']:null
                            })
                    }}/>
                    <Form.Control.Feedback type='invalid'>{errors.pesel}</Form.Control.Feedback>
                </Form.Group>
                <br/>
                    <div>
                        {t("checkPesel")}&nbsp;
                        <Button variant="primary" size="sm"  onClick={(e)=>handlePeselCheck(e)}>{t("checkPeselButton")}</Button>
                    </div>
                    <hr/>
                    <div style={{display: 'flex',justifyContent: 'center'}}>
                        <Button style={{fontSize:"20px"}} variant="primary" disabled={!correctPesel} onClick={(e)=>handleSubmit(e)}>{t("finishRegister")}</Button>
                    </div>
            </Form>
        </div>
    )
}

export default CheckPeselForm;