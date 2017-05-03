import React from 'react';
import { Row, Col, Glyphicon } from 'react-bootstrap';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import { Attivita } from './utente-components/Attivita';
import { Profilo } from './utente-components/Profilo';
import { Contatti } from './utente-components/Contatti';
import { Aziende } from './utente-components/Aziende';
import { Prodotti } from './utente-components/Prodotti';
import './Utente.css';

export class Utente extends React.Component{

    render(){
        var isActive = (match, location) =>{
            if(!match) return false;
            else return true;
        };
        var isUserItself = false;
        if(this.props.idUtente === this.props.idUtenteCorrente) isUserItself = true;

        return(
            <Row className="user-page-container">
            <Router basename={this.context.baseURL}>
                <nav className="user-page-menu">
                    <Col md={4} sm={4} xs={12}>
                        <ul className="user-page-menu-list">
                            <li>
                                <NavLink to="/" activeClassName={isActive ? 'selected' : ''} exact>
                                    <Col md={2} sm={2} xs={2}>
                                        <Glyphicon glyph="tasks"/>
                                    </Col>
                                    <Col md={10} sm={10} xs={10}>Attività</Col>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/profilo" activeClassName={isActive ? 'selected' : ''}>
                                    <Col md={2} sm={2} xs={2}>
                                        <Glyphicon glyph="info-sign" />
                                    </Col>
                                    <Col md={10} sm={10} xs={10}>Profilo</Col>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/contatti" activeClassName={isActive ? 'selected' : ''}>
                                    <Col md={2} sm={2} xs={2}>
                                        <Glyphicon glyph="user" />
                                    </Col>
                                    <Col md={10} sm={10} xs={10}>Contatti</Col>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/aziende" activeClassName={isActive ? 'selected' : ''}>
                                    <Col md={2} sm={2} xs={2}>
                                        <Glyphicon glyph="briefcase" />
                                    </Col>
                                    <Col md={10} sm={10} xs={10}>Aziende</Col>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/prodotti" activeClassName={isActive ? 'selected' : ''}>
                                    <Col md={2} sm={2} xs={2}>
                                        <Glyphicon glyph="list" />
                                    </Col>
                                    <Col md={10} sm={10} xs={10}>Prodotti</Col>
                                </NavLink>
                            </li>
                        </ul>
                    </Col>
                    
                    <Col md={8} sm={8} xs={12}>
                        <div className="user-page-data-wrapper">
                            <Route exact path="/" 
                                component={() => (
                                    <Attivita />
                                )}
                            />
                            <Route exact path="/profilo" 
                                component={() => (
                                    <Profilo idUtente={this.props.idUtente} 
                                             abilitaUpdate={isUserItself}
                                    />
                                )} 
                            />
                            <Route exact path="/contatti" 
                                component={() => (
                                    <Contatti 
                                    />
                                )} 
                            />
                            <Route exact path="/aziende" 
                                component={() => (
                                    <Aziende 
                                    />
                                )} 
                            />
                            <Route exact path="/prodotti" 
                                component={() => (
                                    <Prodotti 
                                    />
                                )} 
                            />
                        </div>
                    </Col>
                </nav>
            </Router>
            </Row>
        );
    }
}

Utente.contextTypes = {
    baseURL: React.PropTypes.string
}