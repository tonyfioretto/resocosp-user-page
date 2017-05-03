import React from 'react';
import { FormGroup, FormControl, Row, Col, Button, Glyphicon } from 'react-bootstrap';
import { Allegato } from './Allegato';
import './NuovoPost.css';
import info from '../../data.json';

export class NuovoPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            allegatoModal: false,
            allegato: false
        };
        this.allegato = null;
        this.allegatoFile = null;
        this.saveNewPost = this.saveNewPost.bind(this);
        this.checkPostText = this.checkPostText.bind(this);
        this.nuovoAllegato = this.nuovoAllegato.bind(this);
        this.rimuoviAllegato = this.rimuoviAllegato.bind(this);
        this.chiudiAllegatoModal = this.chiudiAllegatoModal.bind(this);
    }

    saveNewPost() {
        var newPost = document.getElementById("new-post");
        var postData = new FormData(newPost);
        postData.append('idUtente', this.context.idUtente);
        if(this.allegatoFile !== null) postData.append('immagine-post', this.allegatoFile);

        var myHeader = new Headers();
        var myInit = {
            method: 'POST',
            headers: myHeader,
            mode: 'cors',
            cache: 'default',
            body: postData
        };
        var requestUrl = info.siteURL + '/wp-admin/admin-ajax.php?action=resocosp_add_new_post';
        var myRequest = new Request(requestUrl, myInit);
        var self = this;
        fetch(myRequest)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                document.getElementById("np-textarea").value = '';
                self.props.callbackParent(data.response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    nuovoAllegato(){
        this.setState({allegatoModal: true});
    }

    rimuoviAllegato(){
        var testoPost = document.getElementById("np-textarea").value;
        if(testoPost === ''){
            this.setState({allegato: false, disabled: true});    
        } else this.setState({allegato: false});
    }

    chiudiAllegatoModal(file = null, data = ''){
        if(file !== null){
            this.allegato = <Col sm={12}>
                                <img src={data} alt="" width="150"/>
                                <Glyphicon glyph="remove" 
                                           className="np-remove-allegato"
                                           title="Rimuovi allegato"
                                           onClick={this.rimuoviAllegato}/>
                            </Col>;
            this.allegatoFile = file;
        }
        
        this.setState({allegatoModal: false, allegato: true, disabled: false});
    }

    nuoviTags(){}

    checkPostText(e){
        if(e.target.value !== '') this.setState({disabled: false});
        else this.setState({disabled: true});
    }

    render() {
        
        return (
            <form id="new-post" className="np-new-post-box">
                <Row>
                    <Col sm={12}>
                        <FormGroup>
                            <FormControl componentClass="textarea"
                                className="np-input-area"
                                name="post_content"
                                id="np-textarea" 
                                placeholder="Scrivi un nuovo post..."
                                onChange={this.checkPostText}/>
                        </FormGroup>
                        {this.state.allegato &&
                            <FormGroup>
                                {this.allegato}
                            </FormGroup>
                        }
                    </Col>
                    <Col sm={12} className="np-footer">
                            <Col sm={9} xs={9}>
                                <div className="np-allegato" onClick={this.nuovoAllegato}>
                                    <span>Allega </span>
                                    <Glyphicon glyph="paperclip" />
                                    {this.state.allegatoModal && 
                                        <Allegato show={this.state.allegatoModal} 
                                                  callbackParent={(file, data) => this.chiudiAllegatoModal(file, data)}/>
                                    }
                                    
                                </div>
                                <div className="np-tags" onClick={this.nuoviTags}>
                                    <span>Tags </span>
                                    <Glyphicon glyph="tags" />
                                </div>
                            </Col>
                            <Col sm={3} xs={3}>
                                <Button bsStyle="primary" 
                                        className="pull-right" 
                                        disabled={this.state.disabled}
                                        onClick={this.saveNewPost}>
                                    Pubblica
                                </Button>
                        </Col>
                    </Col>
                </Row>
            </form>
        );
    }
}

NuovoPost.contextTypes = {
    idUtente: React.PropTypes.number,
    utenteStesso: React.PropTypes.bool
}