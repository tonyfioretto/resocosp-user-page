import React, { Component } from 'react';
import { Utente } from './Utente';
import { Header } from './common-components/Header';
import info from './data.json';
import './App.css';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            utente: [],
            utenteMetadati: [],
            pagina: [],
            localita: [],
            idUtenteCorrente: parseInt(document.getElementById("current-user-id").innerHTML, 10),
            immagineUtenteUrl: '',
            isPublic: undefined,
            userWebSite: undefined,
            socialAccount: undefined,
            userAddress: undefined
        };
        this.getUserPageParams = this.getUserPageParams.bind(this);
        this.convertIsPublic = this.convertIsPublic.bind(this);
    }

    getChildContext() {
        var utente = this.state.utente;
        var metadati = this.state.utenteMetadati;
        var baseURL = window.location.pathname;
        if (metadati.hasOwnProperty("nickname")) {
            var isPublic = false;
            if (metadati.is_public[0] === 'true') isPublic = true;
            var self = this;
            if(this.state.idUtenteCorrente === this.state.utente.ID) var utenteStesso = true;
            else utenteStesso = false;
            return {
                baseURL: baseURL,
                idUtente: this.state.utente.ID,
                utenteStesso: utenteStesso,
                displayName: utente.data.display_name,
                urlUtente: utente.data.user_nicename,
                imgUtente: this.state.immagineUtenteUrl,
                email: utente.data.user_email,
                userLogin: utente.data.user_login,
                userWebSite: this.state.userWebSite,
                setUserWebSite: function (url) {
                    if (url !== "") self.setState({ userWebSite: 'http://' + url });
                    else self.setState({ userWebSite: url });
                },
                isPublic: this.state.isPublic,
                setIsPublic: function () {
                    isPublic = !self.state.isPublic;
                    self.setState({ isPublic: isPublic });
                },
                socialLinkList: [
                    { socialName: 'Facebook', socialValue: 'fb' },
                    { socialName: 'Twitter', socialValue: 'tw' },
                    { socialName: 'Instagram', socialValue: 'in' },
                    { socialName: 'LinkedIn', socialValue: 'li' }
                ],
                socialAccounts: this.state.socialAccount,
                setSocialAccount: function (social, username) {
                    if (username === "") {
                        // elimina
                        var socialList = self.state.socialAccount[0];
                        var obj = {};
                        for(var i in socialList){
                            if(i !== social){
                                obj[i] = socialList[i];
                            }
                        }
                        var newList = [];
                        newList.push(obj);
                        self.setState({socialAccount: newList});
                    }
                    else {
                        // aggiunge o modifica
                        if (self.state.socialAccount[0] === undefined) socialList = {};
                        else socialList = self.state.socialAccount[0];
                        socialList[social] = username;
                        newList = [];
                        newList.push(socialList);
                        self.setState({ socialAccount: newList });
                    }
                },
                sesso: metadati.sesso[0],
                indirizzo: [this.state.localita[0].id, 
                            this.state.userAddress.indirizzo, 
                            this.state.userAddress.cap, 
                            this.state.localita[0].comune, 
                            this.state.userAddress.provincia],
                setIndirizzo: function(form, localita){
                    var userAddress= {
                        indirizzo: form.get('indirizzo'),
                        cap: form.get('cap'),
                        provincia: form.get('provincia'),
                        comune: form.get('comune')
                    }
                    if(localita === 0){
                        localita = [{id: '0'}];
                    } 
                    self.setState({userAddress: userAddress, localita: localita});
                }
            };
        }
    }

    componentWillMount() {
        this.getUserPageParams();
    }

    forceUpdate() { }

    getUserPageParams() {
 
        if(window.location.search === "") var userPage = "utente/nuovo-utente";
        else userPage = window.location.search;

        var self = this;
        var myHeader = new Headers();
        var myInit = {
            method: 'GET',
            headers: myHeader,
            mode: 'cors',
            cache: 'default'
        };
        var requestUrl = info.siteURL + '/wp-admin/admin-ajax.php?action=resocosp_get_user_page_params&user_page='+userPage;
        var myRequest = new Request(requestUrl, myInit);

        fetch(myRequest)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
//                console.log(data);
                var isPublic = data.utente_metadati.is_public[0];
                var is_public = self.convertIsPublic(isPublic);
                var userUrl = data.utente.data.user_url;
                if(data.localita.length === 0){
                    var localita = [];
                    localita.push({
                        id: '',
                        indirizzo: '',
                        cap: '',
                        provincia: '',
                        comune: ''
                    });
                } else localita = data.localita;
                var userAddress = {
                    indirizzo: data.utente_metadati.indirizzo[0],
                    cap: data.utente_metadati.cap[0],
                    provincia: data.utente_metadati.provincia[0],
                    comune: data.utente_metadati.comune[0]
                };
                self.setState({
                    utente: data.utente,
                    pagina: data.pagina,
                    utenteMetadati: data.utente_metadati,
                    immagineUtenteUrl: data.immagine_url,
                    userWebSite: userUrl,
                    isPublic: is_public,
                    socialAccount: data.social_account,
                    userAddress: userAddress,
                    localita: localita
                });

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    convertIsPublic(value) {
        if (value === 'true') return true;
        else return false;
    }


    render() {
        var tipoUtente = null;
        var ruolo = this.state.utente.roles;
        if (ruolo !== undefined) ruolo = this.state.utente.roles[0];

        switch (ruolo) {
            case 'cliente':
                tipoUtente = <Utente idUtente={this.state.utente.ID}
                    idUtenteCorrente={this.state.idUtenteCorrente}
                />;
                break;
            default:
                this.forceUpdate();
                break;
        }
        return (
            <div className="App">
                <Header titoloPagina={this.state.pagina.post_title}
                    immagineUtenteUrl={this.state.immagineUtenteUrl}
                />
                {tipoUtente}

            </div>
        );
    }
}

App.childContextTypes = {
    baseURL: React.PropTypes.string,
    idUtente: React.PropTypes.number,
    utenteStesso: React.PropTypes.bool,
    displayName: React.PropTypes.string,
    urlUtente: React.PropTypes.string,
    imgUtente: React.PropTypes.string,
    userLogin: React.PropTypes.string,
    userWebSite: React.PropTypes.string,
    setUserWebSite: React.PropTypes.func,
    email: React.PropTypes.string,
    isPublic: React.PropTypes.bool,
    setIsPublic: React.PropTypes.func,
    socialLinkList: React.PropTypes.array,
    socialAccounts: React.PropTypes.array,
    setSocialAccount: React.PropTypes.func,
    sesso: React.PropTypes.string,
    indirizzo: React.PropTypes.array,
    setIndirizzo: React.PropTypes.func
}

