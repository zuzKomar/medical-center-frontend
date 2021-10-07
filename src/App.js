import Navigation from "./components/fragments/Navigation";
import ReferralList from "./components/referral/ReferralList";
import HomePage from "./components/patient/HomePage";
import AppointmentList from "./components/appointment/AppointmentList";

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import CheckUpList from "./components/checkup/CheckUpList";



function App() {
  return (
      <Router>
          <div>
              <h1>Medical app</h1>
              <Navigation/>
              <Switch>
                  <Route exact path="/moje_konto" component={HomePage}/>
                  <Route exact path="/wizyty" component={AppointmentList}/>
                  <Route exact path="/skierowania" component={ReferralList}/>

                  <Route exact path="/badania" component={CheckUpList}/>
              </Switch>
          </div>
      </Router>
  );
}

export default App;
