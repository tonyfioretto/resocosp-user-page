import React from 'react';
import { Col, FormGroup, ControlLabel, FormControl, Button, Glyphicon } from 'react-bootstrap';
import ReactPasswordStrength from 'react-password-strength';
import jQuery from 'jquery';
import info from '../../data.json';
import './Password.css';

export class Password extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            disabled: true
        };

        this.checkNewPassword = this.checkNewPassword.bind(this);
        this.checkRepeatedPassword = this.checkRepeatedPassword.bind(this);
        this.checkFields = this.checkFields.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
    }
  
    checkNewPassword(obj){
        if(obj.isValid) this.checkFields(true);
        else this.checkFields(false);
    }

    checkRepeatedPassword(e){
        e.preventDefault();
        this.checkFields();
    }
    
    checkFields(passwordState = true){

        if(passwordState){
            if(jQuery("#newPassword").val() === jQuery("#repeatedPassword").val() && jQuery("#oldPassword").val() !== '')
                this.setState({disabled: false});
            else this.setState({disabled: true});
        }
        else this.setState({disabled: true});
    }

    updatePassword(){
        var oldPassword = jQuery("#oldPassword").val();
        var newPassword = jQuery("#newPassword").val();
        var idUtente = this.props.idUtente;
        var self = this;
        jQuery.ajax({
            url: info.siteURL+"/wp-admin/admin-ajax.php",
            data:{
                'action': 'resocosp_user_page_update_password',
                'old_password': oldPassword,
                'new_password': newPassword,
                'id_utente': idUtente
            },
            type: "GET",
            dataType: 'json',
            success: function(data){
                if(data.passwordReset){
                    jQuery("#oldPassword").val('');
                    jQuery("#newPassword").val('');
                    jQuery("#repeatedPassword").val('');
                    self.props.callbackParent(false, true);
                }
            },
            error: function(error){
                console.log(error);
            }
        });
        
    }
    render(){
        return(
            <div>
            {this.props.enabled ? (            
                <form>
                    <Col md={3} sm={8} >
                        <FormGroup controlId="oldPassword">
                            <ControlLabel>Vecchia password</ControlLabel>
                            <FormControl type="password" onInput={this.checkFields}/>
                        </FormGroup>
                    </Col>
                    <Col md={3} sm={8}>
                        <FormGroup controlId="newPassword">
                            <ControlLabel>Nuova password</ControlLabel>
                            <ReactPasswordStrength
                                minLength={7}
                                minScore={1}
                                scoreWords={['pessima', 'debole', 'ok', 'forte', 'ottima']}
                                inputProps={{ id: "newPassword" }}
                                changeCallback={this.checkNewPassword}
                                />
                        </FormGroup>
                    </Col>
                    <Col md={3} sm={8}>
                        <FormGroup controlId="repeatedPassword">
                            <ControlLabel>Ripeti password</ControlLabel>
                            <FormControl type="password" onInput={this.checkFields}/>
                        </FormGroup>
                    </Col>
                    <Col md={3} sm={6}>
                        <Button bsStyle="success" 
                                className="user-save-button" 
                                disabled={this.state.disabled}
                                onClick={this.updatePassword}>
                                <Glyphicon glyph="save" title="Salva password" />
                        </Button>
                        <Button bsStyle="danger" 
                                className="user-exit-button"
                                onClick={()=> this.props.callbackParent(false, false)}>
                                <Glyphicon glyph="remove" title="Annulla" />
                        </Button>
                    </Col>
                    
                </form>
            ) : null }
            </div>
        );
    }
}