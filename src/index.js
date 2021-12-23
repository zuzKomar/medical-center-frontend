import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Test from "./Test";

import './i18n'

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
        {/*<Test />*/}
        <App />
        {/*<DoctorApp/>*/}
        {/*<LoginApp/>*/}
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);

