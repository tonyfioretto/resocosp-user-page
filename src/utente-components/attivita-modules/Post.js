import React from 'react';
import { Row, Col, Glyphicon, FormGroup, FormControl, Button, Nav, NavDropdown, MenuItem } from 'react-bootstrap';
import './Post.css';
import info from '../../data.json';

export class Post extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            modifica: false
        }

        this.getMese = this.getMese.bind(this);
        this.modificaAction = this.modificaAction.bind(this);
        this.cancellaAction = this.cancellaAction.bind(this);
        this.modificaPost = this.modificaPost.bind(this);

    }

    modificaAction(){
        var modifica = !this.state.modifica;
        this.setState({modifica: modifica});
    }
    
    cancellaAction(){

        var myHeader = new Headers();
        var myInit = {
            method: 'GET',
            headers: myHeader,
            mode: 'cors',
            cache: 'default'
        };
        var requestUrl = info.siteURL + '/wp-admin/admin-ajax.php?action=resocosp_delete_user_post&post_id='+this.props.postId;
        var myRequest = new Request(requestUrl, myInit);
        var self = this;
        fetch(myRequest)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                self.props.callbackParent(data.response, null, 'cancella');
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    modificaPost(){
        var post = document.getElementById("post-modify");
        var postData = new FormData(post);
        postData.append('postID', this.props.postId);
        
        var myHeader = new Headers();
        var myInit = {
            method: 'POST',
            headers: myHeader,
            mode: 'cors',
            cache: 'default',
            body: postData
        };
        var requestUrl = info.siteURL + '/wp-admin/admin-ajax.php?action=resocosp_modify_user_post';
        var myRequest = new Request(requestUrl, myInit);
        var self = this;
        fetch(myRequest)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                self.setState({modifica: false});
                self.props.callbackParent(data.response, postData, 'modifica');
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getMese(mese){
        var meseString;
        switch(mese){
            case '01':
                meseString = 'gennaio';
                break;
            case '02':
                meseString = 'febbraio';
                break;
            case '03':
                meseString = 'marzo';
                break;
            case '04':
                meseString = 'aprile';
                break;
            case '05':
                meseString = 'maggio';
                break;
            case '06':
                meseString = 'giugno';
                break;
            case '07':
                meseString = 'luglio';
                break;
            case '08':
                meseString = 'agosto';
                break;
            case '09':
                meseString = 'settembre';
                break;
            case '10':
                meseString = 'ottobre';
                break;
            case '11':
                meseString = 'novembre';
                break;
            case '12':
                meseString = 'dicembre';
                break;
            default: 
                break;
        }
        return meseString;
    }
    render(){
        var mese = this.getMese(this.props.postData.substring(5,7));
        var data = this.props.postData.substring(8,10)+" "+mese+" "+this.props.postData.substring(0,4)+" "+this.props.postData.substring(11,16);
        if(this.props.postImage !== null){
            var immagine = true;
        }
        return(
            <div className="post-style">
                <Row className="post-header">
                    <Col sm={2} xs={2}>
                            <img src={this.context.imgUtente} alt="" className="post-user-avatar"/>
                    </Col>
                    <Col sm={9} xs={9}>
                        <p className="user-name">
                            <a href={info.siteURL+"/"+this.context.urlUtente}>{this.context.displayName}</a>
                        </p>
                        <p className="post-data">
                            {data}
                        </p>
                    </Col>
                    <Col sm={1} xs={1}>
                        {this.context.utenteStesso &&
                        <Nav>
                            <NavDropdown eventKey="1" id={this.props.postId} title="" className="post-actions" pullRight>
                                <MenuItem eventKey="1.1" onClick={this.modificaAction}>Modifica</MenuItem>
                                <MenuItem eventKey="1.2" onClick={this.cancellaAction}>Cancella</MenuItem>
                            </NavDropdown>
                        </Nav>
                        }
                    </Col>
                </Row>
                <Row className="post-body">
                    <Col sm={2} xs={2} className="post-metainfo">
                        <p>
                            <Glyphicon glyph="star" />
                            <span className="metainfo-counter">{this.props.postLikes}</span>
                        </p>
                        <p>
                            <Glyphicon glyph="share" />
                            <span className="metainfo-counter">{this.props.postShares}</span>
                        </p>
                        <p>
                            <Glyphicon glyph="comment" />
                            <span className="metainfo-counter"></span>
                        </p>
                    </Col>
                    <Col sm={10} xs={10}>
                        {this.state.modifica ? (
                        <form id="post-modify">
                            <FormGroup className="post-modify-group">
                                <FormControl componentClass="textarea"
                                className="np-input-area"
                                name="post_content"
                                id="np-textarea" 
                                defaultValue={this.props.postContent}/>
                                <div>
                                    <Button bsStyle="success" onClick={this.modificaPost}>
                                        <Glyphicon glyph="save" title="Salva modifiche" />
                                    </Button>
                                    <Button bsStyle="danger" onClick={this.modificaAction}>
                                        <Glyphicon glyph="remove" title="Annulla" />
                                    </Button>
                                </div>
                            </FormGroup>
                        </form>
                        ) : (
                            <div className="post-content">
                                <p>{this.props.postContent}</p>
                                {immagine &&
                                    <div className="post-allegati">
                                        <img src={this.props.postImage} alt="" />
                                    </div>
                                }
                            </div>
                        )}
                    </Col>
                    <Col sm={10} xs={10} className="post-comment">
                        <FormGroup>
                            <FormControl componentClass="textarea"                                         
                                         placeholder="Lascia un commento..." />
                        </FormGroup>
                    </Col>
                </Row>

            </div>
        );
    }
}

Post.contextTypes = {
    idUtente: React.PropTypes.number,
    utenteStesso: React.PropTypes.bool,
    displayName: React.PropTypes.string,
    urlUtente: React.PropTypes.string,
    imgUtente: React.PropTypes.string,

}