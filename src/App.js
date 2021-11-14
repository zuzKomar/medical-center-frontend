import Navigation from "./components/fragments/Navigation";
import ReferralList from "./components/referral/ReferralList";
import HomePage from "./components/patient/HomePage";
import AppointmentList from "./components/appointment/AppointmentList";
import NewAppointment from "./components/appointment/NewAppointment";
import CheckUpList from "./components/checkup/CheckUpList";
import PrescriptionList from "./components/prescription/PrescriptionList";

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import PrescriptionRenewal from "./components/prescription/PrescriptionRenewal";
import Footer from "./components/fragments/Footer";


function App() {
  return (
      <Router>
              <Navigation/>
              <div className="content">
                  <Switch>
                      <Route exact path="/moje-konto" component={HomePage}/>
                      <Route exact path="/wizyty" component={AppointmentList}/>
                      <Route exact path="/nowa-wizyta" component={NewAppointment}/>
                      <Route exact path="/skierowania" component={ReferralList}/>
                      <Route exact path="/badania" component={CheckUpList}/>
                      <Route exact path="/recepty" component={PrescriptionList}/>
                      <Route exact path="/nowa-recepta" component={PrescriptionRenewal}/>
                  </Switch>
              </div>
          <Footer/>
      </Router>
  );
}

export default App;
