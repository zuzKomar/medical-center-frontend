import React from "react";
import {FaRegUser, FaCheck, FaFile, FaShare} from 'react-icons/fa'

class CheckUp extends React.Component{
    constructor(props) {
        super(props);

        this.state={
            open : false
        }

    }
    togglePanel(){
        this.setState({open : !this.state.open})
    }

    render() {
        const checkup = this.props.checkup;
        return(
            <div className="appointmentAndCheckup" onClick={(e)=> this.togglePanel(e)}>
                <div className="top">
                    <p className="appointmentAndCheckupHeader">{(checkup.checkup ? checkup.checkup.name : '')}</p>
                    <div className="data">
                        <p>Data:</p>
                        <p>{(checkup.appointment ? checkup.appointment.date : '')}</p>
                        <p>{(checkup.appointment ? checkup.appointment.time : '')}</p>
                    </div>
                </div>
                <div>
                    <FaRegUser size={42}/>
                    lek.med. {(checkup.appointment ? (checkup.appointment.doctor.person.firstName + ' ' + checkup.appointment.doctor.person.lastName) : '')}
                </div>

                {this.state.open ? (
                    <div>
                        <hr/>

                        <div className="subsections">
                            <FaCheck size={42}/>
                            <p className="header">Wynik</p>
                        </div>
                        <ol>
                            <li>{checkup.result}</li>
                        </ol>
                        <hr/>

                        <div className="subsections">
                            <FaFile size={42}/>
                            <p className="header">Pobierz wynik PDF</p>
                        </div>
                        <hr/>

                        <div className="subsections">
                            <FaShare size={42}/>
                            <p className="header">Komentarz lekarza</p>
                        </div>
                        <div className="subsections">
                            <p>{checkup.description}</p>
                        </div>
                    </div>) : null}
            </div>);
    }
}

export default CheckUp;