import Navigation from "./components/fragments/Navigation";
import Footer from "./components/fragments/Footer";
import HomePage from "./components/patient/HomePage";
import UploadNewFile from "./components/patientFiles/UploadNewFile";
import AppointmentList from "./components/appointment/AppointmentList";
import NewAppointment from "./components/appointment/NewAppointment";
import ReferralList from "./components/referral/ReferralList";
import ScheduleForm from "./components/schedule/ScheduleForm";
import CheckUpList from "./components/checkup/CheckUpList";
import PrescriptionList from "./components/prescription/PrescriptionList";

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";


function App() {
  return (
      <Router>
          <div>
              <Navigation/>
              <div className="wholePage">
                  <div className="content">
                      <Switch>
                          <Route exact path="/moje-konto" component={HomePage}/>
                          <Route exact path="/moje-pliki"  component={UploadNewFile}/>
                          <Route exact path="/wizyty" component={AppointmentList}/>
                          <Route exact path="/nowa-wizyta" component={NewAppointment}/>
                          <Route exact path="/skierowania" component={ReferralList}/>
                          <Route exact path="/grafik" component={ScheduleForm}/>
                          <Route exact path="/badania" component={CheckUpList}/>
                          <Route exact path="/recepty" component={PrescriptionList}/>
                      </Switch>
                  </div>
              </div>
              <Footer/>
          </div>
      </Router>
  );
}

export default App;
