import React from 'react';
import { Row, Col } from 'react-bootstrap';
import './Header.css';

export class Header extends React.Component{

    render(){
        return(
            <div className="user-page-header">
                <Row className="user-header">
                    <Col md={4} sm={4} xs={4} className="text-center" >
                        <img src={this.props.immagineUtenteUrl} className="user-image" alt="" />
                    </Col>
                    <Col md={8} sm={8} xs={8}>
                        <h2>{this.props.titoloPagina}</h2>
                    </Col>
                </Row>   
            </div>
        );
    }
}