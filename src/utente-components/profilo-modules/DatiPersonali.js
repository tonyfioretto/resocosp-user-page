import React from 'react';
import { Panel, Row, Col, Glyphicon, ControlLabel, FormGroup, FormControl, Button } from 'react-bootstrap';
import './DatiPersonali.css';
import info from '../../data.json';

export class DatiPersonali extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modificaIndirizzo: false,
            province: [],
            comuni: []
        };
        
        this.editInfo = this.editInfo.bind(this);
        this.undoInfo = this.undoInfo.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.getProvince = this.getProvince.bind(this);
        this.getComuni = this.getComuni.bind(this);
    }
    componentWillMount(){
        this.getProvince();
        this.getComuni();        
    }

    editInfo() {
        this.setState({ modificaIndirizzo: true });
       
    }

    undoInfo(){
        this.setState({ modificaIndirizzo: false });
    }

    updateInfo(action){
        switch(action){
            case 'salva':
                var addressForm = document.getElementById("addressForm");
                var formData = new FormData(addressForm);
                formData.append("idUtente", this.context.idUtente);
                formData.append("mode", "update");

                var self = this;
                var myHeader = new Headers();
                var myInit = {
                    method: 'POST',
                    headers: myHeader,
                    mode: 'cors',
                    cache: 'default',
                    body: formData
                };
                var requestUrl = info.siteURL + '/wp-admin/admin-ajax.php?action=resocosp_update_address';
                var myRequest = new Request(requestUrl, myInit);
                fetch(myRequest)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        self.setState({modificaIndirizzo: false});
                        self.context.setIndirizzo(formData, data.response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                break;
            case 'elimina':
                formData = new FormData();

                formData.append("idUtente", this.context.idUtente);
                formData.append("mode", "delete");
                formData.append("indirizzo", "");
                formData.append("cap", "");
                formData.append("provincia", "");
                formData.append("comune", "");

                self = this;
                myHeader = new Headers();
                myInit = {
                    method: 'POST',
                    headers: myHeader,
                    mode: 'cors',
                    cache: 'default',
                    body: formData
                };
                requestUrl = info.siteURL + '/wp-admin/admin-ajax.php?action=resocosp_update_address';
                myRequest = new Request(requestUrl, myInit);
                fetch(myRequest)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        
                        self.setState({modificaIndirizzo: false});
                        self.context.setIndirizzo(formData, data.response);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                break;
            default:
                break;
        }
    }

    getProvince(){
        var self = this;
        var myHeader = new Headers();
        var myInit = {
            method: 'GET',
            headers: myHeader,
            mode: 'cors',
            cache: 'default'
        };
        var requestUrl = info.siteURL + '/wp-admin/admin-ajax.php?action=resocosp_lista_province';
        var myRequest = new Request(requestUrl, myInit);
        fetch(myRequest)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                self.setState({province: data.response});
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getComuni(e = null){

        if(e === null) var sigla = this.context.indirizzo[4];
        else sigla = e.target.value;

        var self = this;
        var myHeader = new Headers();
        var myInit = {
            method: 'GET',
            headers: myHeader,
            mode: 'cors',
            cache: 'default'
        };
        var requestUrl = info.siteURL + '/wp-admin/admin-ajax.php?action=resocosp_lista_comuni_per_provincia&sigla='+sigla;
        var myRequest = new Request(requestUrl, myInit);
        fetch(myRequest)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                self.setState({province: self.state.province, comuni: data.response});
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        if (this.context.sesso === "M") var sesso = "Uomo";
        else sesso = "Donna";
        var noChange = !this.state.modificaIndirizzo;
        var baseDomicilio = '';
        var domicilio = baseDomicilio.concat(this.context.indirizzo[1],this.context.indirizzo[2],this.context.indirizzo[3],this.context.indirizzo[4]);
        var gotDomicilio = false;
        if(domicilio.length > 0 && domicilio !== 'undefined'){
            gotDomicilio = true;
        }

        return (
            <div>
                <Panel header="Dati personali">
                    <Row>
                        <Col sm={3}>
                            <strong>Sesso</strong>
                        </Col>
                        <Col sm={9}>
                            {sesso}
                        </Col>
                    </Row>
                    {noChange &&
                    <Row>
                        <div>
                            <Col sm={3}>
                                <strong>Domicilio</strong>
                            </Col>
                            {gotDomicilio ?(
                                <Col sm={7} xs={9}>
                                    {this.context.indirizzo[1]}, {this.context.indirizzo[2]}, {this.context.indirizzo[3]}({this.context.indirizzo[4]})
                                </Col>
                            ) : (
                                <Col sm={7} xs={9}>
                                    <em>non disponibile</em>
                                </Col>
                            )}
                            {this.context.utenteStesso &&
                            <Col sm={2} xs={3}>
                                {this.state.modificaIndirizzo ? null : (
                                    <div>
                                        <Glyphicon glyph="pencil" title="Modifica" className="info-tools editInfo"
                                            onClick={() => this.editInfo()} />
                                        <Glyphicon glyph="trash" title="Elimina" className="info-tools deleteInfo"
                                            onClick={() => this.updateInfo("elimina")} />
                                    </div>
                                )}
                            </Col>
                            }
                        </div>
                    </Row>
                    }
                    <Row>
                    {!noChange &&
                        <div>
                            <Col sm={3}>
                                <strong>Domicilio</strong>
                            </Col>
                            <Col sm={9} className="dp-address-form">
                                <form id="addressForm">
                                    <Col sm={8}>
                                        <FormGroup>
                                            <ControlLabel>Indirizzo</ControlLabel>
                                            <FormControl type="text" name="indirizzo"defaultValue={this.context.indirizzo[1]} />
                                        </FormGroup>
                                    </Col>
                                    <Col sm={3}>
                                        <FormGroup>
                                            <ControlLabel>Cap</ControlLabel>
                                            <FormControl type="text" name="cap" defaultValue={this.context.indirizzo[2]} />
                                        </FormGroup>
                                    </Col>
                                    <Col sm={3}>
                                        <FormGroup>
                                            <ControlLabel>Provincia</ControlLabel>
                                            <FormControl componentClass="select" 
                                                        name="provincia"
                                                        defaultValue={this.context.indirizzo[4]}
                                                        onChange={this.getComuni}>
                                            {this.state.province.map((provincia) =>
                                                <option key={provincia.sigla_provincia} value={provincia.sigla_provincia}>{provincia.sigla_provincia}</option>
                                            )}
                                            </FormControl>
                                        </FormGroup>
                                    </Col>
                                    <Col sm={5}>
                                        <FormGroup>
                                            <ControlLabel>Comune</ControlLabel>
                                            <FormControl componentClass="select"
                                                        name="comune"
                                                        id={this.context.indirizzo[0]} 
                                                        defaultValue={this.context.indirizzo[0]} >
                                            {this.state.comuni.map((comune) =>
                                                <option key={comune.id} value={comune.id}>{comune.comune}</option>
                                            )}
                                            </FormControl>
                                        </FormGroup>
                                    </Col>
                                    <Col sm={3}>
                                        <Button bsStyle="success" 
                                                className="dp-user-save-button"
                                                onClick={() => this.updateInfo('salva')}>
                                                <Glyphicon glyph="save" title="Salva indirizzo" />
                                        </Button>
                                        <Button bsStyle="danger" 
                                                className="dp-user-exit-button"
                                                onClick={this.undoInfo}>
                                                <Glyphicon glyph="remove" title="Annulla" />
                                        </Button>
                                    </Col>
                                </form>
                            </Col>
                        </div>
                    }
                    </Row>
                </Panel>
            </div>
        );
    }
}

DatiPersonali.contextTypes = {
    idUtente: React.PropTypes.number,
    utenteStesso: React.PropTypes.bool,
    sesso: React.PropTypes.string,
    indirizzo: React.PropTypes.array,
    setIndirizzo: React.PropTypes.func
}