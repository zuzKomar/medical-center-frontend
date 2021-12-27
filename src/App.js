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
import {useTranslation} from "react-i18next";


function App() {
    const [logged, setLogged] = useState(false);

    const {t, i18n} = useTranslation()

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    }

  return (
      <Router>
          <div>
              <Navigation changeLanguage={changeLanguage} t={t}/>
              <div className="wholePage">
                  <div className="content" style={logged ? {width: '100%', backgroundImage : `url(${background})`}: {width: '80%', backgroundImage: null}}>
                      <Switch>
                          <Route exact path="/moje-konto" component={() => <PatientData t={t} />} />
                          <Route exact path="/moje-pliki"  component={() => <UploadNewFile t={t} />}/>
                          <Route exact path="/wizyty" component={() => <AppointmentList t={t} />}/>
                          <Route exact path="/nowa-wizyta" component={() => <NewAppointment t={t} />}/>
                          <Route exact path="/skierowania" component={() => <ReferralList t={t} />}/>
                          <Route exact path="/grafik" component={() => <ScheduleForm t={t} />}/>
                          <Route exact path="/badania" component={() => <CheckUpList t={t} />}/>
                          <Route exact path="/recepty" component={() => <PrescriptionList t={t} />}/>
                          <Route exact path="/logowanie" component={LoginForm}/>
                          <Route exact path="/rejestracja" component={RegisterForm}/>
                      </Switch>
                  </div>
              </div>
              <Footer t={t}/>
          </div>
      </Router>
  );
}

export default App;
