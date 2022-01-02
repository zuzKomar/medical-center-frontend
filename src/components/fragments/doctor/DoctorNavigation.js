import React from "react";
import logo from '../../../logo.png';
import {Navbar, Nav, NavDropdown, Container} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap'
import {BsPerson} from 'react-icons/bs'

const DoctorNavigation = ({changeLanguage, t}) =>{
    const profileTitle = (<BsPerson size={42}/>);
    return(
        <Navbar bg="light" variant="light" expand="lg" collapseOnSelect="true" sticky="top" className="navContainer">
            <Container fluid>
                <Navbar.Brand className="navbar-brand"><img src={logo} alt={"Logo"}/></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="navbarToggleExternalContent" className="navCollapse">
                    <Nav className="navNav">
                        <LinkContainer to="/today-visits" activeHref="active">
                            <Nav.Link exact className="navItemLink">{t("todayAppointments")}</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/check-ups" activeHref="active">
                            <Nav.Link exact className="navItemLink">{t("checkups")}</Nav.Link>
                        </LinkContainer>
                    </Nav>
                    <NavDropdown className="navItemLanguages" title={profileTitle} id="basic-nav-dropdown">
                        <NavDropdown title={t("language")} id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => {changeLanguage('en')}}>English</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => {changeLanguage('pl')}}>Polski</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/logout">{t("logout")}</NavDropdown.Item>
                    </NavDropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default DoctorNavigation;