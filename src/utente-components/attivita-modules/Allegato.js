import React from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export class Allegato extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            disabled: true
        };

        this.chiudi = this.chiudi.bind(this);
        this.salva = this.salva.bind(this);
        this.caricaFile = this.caricaFile.bind(this);
    }

    chiudi(){
        this.props.callbackParent();
    }

    salva(){
        var files = document.getElementsByName("allegato");
        var data = document.getElementById("np-allegato-preview").childNodes[0].getAttribute("src");
        this.props.callbackParent(files[0].files[0], data);
    }

    caricaFile(e){
        var allegato = e.target.files[0];
        var imageType = /^image\//;
        var isImage = false;
        if(imageType.test(allegato.type)) isImage = true;

        // controlla dimensione
        if(allegato.size > 1024000 || !isImage){
            document.getElementById("np-allegato-preview").innerHTML = "Immagine troppo grande (max 1MB) o formato non corretto";
            this.setState({disabled: true});
        }
        else {
            var immagine = document.createElement("img");
            immagine.file = allegato;
            document.getElementById("np-allegato-preview").innerHTML = "";
            document.getElementById("np-allegato-preview").appendChild(immagine);
            this.setState({disabled: false});
            var reader = new FileReader();
            reader.onload = (function(aImg){
				return function(e){
					aImg.src = e.target.result;
                    aImg.width = 300;
					console.log(aImg);
				};
			})(immagine);
			reader.readAsDataURL(allegato);
        }
    }

    render(){
        return (
            <Modal id="np-allegato-modal" show={this.props.show} onHide={this.chiudi}>
                <Modal.Body>
                    <form id="np-nuovo-allegato">
                        <FormGroup>
                            <ControlLabel>Scegli immagine</ControlLabel>
                            <FormControl type="file" name="allegato" accept="image/*" onChange={(e) => this.caricaFile(e)}/>
                        </FormGroup>
                    </form>
                    <div id="np-allegato-preview"></div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.chiudi}>
                        Annulla
                    </Button>
                    <Button bsStyle="primary" onClick={this.salva} disabled={this.state.disabled}>
                        Salva
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}