import React from 'react';
import { Panel, Row, Col, Glyphicon, FormControl, FormGroup } from 'react-bootstrap';
import { NewSocialLink } from './NewSocialLink';
import './ContattiWeb.css';
import jQuery from 'jquery';
import info from '../../data.json';

export class ContattiWeb extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addNewSocial: false
        }

        this.socialAccountsList = [];
        this.showNewSocial = this.showNewSocial.bind(this);
        this.editInfo = this.editInfo.bind(this);
        this.saveInfo = this.saveInfo.bind(this);
        this.undoInfo = this.undoInfo.bind(this);
        this.deleteInfo = this.deleteInfo.bind(this);

    }

    showNewSocial(visible = true) {
        if (visible) this.setState({ addNewSocial: true });
        else this.setState({ addNewSocial: false });
    }

    editInfo(id) {

        jQuery("#" + id).parent().parent().next().children(".editInfo").hide();
        jQuery("#" + id).parent().parent().next().children(".saveInfo").show();
        jQuery("#" + id).parent().parent().next().children(".undoInfo").show();
        jQuery("#" + id).parent().parent().next().children(".deleteInfo").hide();
        var prevValue = jQuery("#" + id).parent().prev().html();
        if (prevValue === "sito non disponibile") prevValue = "";
        jQuery("#" + id).parent().prev().hide();
        jQuery("#" + id).toggle().val(prevValue);

    }

    saveInfo(id, key) {
        if (id === "webSite") {
            //controlla il formato
            var webSite = jQuery("#" + id).val();
            //            var regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/ig;
            var regex = /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/ig;
            let str = regex.exec(webSite);

            if (str !== null) {
                var self = this;
                //salva il sito
                jQuery.ajax({
                    url: info.siteURL + "/wp-admin/admin-ajax.php",
                    type: "POST",
                    dataType: "json",
                    data: {
                        'action': 'resocosp_update_website',
                        'user_ID': this.context.idUtente,
                        'website': webSite
                    },
                    success: function (data) {
                        self.undoInfo(id);
                        self.context.setUserWebSite(webSite);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            }
            else {
                // il formato dell'indirizzo non è corretto
                console.log("ko");
            }
        }
        else {
            //salva la modifica account social
            var newUsername = jQuery("#" + id).val();
            self = this;
            jQuery.ajax({
                url: info.siteURL + "/wp-admin/admin-ajax.php",
                type: "POST",
                dataType: "json",
                data: {
                    'action': 'resocosp_update_social_account',
                    'user_ID': this.context.idUtente,
                    'social_code': key,
                    'social_username': newUsername
                },
                success: function (data) {
                    self.undoInfo(id);
                    self.context.setSocialAccount(key, newUsername);
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    }

    undoInfo(id) {
        jQuery("#" + id).parent().parent().next().children(".editInfo").show();
        jQuery("#" + id).parent().parent().next().children(".saveInfo").hide();
        jQuery("#" + id).parent().parent().next().children(".undoInfo").hide();
        jQuery("#" + id).parent().parent().next().children(".deleteInfo").show();
        jQuery("#" + id).parent().prev().show();
        jQuery("#" + id).toggle().val("");
    }

    deleteInfo(id, key) {
        if (id === "webSite") {
            var webSite = "";
            var self = this;
            //salva il sito
            jQuery.ajax({
                url: info.siteURL + "/wp-admin/admin-ajax.php",
                type: "POST",
                dataType: "json",
                data: {
                    'action': 'resocosp_update_website',
                    'user_ID': this.context.idUtente,
                    'website': webSite
                },
                success: function (data) {
                    self.context.setUserWebSite(webSite);
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
        else{
            self = this;
            jQuery.ajax({
                url: info.siteURL + "/wp-admin/admin-ajax.php",
                type: "POST",
                dataType: "json",
                data: {
                    'action': 'resocosp_delete_social_account',
                    'user_ID': this.context.idUtente,
                    'social_code': key,
                },
                success: function (data) {
                    self.context.setSocialAccount(key, "");
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    }

    render() {

        var socialList = true;
        if (this.context.socialAccounts === undefined || this.context.socialAccounts.length === 0) socialList = false;
        else {
            // dai dati dell'utente ricostruisce l'output dell lista dei social
            var accountList = this.context.socialAccounts[0];

            var socialAccountsList = [];
            for (var i in accountList) {
                var obj = {};
                for (var x in this.context.socialLinkList) {
                    if (i === this.context.socialLinkList[x].socialValue) {
                        obj.socialID = this.context.socialLinkList[x].socialValue;
                        obj.socialName = this.context.socialLinkList[x].socialName;
                        obj.socialUsername = accountList[i];
                    }
                }
                socialAccountsList.push(obj);
            }
        }

        var url = false;
        if (this.context.userWebSite.length !== 0) {
            url = this.context.userWebSite;
            var displayUrl = url.replace("http://", "");
        }

        return (
            <div>
                <Panel header="Contatti web">
                    <Row>
                        <Col md={3} sm={3} xs={12}>
                            <span className="social-name">Sito Web</span>
                        </Col>
                        <Col md={7} sm={7} xs={9}>
                            {!url ? (
                                <em>sito non disponibile</em>
                            ) : (
                                    <a href={url}>{displayUrl}</a>
                                )}
                            <FormGroup className="input-web-contact">
                                <FormControl type="text" className="editInput" id="webSite" />
                            </FormGroup>
                        </Col>
                        {this.context.utenteStesso &&
                        <Col md={2} sm={2} xs={3}>                        
                            <Glyphicon glyph="pencil" title="Modifica" className="info-tools editInfo" onClick={() => this.editInfo("webSite")} />
                            <Glyphicon glyph="save" title="Salva modifica" className="info-tools saveInfo" onClick={() => this.saveInfo("webSite")} />
                            <Glyphicon glyph="remove" title="Annulla modifica" className="info-tools undoInfo" onClick={() => this.undoInfo("webSite")} />
                            <Glyphicon glyph="trash" title="Elimina" className="info-tools deleteInfo" onClick={() => this.deleteInfo("webSite")} />
                        </Col>
                        }
                    </Row>
                    {socialList &&
                        <ul>
                            {socialAccountsList.map((socialAccount, index) =>
                                <li key={index}>
                                    <Row className="social-account-list">
                                        <Col md={3} sm={3} xs={12}>
                                            <span className="social-name">{socialAccount.socialName}</span>
                                        </Col>
                                        <Col md={7} sm={7} xs={9}>
                                            <span>{socialAccount.socialUsername}</span>
                                            <FormGroup className="input-web-contact">
                                                <FormControl type="text" className="editInput" id={socialAccount.socialName} />
                                            </FormGroup>
                                        </Col>
                                        {this.context.utenteStesso &&
                                        <Col md={2} sm={2} xs={3}>
                                            <Glyphicon glyph="pencil" title="Modifica" className="info-tools editInfo"
                                                onClick={() => this.editInfo(socialAccount.socialName)} />
                                            <Glyphicon glyph="save" title="Salva modifica" className="info-tools saveInfo"
                                                onClick={() => this.saveInfo(socialAccount.socialName, socialAccount.socialID)} />
                                            <Glyphicon glyph="remove" title="Annulla modifica" className="info-tools undoInfo"
                                                onClick={() => this.undoInfo(socialAccount.socialName)} />
                                            <Glyphicon glyph="trash" title="Elimina" className="info-tools deleteInfo"
                                                onClick={() => this.deleteInfo(socialAccount.socialName, socialAccount.socialID)} />
                                        </Col>
                                        }
                                    </Row>
                                </li>
                            )}
                        </ul>
                    }
                    {this.context.utenteStesso &&
                        <div>
                        {!this.state.addNewSocial &&
                            <p className="add-social-link" onClick={this.showNewSocial}>Aggiungi account social</p>
                        }
                        {this.state.addNewSocial &&
                            <NewSocialLink callbackParent={(enable) => this.showNewSocial(enable)} />
                        }
                        </div>
                    }
                </Panel>
            </div>
        );
    }
}
ContattiWeb.contextTypes = {
    idUtente: React.PropTypes.number,
    utenteStesso: React.PropTypes.bool,
    userWebSite: React.PropTypes.string,
    setUserWebSite: React.PropTypes.func,
    socialLinkList: React.PropTypes.array,
    socialAccounts: React.PropTypes.array,
    setSocialAccount: React.PropTypes.func
};