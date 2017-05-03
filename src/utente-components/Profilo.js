import React from 'react';
import { DatiAccount } from './profilo-modules/DatiAccount';
import { ContattiWeb } from './profilo-modules/ContattiWeb';
import { DatiPersonali } from './profilo-modules/DatiPersonali';
import info from '../data.json';
import './Profilo.css';

export class Profilo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            utente: null,
            utenteMetadati: null
        };
        this.getUtenteData = this.getUtenteData.bind(this);
        this.statoPubblico = this.statoPubblico.bind(this);
    }

    componentWillMount(){
        this.getUtenteData(this.props.idUtente);
    }

    forceUpdate(){}

    getUtenteData(){
        var self = this;
        var myHeader = new Headers();
        var myInit = {
            method: 'GET',
            headers: myHeader,
            mode: 'cors',
            cache: 'default'
        };
        var requestUrl = info.siteURL+"/wp-admin/admin-ajax.php?action=resocosp_get_user_data_by_id&idUtente="+self.props.idUtente;
        var myRequest = new Request(requestUrl, myInit);

        fetch(myRequest)
            .then(function(response){
                return response.json();
            })
            .then(function(data){

                var statoPubblico = self.statoPubblico(data.utente_metadati.is_public[0]);
                self.setState({
                    utente: data.utente,
                    utenteMetadati: data.utente_metadati,
                    statoPubblico: statoPubblico
                });
            })
            .catch(function(error){
                console.log(error);
            });
    }

    statoPubblico(value){
        var isPublic;
        switch(value)
        {
            case 'true':
            case true:
                isPublic = true;
                break;
            case 'false':
            case false:
                isPublic = false;
                break;
            default: 
                break;
        }
        return isPublic;
    }

    setStatoPubblico(newState){
        this.setState({statoPubblico: newState});
    }

    render(){

        if(this.state.utente == null){

            this.forceUpdate();
        } 
        else {
            var userID = this.state.utente.ID;
            var userLogin = this.state.utente.data.user_login;
            var userEmail = this.state.utente.data.user_email;
            var userSesso = this.state.utenteMetadati.sesso;
            var userIndirizzo = this.state.utenteMetadati.indirizzo
        }
        return (
            <div>
                <DatiAccount idUtente={userID}
                                username={userLogin}
                                email={userEmail}
                                isPublic={this.state.statoPubblico}
                                callbackParent={(newState) => this.setStatoPubblico(newState)}
                />
                <ContattiWeb idUtente={userID}
                             
                />
                <DatiPersonali idUtente={userID}
                               sesso={userSesso}
                               indirizzo={userIndirizzo} 
                />
            </div>
        );
    }
}

Profilo.contextTypes = {
    utenteStesso: React.PropTypes.bool
}