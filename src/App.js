import React, {useState, useEffect} from "react";
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

const App = () => {
    const [app, setApp] = useState(true);

    const handleClick = () =>{
        setApp(!app);
    }

    return(
        <Router>
            {app &&
            <div>
                <button onClick={()=>handleClick()}>Change state</button>
                <Navigation/>
                <div className="wholePage">
                    <div className="content">
                        <Switch>
                            <Route exact path="/moje-konto" component={HomePage}/>
                            <Route exact path="/moje-pliki" component={UploadNewFile}/>
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
            }
            {!app &&
            <div>
                <button onClick={()=>handleClick()}>Change state</button>
                <DoctorNavigation/>
                <div className="wholePage">
                    <div className="content">
                        <Switch>
                            <Route exact path="/today-visits" component={TodayAppointmentList}/>
                            <Route exact path="/today-visits/:id/details" component={AppointmentDetails} />
                            <Route exact path="/today-visits/:id/details/visits-history" component={VisitsHistoryList} />
                            <Route exact path="/today-visits/:id/details/check-ups" component={CheckUpList} />
                            <Route exact path="/today-visits/:id/details/files" component={FilesTable} />
                            <Route exact path="/check-ups" component={DoctorCheckUpList} />
                        </Switch>
                    </div>
                </div>
                <Footer/>
            </div>
            }
        </Router>
        )
}

export default App;
