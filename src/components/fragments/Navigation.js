import React from "react";
import logo from '../../logo.png';
import {Navbar, Nav, NavDropdown, Container} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap'
import {BsPerson} from 'react-icons/bs'
import {Link} from "react-router-dom";

function Navigation({changeLanguage, t}){
    const profileTitle = (<BsPerson size={46}/>);
    return(
            <Navbar bg="light" variant="light" expand="lg" collapseOnSelect="true" sticky="top" className="navContainer">
                <Container fluid>
                    <Navbar.Brand className="navbar-brand"><img alt="Portal pacjenta" src={logo}/></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="navbarToggleExternalContent" className="navCollapse">
                        <Nav className="navNav" activeKey={window.location.pathname}>
                            <LinkContainer exact to="/wizyty" >
                                <Nav.Link as={Link} className="navItemLink" >{t("appointments")}</Nav.Link>
                            </LinkContainer>
                            <LinkContainer exact to="/skierowania" >
                                <Nav.Link as={Link} className="navItemLink" >{t("referrals")}</Nav.Link>
                            </LinkContainer>
                            <LinkContainer exact to="/grafik" >
                                <Nav.Link as={Link} className="navItemLink" >{t("schedules")}</Nav.Link>
                            </LinkContainer>
                            <LinkContainer exact to="/badania" >
                                <Nav.Link as={Link} className="navItemLink" >{t("checkups")}</Nav.Link>
                            </LinkContainer>
                            <LinkContainer exact to="/recepty" >
                                <Nav.Link as={Link} className="navItemLink" >{t("prescriptions")}</Nav.Link>
                            </LinkContainer>
                        </Nav>
                        <NavDropdown className="navItemLanguages" title={profileTitle} id="basic-nav-dropdown">
                            <LinkContainer exact to="/moje-konto">
                                <Nav.Link as={Link} className="navItemLink2">{t("myAccount")}</Nav.Link>
                            </LinkContainer>
                            <LinkContainer exact to="/moje-pliki">
                                <Nav.Link as={Link} className="navItemLink2">{t("myFiles")}</Nav.Link>
                            </LinkContainer>

                            <NavDropdown title={t("language")} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => {changeLanguage('en')}}>English</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => {changeLanguage('pl')}}>Polski</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#wyloguj">{t("logout")}</NavDropdown.Item>
                        </NavDropdown>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
    )
}

export default Navigation;