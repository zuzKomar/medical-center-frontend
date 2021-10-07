import React from "react";
import {NavLink} from 'react-router-dom'

function Navigation(){
    return(
        <nav>
            <ul className="nav">
                <li><NavLink to="/moje_konto" style={{textDecoration:"none"}}>MOJE KONTO</NavLink> </li>
                <li><NavLink to="/wizyty" style={{textDecoration:"none"}}>WIZYTY</NavLink> </li>
                <li><NavLink to="/skierowania" style={{textDecoration:"none"}}>SKIEROWANIA</NavLink></li>
                <li><NavLink to="/grafik-lekarzy" style={{textDecoration:"none"}}>GRAFIK LEKARZY</NavLink></li>
                <li><NavLink to="/badania" style={{textDecoration:"none"}}>BADANIA</NavLink></li>
                <li><NavLink to="/recepty" style={{textDecoration:"none"}}>RECEPTY</NavLink></li>
            </ul>
        </nav>
    )
}

export default Navigation;