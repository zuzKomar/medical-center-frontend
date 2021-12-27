import Navigation from "./components/fragments/Navigation";
import Footer from "./components/fragments/Footer";
import PatientData from "./components/patient/PatientData";
import UploadNewFile from "./components/patientFiles/UploadNewFile";
import AppointmentList from "./components/appointment/AppointmentList";
import NewAppointment from "./components/appointment/NewAppointment";
import ReferralList from "./components/referral/ReferralList";
import ScheduleForm from "./components/schedule/ScheduleForm";
import CheckUpList from "./components/checkup/CheckUpList";
import PrescriptionList from "./components/prescription/PrescriptionList";
import LoginForm from "./components/login/LoginForm";
import RegisterForm from "./components/login/RegisterForm";

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import React, {useState} from "react";
import background from '../src/stetoscope.jpg';


function App() {
    const [logged, setLogged] = useState(false);

  return (
      <Router>
          <div>
              <Navigation/>
              <div className="wholePage">
                  <div className="content" style={logged ? {width: '100%', backgroundImage : `url(${background})`}: {width: '80%', backgroundImage: null}}>
                      <Switch>
                          <Route exact path="/moje-konto" component={PatientData}/>
                          <Route exact path="/moje-pliki"  component={UploadNewFile}/>
                          <Route exact path="/wizyty" component={AppointmentList}/>
                          <Route exact path="/nowa-wizyta" component={NewAppointment}/>
                          <Route exact path="/skierowania" component={ReferralList}/>
                          <Route exact path="/grafik" component={ScheduleForm}/>
                          <Route exact path="/badania" component={CheckUpList}/>
                          <Route exact path="/recepty" component={PrescriptionList}/>
                          <Route exact path="/logowanie" component={LoginForm}/>
                          <Route exact path="/rejestracja" component={RegisterForm}/>
                      </Switch>
                  </div>
              </div>
              <Footer/>
          </div>
      </Router>
  );
}

export default App;
