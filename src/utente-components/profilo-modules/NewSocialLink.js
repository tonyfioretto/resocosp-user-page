import React from 'react';
import { Row, Col, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import jQuery from 'jquery';
import info from '../../data.json';

export class NewSocialLink extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            disabled: true,
            socialActiveValue: '',
            socialUsername: ''
        };
        this.socialList = '';
        this.socialLinksList = this.socialLinksList.bind(this);
        this.addSocialLink = this.addSocialLink.bind(this);
        this.checkSocialUsername = this.checkSocialUsername.bind(this);
        this.setSocialName = this.setSocialName.bind(this);
    }

    componentWillMount(){
        var socialLinkList = this.socialLinksList();
        if(this.state.socialActiveValue === '') this.setState({socialActiveValue: socialLinkList[0].socialValue});
    }

    socialLinksList(){
        this.socialList = this.context.socialLinkList;
        return this.socialList;
    }

    setSocialName(e){
        e.preventDefault();
        this.setState({socialActiveValue: e.target.value});
    }

    addSocialLink(){

        var self = this;
        jQuery.ajax({
            url: info.siteURL+"/wp-admin/admin-ajax.php",
            type: "POST",
            dataType: "json",
            data: {
                'action': 'resocosp_add_social_account',
                'user_ID': this.context.idUtente,
                'social_code': this.state.socialActiveValue,
                'social_username': this.state.socialUsername
            },
            success: function(data){
                self.context.setSocialAccount(self.state.socialActiveValue, self.state.socialUsername);
            },
            error: function(error){
                console.log(error);
            }
        });
    }

    checkSocialUsername(e){
        e.preventDefault();
        if(e.target.value.length > 0) {
            this.setState({disabled: false, socialUsername: e.target.value});
        }
        else this.setState({disabled: true, socialUsername: e.target.value});

    }

    render(){
        return(
            <Row>
                <form>
                    <Col md={3} sm={3}>
                        <FormGroup>
                            <ControlLabel>
                                Scegli social
                            </ControlLabel>
                            <FormControl componentClass="select" id="social-list" value={this.state.socialActiveValue} onChange={this.setSocialName}>
                                {this.socialList.map((socialLink) =>
                                    <option key={socialLink.socialName} value={socialLink.socialValue}>{socialLink.socialName}</option>
                                )}
                            </FormControl>
                        </FormGroup>
                    </Col>
                    <Col md={4} sm={4}>
                        <FormGroup>
                            <ControlLabel>
                                Nome Utente
                            </ControlLabel>
                            <FormControl type="text" onInput={this.checkSocialUsername}/>
                        </FormGroup>
                    </Col>
                    <Col md={4} sm={4}>
                        <Button bsStyle="primary" 
                                className="user-save-button" 
                                disabled={this.state.disabled} 
                                onClick={this.addSocialLink}>
                                Salva
                        </Button>
                        <Button bsStyle="danger" 
                                className="user-exit-button"
                                onClick={() => this.props.callbackParent(false)}>
                                Annulla
                        </Button>
                    </Col>
                </form>
            </Row>          
        );
    }
}

NewSocialLink.contextTypes = {
  idUtente: React.PropTypes.number,
  socialLinkList: React.PropTypes.array,
  socialAccount: React.PropTypes.array,
  setSocialAccount: React.PropTypes.func
}