import React from 'react';
import { Panel, Row, Col } from 'react-bootstrap';
import ToggleButton from 'react-toggle-button';
import { Password } from './Password';
import  jQuery from 'jquery';
import info from '../../data.json';


export class DatiAccount extends React.Component{
    constructor(props, context){
        super(props);
        this.state = {
            cambioPassword: false,
            cambioEseguito: false
        }
        this.abilitaForm = this.abilitaForm.bind(this);
    }

    componentDidMount(){

    }

    abilitaForm(){
        jQuery(".user-update-password-link").hide();
        this.setState({cambioPassword: true});
    }

    aggiornamentoEseguito(newState, trigger){
        this.setState({cambioPassword: newState});
        if(trigger) jQuery('.user-update-password-message').show();
        else jQuery('.user-update-password-link').show();
    }

    aggiornaStatoPubblico(newValue){

        var self = this;

        jQuery.ajax({
            url: info.siteURL+"/wp-admin/admin-ajax.php",
            data:{
                'action': 'resocosp_update_is_public',
                'idUtente': this.context.idUtente,
                'statoPubblico': newValue
            },
            type: "GET",
            dataType: 'json',
            success: function(data){
                self.context.setIsPublic();
            },
            error: function(error){
                console.log(error);
            } 
        }); 
    }

    render(){
        return (
            <div>
                <Panel header="Dati account">
                    <Row>
                        <Col sm={3} xs={4}>
                            <strong>Username</strong>
                        </Col>
                        <Col sm={9} xs={8}>
                            {this.context.userLogin}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3} xs={4}>
                            <strong>Email</strong>
                        </Col>
                        <Col sm={9} xs={8}>
                            {this.context.email}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3} xs={4}>
                            <strong>Profilo pubblico</strong>
                        </Col>
                        <Col sm={9} xs={8}>
                            <ToggleButton value={this.context.isPublic}
                                inactiveLabel="No"
                                activeLabel='Sì'
                                onToggle={(value) => {
                                    let newValue = !value;
                                    this.aggiornaStatoPubblico(newValue);
                                }}
                            />
                        </Col>
                    </Row>                    
                    {this.context.utenteStesso ? (
                        <div>
                            <span className="user-update-password-link" onClick={this.abilitaForm}>Cambia password</span>
                            <span className="user-update-password-message">Password aggiornata</span>
                            <Password idUtente={this.context.idUtente} 
                                      enabled={this.state.cambioPassword}
                                      callbackParent={(newState) => this.aggiornamentoEseguito(newState)}
                            />
                        </div>
                    ) : null }
                </Panel>
            </div>
        );
    }
}

DatiAccount.contextTypes = {
    idUtente: React.PropTypes.number,
    utenteStesso: React.PropTypes.bool,
    userLogin: React.PropTypes.string,
    email: React.PropTypes.string,
    isPublic: React.PropTypes.bool,
    setIsPublic: React.PropTypes.func
}