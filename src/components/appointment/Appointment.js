import React from "react";
import {FaRegUser, FaCheck, FaFile} from 'react-icons/fa'
import {GiMedicines} from 'react-icons/gi'
import {withRouter} from "react-router-dom";


class Appointment extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            open : false,
            appointment : this.props.appointment
        }

        this.togglePanel = this.togglePanel.bind(this);
    }

    togglePanel(){
        this.setState({open : !this.state.open})
    }


    render() {
        const app = this.state.appointment;
        return(
            <div className={new Date(app.date) <= Date.now() ? 'appointmentAndCheckup archivalApp' : 'appointmentAndCheckup incomingApp'} onClick={this.togglePanel}>
                <div className="top">
                    <p className="appointmentAndCheckupHeader">{(app.service ? (app.service.name) : '')}</p>
                    <div className="data">
                        <p>Data:</p>
                        <p>{app.date ? new Date(app.date).toISOString().slice(0,10) : ''}</p>
                        <p>{app.date ? new Date(app.date).toISOString().slice(11,16) : ''}</p>
                    </div>
                </div>
                <div>
                    <FaRegUser size={42}/>
                    lek.med. {(app.doctor? (app.doctor.firstName + ' ' + app.doctor.lastName) : '')}
                </div>

                {this.state.open ? (
                    <div>
                        <hr/>

                        <div className="subsections">
                            <FaCheck size={42}/>
                            <p className="header">Zalecenia</p>
                        </div>
                        <ol>
                            <li>{app.description}</li>
                        </ol>
                        <hr/>

                        <div className="subsections">
                            <FaFile size={42}/>
                            <p className="header">Zrealizowane badania</p>
                        </div>
                        <p>{(app.service ? (app.service.name) : 'Brak badań zrealizowanych podczas wizyty')}</p>
                        <hr/>

                        <div className="subsections">
                            <GiMedicines size={42}/>
                            <p className="header">e-Recepty</p>
                        </div>
                        <p>Brak recept wystawionych na tej wizycie</p>

                    </div>) : null}
            </div>);
    }
}

export default withRouter(Appointment);