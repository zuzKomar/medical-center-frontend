import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DoctorApp from "./DoctorApp";

ReactDOM.render(
  <React.StrictMode>
    {/*<App />*/}
    <DoctorApp/>
  </React.StrictMode>,
  document.getElementById('root')
);

