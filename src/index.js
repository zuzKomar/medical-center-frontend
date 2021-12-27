import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import './i18n'
import DoctorApp from "./DoctorApp";

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
        {/*<App />*/}
        <DoctorApp/>
        {/*<LoginApp/>*/}
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);

