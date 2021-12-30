import React, {useState} from "react";
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
import CheckPeselForm from "./components/login/CheckPeselForm";
import RegisterForm from "./components/login/RegisterForm";
import TodayAppointmentList from "./components/appointment/doctor/TodayAppointmentList";
import DoctorNavigation from "./components/fragments/doctor/DoctorNavigation";
import AppointmentDetails from "./components/appointment/doctor/AppointmentDetails";
import VisitsHistoryList from "./components/appointment/doctor/visitsHistory/VisitsHistoryList";
import FilesTable from "./components/appointment/doctor/files/FilesTable";
import DoctorCheckUpList from "./components/checkup/doctor/DoctorCheckUpList";

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import background from '../src/stetoscope.jpg';
import {useTranslation} from "react-i18next";


const App = () =>{
    const [logged, setLogged] = useState(true);
    const [patientMode, setPatientMode] = useState(true);

    const {t, i18n} = useTranslation()

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    }

    const handleClick = () =>{
        setPatientMode(!patientMode);
    }

  return (
      <Router>
          {patientMode &&
              <div>
                  <button onClick={()=>handleClick()}>Switch to doctor's view</button>
                  {logged &&
                  <Navigation changeLanguage={changeLanguage} t={t}/>}
                  <div className="wholePage">
                      <div className="content" style={logged===false ? {width: '100%', backgroundImage : `url(${background})`}: {width: '80%', backgroundImage: null}}>
                          <Switch>
                              <Route exact path="/moje-konto" component={() => <PatientData t={t} />} />
                              <Route exact path="/moje-pliki"  component={() => <UploadNewFile t={t} />}/>
                              <Route exact path="/wizyty" component={() => <AppointmentList t={t} />}/>
                              <Route exact path="/nowa-wizyta" component={() => <NewAppointment t={t} />}/>
                              <Route exact path="/skierowania" component={() => <ReferralList t={t} />}/>
                              <Route exact path="/grafik" component={() => <ScheduleForm t={t} />}/>
                              <Route exact path="/badania" component={() => <CheckUpList t={t} />}/>
                              <Route exact path="/recepty" component={() => <PrescriptionList t={t} />}/>
                              <Route exact path="/logowanie" component={() => <LoginForm t={t} />}/>
                              <Route exact path="/sprawdzPesel" component={() => <CheckPeselForm t={t}/>}/>
                              <Route exact path="/rejestracja" component={() => <RegisterForm t={t}/>}/>
                          </Switch>
                      </div>
                  </div>
                  <Footer t={t}/>
              </div>
          }
          {!patientMode &&
              <div>
                  <button onClick={()=>handleClick()}>Switch to patient's view</button>
                  <DoctorNavigation changeLanguage={changeLanguage} t={t}/>
                  <div className="wholePage">
                      <div className="content">
                          <Switch>
                              <Route exact path="/today-visits" component={() => <TodayAppointmentList t={t} />}/>
                              <Route exact path="/today-visits/:id/details" component={() => <AppointmentDetails t={t} />} />
                              <Route exact path="/today-visits/:id/details/visits-history" component={() => <VisitsHistoryList t={t} />} />
                              <Route exact path="/today-visits/:id/details/check-ups" component={() => <CheckUpList t={t} />} />
                              <Route exact path="/today-visits/:id/details/files" component={() => <FilesTable t={t} />} />
                              <Route exact path="/check-ups" component={() => <DoctorCheckUpList t={t} />} />
                          </Switch>
                      </div>
                  </div>
                  <Footer t={t}/>
              </div>
          }
      </Router>
  );
}

export default App;
