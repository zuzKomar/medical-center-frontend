import React from "react";
import logo from '../../../logo.png';
import {Navbar, Nav, NavDropdown, Container} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap'
import {BsPerson} from 'react-icons/bs'

function DoctorNavigation(){
    const profileTitle = (<BsPerson size={42}/>);
    return(
        <Navbar bg="light" variant="light" expand="lg" collapseOnSelect="true" sticky="top" className="navContainer">
            <Container fluid>
                <Navbar.Brand className="navbar-brand"><img src={logo} alt={"Logo"}/></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="navbarToggleExternalContent" className="navCollapse">
                    <Nav className="navNav">
                        <LinkContainer to="/today-visits" activeHref="active">
                            <Nav.Link exact className="navItemLink">Today's Visits</Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default DoctorNavigation;