import React from "react";
import {Link} from 'react-router-dom'

function Navigation(){
    return(
        <nav>
            <ul>
                <li><Link to="/">Moje konto</Link> </li>
                <li><Link to="/wizyty">Wizyty</Link> </li>
                <li><Link to="/skierowania">Skierowania</Link></li>
                <li><Link to="/moje_konto">Grafik lekarzy</Link></li>
                <li><Link to="/badania">Badania</Link></li>
                <li><Link to="/recepty">Recepty</Link></li>
            </ul>
        </nav>
    )
}

export default Navigation