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
import RegisterForm from "./components/login/RegisterForm";
import NotFound from "./components/login/NotFound";
import TodayAppointmentList from "./components/appointment/doctor/TodayAppointmentList";
import DoctorNavigation from "./components/fragments/doctor/DoctorNavigation";
import AppointmentDetails from "./components/appointment/doctor/AppointmentDetails";
import VisitsHistoryList from "./components/appointment/doctor/visitsHistory/VisitsHistoryList";
import FilesTable from "./components/appointment/doctor/files/FilesTable";
import DoctorCheckUpList from "./components/checkup/doctor/DoctorCheckUpList";
import background from '../src/stetoscope.jpg';
import {useTranslation} from "react-i18next";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";


const App = () =>{
    const patient = 'PATIENT';
    const doctor = 'DOCTOR';
    const [logged, setLogged] = useState(()=>{
        const savedState = JSON.parse(sessionStorage.getItem('logged'));
        return savedState || false;
    });

    const [role, setRole] = useState(()=>{
        const savedRole = JSON.parse(sessionStorage.getItem('role'));
        return savedRole || undefined;
    })

    const {t, i18n} = useTranslation()

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    }

  return (
      <Router>
              <div>
                  {(logged===true && role === patient) &&
                    <Navigation changeLanguage={changeLanguage} t={t} setLogged={setLogged}/>}
                  {(logged===true && role === doctor) &&
                    <DoctorNavigation changeLanguage={changeLanguage} t={t} setLogged={setLogged}/>
                  }
                  <div className="wholePage">
                      <div className="content" style={logged !== true ? {width: '100%', backgroundImage : `url(${background})`}: {width: '80%', backgroundImage: null}}>
                          <Switch>
                              {logged === false &&
                                  <>
                                      <Route exact path="/logowanie" component={() => <LoginForm t={t} changeLanguage={changeLanguage} setLogged={setLogged} setRole={setRole}/>}/>
                                      <Route exact path="/rejestracja" component={() => <RegisterForm t={t} changeLanguage={changeLanguage}/>}/>
                                      {/*<Route  component={NotFound}/>*/}
                                  </>
                              }
                              {role === patient &&
                              <>
                                  <Route exact path="/moje-konto" component={() => <PatientData t={t} />} />
                                  <Route exact path="/moje-pliki"  component={() => <UploadNewFile t={t} />}/>
                                  <Route exact path="/wizyty" component={() => <AppointmentList t={t} />}/>
                                  <Route exact path="/nowa-wizyta" component={() => <NewAppointment t={t} />}/>
                                  <Route exact path="/skierowania" component={() => <ReferralList t={t} />}/>
                                  <Route exact path="/grafik" component={() => <ScheduleForm t={t} />}/>
                                  <Route exact path="/badania" component={() => <CheckUpList t={t} />}/>
                                  <Route exact path="/recepty" component={() => <PrescriptionList t={t} />}/>
                                  {/*<Route component={NotFound}/>*/}
                              </>
                              }
                              {role === doctor &&
                              <>
                                  <Route exact path="/today-visits" component={() => <TodayAppointmentList t={t} />}/>
                                  <Route exact path="/today-visits/:id/details" component={() => <AppointmentDetails t={t} />} />
                                  <Route exact path="/today-visits/:id/details/visits-history" component={() => <VisitsHistoryList t={t} />} />
                                  <Route exact path="/today-visits/:id/details/check-ups" component={() => <CheckUpList t={t} />} />
                                  <Route exact path="/today-visits/:id/details/files" component={() => <FilesTable t={t} />} />
                                  <Route exact path="/check-ups" component={() => <DoctorCheckUpList t={t} />} />
                                  {/*<Route path='*' component={NotFound}/>*/}
                              </>
                              }
                          </Switch>
                      </div>
                  </div>
                  <Footer t={t}/>
              </div>
      </Router>
  );
}

export default App;
