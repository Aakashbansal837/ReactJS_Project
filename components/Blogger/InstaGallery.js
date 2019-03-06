import React, { Component } from 'react';
import $ from 'jquery';
import 'font-awesome/css/font-awesome.min.css';
import tick from '../../images/tick.png';
import "../../styles/instaGallery.css";
import roamerOnly from '../../images/roamer_only.png';
import loading from '../../images/load.gif';
import BloggerInstaSelection from './BloggerInstaSelection';
import { BrowserRouter as Router,Redirect} from 'react-router-dom';
import BlogURL from './BlogURL';
import { db } from "../../firebase_folder/firebase";
import InstaGalleryDump from './instaGalleryDump'

let blogURLFromDB = null;
let accessToken = null;
let fetchedMediaArray = false;
let loggedInUserID = null;
let shouldInstaDump = localStorage.getItem('shouldInstaDump');

class InstaGallery extends Component{
  constructor(props){
    super(props);
    this.state={
      mediaID:null,
      mediaIDArray:null,
      imgURLS:null,
      selectedImgURLS:null,
      isGalleryViewOn:false,
      logInAgain:false,  //new
      isBlogURL:false,  //new
      loading:true,
    }

    this.pushInArray = this.pushInArray.bind(this);
    this.displayTick = this.displayTick.bind(this);
    this.setSelectedImages = this.setSelectedImages.bind(this);
    this.fetchMediaArray = this.fetchMediaArray.bind(this);
  }


pushInArray(){
  var mediaID = [];
  var imageURLS = [];
  for(let i=0;i<this.state.mediaID.data.length;i++){
    mediaID.push(this.state.mediaID.data[i].id);
  }
  this.setState({
    mediaIDArray:mediaID,
  })

  imageURLS = JSON.parse(localStorage.getItem('allInstaImgURLS'));
  console.log("imageURLS=",imageURLS);
  if(imageURLS == null)
  { imageURLS = [];
//getting the img urls================================================================
for(let i=0;i<this.state.mediaIDArray.length;i++)
{
  let firebaseInstaImgObject = {};
  let media_count = 0;


  $.ajax({
          type: 'GET',
          url: 'https://graph.facebook.com/'+this.state.mediaIDArray[i]+'/?fields=media_url&access_token='+accessToken,
          dataType: 'json',
          success: function(res){
          //Remove any kind of videos of instagram.
          if(!res.media_url.includes('mp4')){
              imageURLS.push(res.media_url);
              //add to firebase

              media_count++;
              console.log("firebase",imageURLS);
              //storing the image urls in local storage..
              localStorage.setItem('allInstaImgURLS',JSON.stringify(imageURLS));
              // db.ref(`BloggerAccounts/${loggedInUserID}`).update({insta_pics:imageURLS});
          }
            this.setState(
              {
                imgURLS:imageURLS
              }
            )
          }.bind(this),
          error:function(err){ console.log(err);},
          async: true
      });
    }
  }
  //if the images are fetched once from instagram then the localStorage has the urls, thus simply setting the state.
    else{
      this.setState(
        {
          imgURLS:imageURLS
        }
      )
    }
}


/*SetSelectedImages function======================================================================*/
/*To get all the selected images url=============================================================*/
setSelectedImages(){

  let selectedImages = [];
  for(let i=0;i<this.state.imgURLS.length;i++){
    let id='tick'+i.toString();
    if(document.getElementById(id).style.display=='block'){
      let imgid = 'instaimg'+i.toString();
      selectedImages.push(document.getElementById(imgid).style.backgroundImage.slice(4, -1).replace(/"/g, ""));
    }
  }
  console.log("selected Images");
  console.log(selectedImages);
  this.setState(
    {
      selectedImgURLS:selectedImages,
    }
  )
}

displayTick(ind){
    let tickElement = document.getElementById(ind);
    if(tickElement.style.display=='none'){
      tickElement.style.display='block';
    }
    else{
      tickElement.style.display='none';
    }
}

fetchMediaArray(){
  if(this.state.isBlogURL ){
      //fetching the array of all the media ids --> this is the initial step=========================================
      //Also To detect whether the user needs to login again or not.=====================================================
        let initialURL = this.props.url;

        $.ajax({
                type: 'GET',
                url: initialURL,
                dataType: 'json',
                success: function(res){
                  this.setState({
                    mediaID:res,
                  })
                  fetchedMediaArray=true;
                  this.pushInArray();
                }.bind(this),
                error:function(err){
                  console.log(err.responseJSON.error.message);
                  //setting the state in order to redirect to the LandingPage
                  this.setState({
                    logInAgain:true,

                  })
                  fetchedMediaArray=true;
                }.bind(this),
                async: true
            });
      console.log("blogURL state=",this.state.isBlogURL);
      console.log("loginagain state=",this.state.logInAgain);
  }

}

componentWillMount(){
  {

//checking the blogURL is there or not==========================================================
   loggedInUserID = localStorage.getItem('userID');
    let blogURLDBPath = db.ref(`BloggerAccounts/${loggedInUserID}`);

    blogURLDBPath.once("value", function(snapshot) {
      console.log("Function called.. ")
      blogURLFromDB = snapshot.val().blogURL;
      accessToken = snapshot.val().accessToken;

      console.log(blogURLFromDB);
      if(blogURLFromDB!=null){
        console.log("state changed");
        this.setState({
          isBlogURL:true,
          loading:false,

        });
      }
      else{
        this.setState({
          loading:false,
        });
      }
    }.bind(this));
}



setTimeout(function(){
  console.log("didmount",this.state.isBlogURL);
  this.fetchMediaArray(); }.bind(this),
 5000);

}

componentDidUpdate(){
//This is to make the images responsive..
if(document.getElementById("instaimgcontainer0")!=null)
  {
    let width = $("#instaimgcontainer0").width();
    //alert(width);
    $('.insta-img-container').css({height:width});
    $('.insta-img-style').css({height:width});
    $('.insta-img-subcontainer').css({height:width});
  }
}





  render(){

/*Insta-Gallery View====================================================================================*/
    if(this.state.imgURLS!=null && this.state.selectedImgURLS==null && !this.state.logInAgain && this.state.isBlogURL && !shouldInstaDump){
      {
      //all the img tags

      const imgTags = this.state.imgURLS.map((url,index) =>{

        let imgid = "instaimg"+index.toString();
        let imgcontainer = "instaimgcontainer"+index.toString();
        let subimgcontainer = "subinstaimgcontainer"+index.toString();
        let tickid = "tick"+index.toString();

        return (
              <div key={imgcontainer} className= "col-sm-3 col-3 insta-img-container"><div className="insta-img-subcontainer" id={subimgcontainer} key={subimgcontainer}><div style={{backgroundImage: `url(${url})`,backgroundSize:"100% 100%",backgroundRepeat:"no-repeat"}} key={imgid} id={imgid} className="insta-img-style" onClick={() => this.displayTick(tickid)}><img src={tick} id={tickid} style={{display:'none',}} className="selectedImg"/></div></div></div>
        )
      });
      //console.log("imgTags",imgTags);




    return (
      <div>
      <div className="container-fluid roamer-header-instagallery"><img className="logo-style-instagallery" src={roamerOnly} />
      <button type="button" id="continue-btn-id" className="ig-continue-btn" onClick={this.setSelectedImages}>Continue</button>
      <p className="ig-header-content-1" >Tap to select images to share in Roamer</p>
      </div>

      <div className="container-fluid margin-padding-null">

      <div className="row">
      {imgTags}
      </div>
      </div>
      </div>
    )
  }

}

/*Loading View=====================================================================================================*/
  else if(this.state.imgURLS==null && this.state.selectedImgURLS==null && !this.state.logInAgain && this.state.isBlogURL && !shouldInstaDump)
  {
    console.log("StateNow",this.state.isBlogURL);
    return(
      <div>
      <div className="container-fluid roamer-header-instagallery"><img className="logo-style-instagallery" src={roamerOnly}/>
      <button type="button"  id="continue-btn-id" className="ig-continue-btn">Continue</button>
      <p className="ig-header-content-1">Tap to select images to share in Roamer</p>
      </div>
      <img className="loading" src={loading}/>
      </div>
    )
  }
/*Rendering the BloggerInstaSelection component===================================================*/
  else if(!this.state.logInAgain && this.state.isBlogURL && !shouldInstaDump){
    //this.props.setSelectedImages(this.state.selectedImgURLS);
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%");
    console.log(this.state.selectedImgURLS);
    /*render the component when the images are fetched========================*/
    if(this.state.selectedImgURLS !== null){
      localStorage.setItem('selectedImgURLS',JSON.stringify(this.state.selectedImgURLS));
      return (

        <Redirect to="/selectedImages" />



    )
    }
    /*Till the images are not fetched =========================================*/
    else {
      return (
        <h1>Tushar</h1>
      )
    }

  }
//Login again view================================================================================
  else if(this.state.logInAgain && !shouldInstaDump)
  {
    localStorage.removeItem("isPolicyApproved");
    localStorage.removeItem("instaAccount");
    localStorage.removeItem("isInstaSelected");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userID");
    localStorage.removeItem("selectedImgURLS");
    localStorage.removeItem("accessToken");

    return (<Redirect to="/" />)
  }

  else if(!this.state.isBlogURL && !this.state.loading && !this.state.logInAgain && !shouldInstaDump)
{
  return(<BlogURL />)
}
else if(this.state.loading && !this.state.logInAgain && !shouldInstaDump){
  return(<h1>Loading</h1>)
}
else if(shouldInstaDump){
  return (<Redirect to='/instaGalleryDump'/>)
}

  }
}

export default InstaGallery;
