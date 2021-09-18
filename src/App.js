import Navigation from "./components/fragments/Navigation";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";


function App() {
  return (
      <Router>
          <div>
              <h1>Medical app</h1>
              <Navigation/>
          </div>
      </Router>
  );
}

export default App;
