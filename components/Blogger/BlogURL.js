import React, { Component } from 'react';
import $ from 'jquery';
import 'font-awesome/css/font-awesome.min.css';
import tick from '../../images/tick.png';
import "../../styles/instaGallery.css";
import roamerOnly from '../../images/roamer_only.png';
import loading from '../../images/load.gif';
import BloggerInstaSelection from './BloggerInstaSelection';
import { BrowserRouter as Router,Redirect} from 'react-router-dom';
import { db } from "../../firebase_folder/firebase";


class BlogURL extends Component{
  constructor(props){
    super(props);
    this.state ={
      isBlogURL:false,
    }
    this.handleBlogContinue = this.handleBlogContinue.bind(this);
  }


  handleBlogContinue(e){
   e.preventDefault();
    if(document.getElementById("blog-input").value==null || document.getElementById("blog-input").value==""){
      alert("Please enter a URL");
    }
    else{
      let blogURL = document.getElementById("blog-input").value;
      let loggedInUserID = localStorage.getItem('userID');
      db.ref(`BloggerAccounts/${loggedInUserID}`).update({blogURL,});
      this.setState({
        isBlogURL:true
      })
      //localStorage.setItem('isBlogURL',true);
      //this.props.setIsBlogURL(true);

    }

  }

  render(){
    if(!this.state.isBlogURL)
    return(
      <div>
      <div className="container-fluid roamer-header-instagallery"><img className="logo-style-instagallery" src={roamerOnly}/>

      <p className="blog-url-heading" >Please share your Blog or Instagram URL</p>
      <form>
      <input type="text" id="blog-input" required={true} className="blog-url-input" name="blogURL"/>
      <button type="submit" className="blog-continue-btn" onClick={this.handleBlogContinue}>Continue</button>
      </form>
      </div>
      </div>
    )
    else {
      {
        //refresh the entire page when the blogurl is being entered.. 
          window.location.reload();
      }
    }
  }
}

export default BlogURL
