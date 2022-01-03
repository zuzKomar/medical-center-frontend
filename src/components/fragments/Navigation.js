import React from "react";
import logo from '../../logo.png';
import {Navbar, Nav, NavDropdown, Container, ListGroup} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap'
import {BsPerson} from 'react-icons/bs'
import {useLocation} from "react-router-dom";
import {useHistory} from 'react-router';

const Navigation = ({changeLanguage, t, setLogged}) =>{
    const history = useHistory();
    const profileTitle = (<BsPerson size={46}/>);
    const {pathname} = useLocation()

    const handleLogout = () =>{
        sessionStorage.clear();
        sessionStorage.setItem('logged', 'false');
        setLogged(false);
        history.push('/logowanie');
    }

    return(
            <Navbar bg="light" variant="light" expand="lg" collapseOnSelect="true" sticky="top" className="navContainer">
                <Container fluid>
                    <Navbar.Brand className="navbar-brand"><img alt="Portal pacjenta" src={logo}/></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="navbarToggleExternalContent" className="navCollapse">
                        <Nav className="navNav" key={pathname}>
                                <LinkContainer to="/wizyty" activeHref="active">
                                    <Nav.Link exact className="navItemLink" >{t("appointments")}</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/skierowania" activeHref="active">
                                    <Nav.Link exact className="navItemLink" >{t("referrals")}</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/grafik" activeHref="active">
                                    <Nav.Link exact className="navItemLink" >{t("schedules")}</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/badania" activeHref="active">
                                    <Nav.Link exact className="navItemLink" >{t("checkups")}</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/recepty" activeHref="active">
                                    <Nav.Link exact className="navItemLink" >{t("prescriptions")}</Nav.Link>
                                </LinkContainer>
                        </Nav>
                        <NavDropdown className="navItemLanguages" title={profileTitle} id="basic-nav-dropdown">
                            <LinkContainer to="/moje-konto" activeHref="active">
                                <Nav.Link exact className="navItemLink2 nav-link">{t("myAccount")}</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/moje-pliki" activeHref="active">
                                <Nav.Link exact className="navItemLink2">{t("myFiles")}</Nav.Link>
                            </LinkContainer>

                            <NavDropdown title={t("language")} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => {changeLanguage('en')}}>English</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => {changeLanguage('pl')}}>Polski</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout}>{t("logout")}</NavDropdown.Item>
                        </NavDropdown>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
    )
}

export default Navigation;