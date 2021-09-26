import Navigation from "./components/fragments/Navigation";
import ReferralList from "./components/referral/ReferralList";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import {useState} from 'react'
import HomePage from "./components/patient/HomePage";

function App() {
    const [referrals, setReferrals] = useState([
        {
            id:1,
            serviceId:1,
            dateFrom: '15.02.2021',
            dateTo: '14.03.2021',
            used: false,
            patient: 1,
            doctor: 'Tymoteusz Dmowski' //brak w encji
        },
        {
            id:2,
            serviceId:2,
            dateFrom: '15.02.2021',
            dateTo: '05.05.2021',
            used: true,
            patient: 1,
            doctor: 'Krzysztof Krawczyk'
        }
    ])
  return (
      <Router>
          <div>
              <h1>Medical app</h1>
              <Navigation/>
              <Switch>
                  <Route exact path="/moje_konto" component={HomePage}/>
              </Switch>
              {/*<ReferralList referrals={referrals}/>*/}
          </div>
      </Router>
  );
}

export default App;
