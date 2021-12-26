import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Footer from "./components/fragments/Footer";
import TodayAppointmentList from "./components/appointment/doctor/TodayAppointmentList";
import DoctorNavigation from "./components/fragments/doctor/DoctorNavigation";
import AppointmentDetails from "./components/appointment/doctor/AppointmentDetails";
import VisitsHistoryList from "./components/appointment/doctor/visitsHistory/VisitsHistoryList";
import CheckUpList from "./components/checkup/CheckUpList";
import FilesTable from "./components/appointment/doctor/files/FilesTable";
import DoctorCheckUpList from "./components/checkup/doctor/DoctorCheckUpList";
import {useTranslation} from "react-i18next";

function DoctorApp() {
    const {t, i18n} = useTranslation()

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    }

    return (
        <Router>
            <div>
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
                <Footer t={t}/>
            </div>
        </Router>
    );
}
export default DoctorApp;