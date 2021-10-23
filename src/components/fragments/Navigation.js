import React from "react";
import logo from '../../logo.png';
import {Navbar, Nav, NavDropdown, Container} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap'


function Navigation(){
    return(
            <Navbar bg="light" variant="light" expand="lg" collapseOnSelect="true" sticky="top" className="navContainer">
                <Container fluid>
                    <Navbar.Brand className="navbar-brand"><img src={logo} /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav" className="navCollapse">
                        <Nav className="navNav">
                            <LinkContainer to="/moje-konto" activeHref="active">
                                <Nav.Link exact className="navItemLink">Moje konto</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/wizyty" activeHref="active">
                                <Nav.Link exact className="navItemLink">Wizyty</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/skierowania" activeHref="active">
                                <Nav.Link  exact className="navItemLink">Skierowania</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/grafik" activeHref="active">
                                <Nav.Link  exact className="navItemLink">Grafik lekarzy</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/badania" activeHref="active">
                                <Nav.Link  exact className="navItemLink">Badania</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/recepty" activeHref="active">
                                <Nav.Link exact className="navItemLink">Recepty</Nav.Link>
                            </LinkContainer>
                        </Nav>
                        <NavDropdown className="navItemLanguages" title="Język" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#angielski" >Angielski</NavDropdown.Item>
                            <NavDropdown.Item href="#polski">Polski</NavDropdown.Item>
                        </NavDropdown>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
    )
}

export default Navigation;