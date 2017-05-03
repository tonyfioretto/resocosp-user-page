import React from 'react';
import { NuovoPost } from './attivita-modules/NuovoPost';
import { Post } from './attivita-modules/Post';
import './Attivita.css';
import info from '../data.json';

export class Attivita extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            posts: []
        }
    }

    componentDidMount(){
        var self = this;
        var myHeader = new Headers();
        var myInit = {
            method: 'GET',
            headers: myHeader,
            mode: 'cors',
            cache: 'default'
        };
        var requestUrl = info.siteURL + '/wp-admin/admin-ajax.php?action=resocosp_get_user_posts&user_id='+this.context.idUtente;
        var myRequest = new Request(requestUrl, myInit);

        fetch(myRequest)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
//                console.log(data);
                for(var i in data.posts){
                    if(data.posts_meta[i].preferenze === "") data.posts_meta[i].preferenze = "0";
                    data.posts[i].preferenze = data.posts_meta[i].preferenze;
                    if(data.posts_meta[i].condivisioni === "") data.posts_meta[i].condivisioni = "0";
                    data.posts[i].condivisioni = data.posts_meta[i].condivisioni;
                    data.posts[i].immagineURL = data.posts_immagini[i];
                }
                self.setState({posts: data.posts});
            })
            .catch(function (error) {
                console.log(error);
            });
    }
  
    addNewPost(newPost){
        var postsList = this.state.posts;
        postsList.unshift(newPost);
        this.setState({posts: postsList});
    }

    modifyPost(postID, postData, action){

        var postsList = this.state.posts;
        switch(action){
            case 'modifica':
                var i = 0;
                while(i < postsList.length){
                    if(postsList[i].ID === postID){
                        var postIndex = i;
                        break;
                    }
                    i++;
                }
                postsList[postIndex].post_content = postData.get('post_content');
                this.setState({posts: postsList});
                break;
            case 'cancella':
                i = postsList.length -1;
                while(i>=0){
                    if(postsList[i].ID === parseInt(postID, 10)){
                        postsList.splice(i, 1);
                        break;
                    }
                    i--;
                }
                this.setState({posts: postsList});
                break;
            default:
                break;
        }
        

    }

    render(){
        return (
            <div>
                {this.context.utenteStesso &&
                <NuovoPost callbackParent={(newPost => this.addNewPost(newPost))}/>
                }
                <div className="att-user-posts-group">
                    {this.state.posts.map((post) =>
                        <Post key={post.ID} 
                              postId={post.ID} 
                              postContent={post.post_content} 
                              postData={post.post_date}
                              postLikes={post.preferenze}
                              postShares={post.condivisioni}
                              postImage={post.immagineURL}
                              callbackParent={(postID, postData, action) => this.modifyPost(postID, postData, action)}/>
                    )}
                </div>
            </div>
        );
    }
}
Attivita.contextTypes ={
    idUtente: React.PropTypes.number,
    utenteStesso: React.PropTypes.bool
}