import React from "react";
import {FaRegUser, FaCheck, FaFile, FaShare} from 'react-icons/fa'
import {GiMedicines} from 'react-icons/gi'

class Appointment extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            open : false
        }

        this.togglePanel = this.togglePanel.bind(this);
    }

    togglePanel(){
        this.setState({open : !this.state.open})
    }

    render() {
        const app = this.props.appointment;
        return(
            <div className="appointment" onClick={(e)=> this.togglePanel(e)}>
                <div className="top">
                    <p className="appointmentHeader">Internista - konsultacja</p>
                    <div className="data">
                        <p>Data:</p>
                        <p>{app.date}</p>
                        <p>{app.time}</p>
                    </div>
                </div>
                <div>
                    <FaRegUser size={42}/>
                    lek.med. {(app.doctor? (app.doctor.person.firstName + ' ' + app.doctor.person.lastName) : '')}
                </div>

                {this.state.open ? (
                    <div>
                        <hr/>

                        <div className="recommendations">
                            <FaCheck size={42}/>
                            <p className="header">Zalecenia</p>
                        </div>
                        <ol>
                            <li>{app.recommendations}</li>
                        </ol>
                        <hr/>

                        <div className="recommendations">
                            <FaFile size={42}/>
                            <p className="header">Zrealizowane badania</p>
                        </div>
                        <p>Brak badań zrealizowanych podczas wizyty</p>
                        <hr/>

                        <div className="recommendations">
                            <FaShare size={42}/>
                            <p className="header">Skierowania</p>
                        </div>
                        <div className="recommendations">
                            <p>Internista - wizyta kontrolna</p>
                            <button>UMÓW WIZYTĘ</button>
                        </div>
                        <hr/>

                        <div className="recommendations">
                            <GiMedicines size={42}/>
                            <p className="header">e-Recepty</p>
                        </div>
                        <p>Brak recept wystawionych na tej wizycie</p>

                    </div>) : null}
            </div>);
    }
}

export default Appointment;