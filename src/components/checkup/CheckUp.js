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
                    <p className="appointmentAndCheckupHeader">{checkup.diagnosticTestName}</p>
                    <div className="data">
                        {/*<p>Data:</p>*/}
                        {/*<p>{new Date(checkup.appointment.date).toISOString().slice(0,10)}</p>*/}
                        {/*<p>{new Date(checkup.appointment.date).toISOString().slice(11,16)}</p>*/}
                    </div>
                </div>
                <div>
                    <FaRegUser size={42}/>
                    Pracownik medyczny
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