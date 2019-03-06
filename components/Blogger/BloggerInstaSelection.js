import React, { Component } from 'react';
import $ from 'jquery';
import 'font-awesome/css/font-awesome.min.css';
import tick from '../../images/tick.png';
import "../../styles/instaGallery.css";
import roamerOnly from '../../images/roamer_only.png';
import loading from '../../images/load.gif';
import "../../styles/BloggerSelection.css";
import AddContentModal from "./addContentModal";
import { BrowserRouter as Router,Redirect} from 'react-router-dom';
import { database } from "../../firebase_folder";
import { db } from "../../firebase_folder/firebase";

let selected_img_url;
class BloggerInstaSelection extends Component{
  constructor(props){
    super(props);
    this.redirect_to_selected_img = this.redirect_to_selected_img.bind(this);
    this.getSelectedImage = this.getSelectedImage.bind(this);
    this.slideUp = this.slideUp.bind(this);
    this.setDisplay = this.setDisplay.bind(this);
    this.addComment = this.addComment.bind(this);
    this.populateInputBox = this.populateInputBox.bind(this);
    this.handleSelectedContinue = this.handleSelectedContinue.bind(this);
    this.state={
      imgClicked:false,
      selectedImgURL:null,
      redirect_to_te:false,
    }
  }

slideUp(){
  $('#additional-div-id').show();
  //$(window).scrollTop($('#addContentFormId').offset().top);
  $('html,body').animate({
           scrollTop: $("#addContentFormId").offset().top},
           'slow');
}
setDisplay(){
  console.log("h1");
    $('#additional-div-id').hide();
  let postBtn = document.getElementById('post-btn-id');

}

redirect_to_selected_img(imgURL){
  this.setState(
    {
      selectedImgURL:imgURL,
    }
  )
}

handleSelectedContinue(){
  //Store the images in database.
  let allImagesToBeStored = JSON.parse(localStorage.getItem('urlArrayLocal'));
  let bloggerName = localStorage.getItem('blogger_name');
  let bloggerProfileURL = localStorage.getItem('profile_picture_url');
  console.log(allImagesToBeStored);
  for(let i=0;i<allImagesToBeStored.length;i++){
      let s = allImagesToBeStored[i].selected_img_url;
      let n = s.indexOf("scontent"),q;
       s = s.substr(n);
       n = s.indexOf("/");
       s = s.substr(n+1);
       n = s.indexOf("/");
       s = s.substr(n+1);
       n = s.indexOf("/");
       s = s.substr(n+1);
       q = s.indexOf('?');
       s = s.substr(0,q-4);
       let img_id = s;
    database.createImagesTree(
      img_id,
      allImagesToBeStored[i].selected_img_url,
      allImagesToBeStored[i].location,
      allImagesToBeStored[i].lat,
      allImagesToBeStored[i].lng,
      allImagesToBeStored[i].content,
      bloggerName,
      bloggerProfileURL);

      let latLngId = ((allImagesToBeStored[i].lat).toString() + "+"  +(allImagesToBeStored[i].lng).toString()).replace(".", "_").replace(".","_");
      console.log("latlngID",latLngId);
      database.createLatLongTree(latLngId ,
          img_id,
          allImagesToBeStored[i].selected_img_url,
          allImagesToBeStored[i].location,
          allImagesToBeStored[i].lat,
          allImagesToBeStored[i].lng,
          allImagesToBeStored[i].content,
          bloggerName,
          bloggerProfileURL );

  }


// localStorage.setItem('urlArrayLocal',JSON.stringify([]));

  this.setState(
    {
      redirect_to_te:true,
    }
  )
}

addComment(e){
  e.preventDefault();
  let contentToBeAdded = $('#addContentInputId').val();
  $('#added-content-id').html(contentToBeAdded);
  $('#addContentInputId').val('');
  console.log(contentToBeAdded);

  //set content in local storage to respective userID
      let urlArrayLocal = JSON.parse(localStorage.getItem('urlArrayLocal'));
      let selected_img_url = localStorage.getItem('selected_img_url');
      let urlArrayLocalIndex = -1;
      for(let i=0;i<urlArrayLocal.length;i++){
        if(urlArrayLocal[i].selected_img_url==selected_img_url){
          urlArrayLocalIndex = i;
          break;
        }
      }
      if(urlArrayLocalIndex!=-1){
        urlArrayLocal[urlArrayLocalIndex].content = contentToBeAdded;
        console.log("urlArrayLocal===",urlArrayLocal);
      }
      else{
        let obj = {selected_img_url:selected_img_url,
                  content:contentToBeAdded
                };
        urlArrayLocal.push(obj);
        console.log("urlArrayLocal=",urlArrayLocal);
      }
      localStorage.setItem('urlArrayLocal',JSON.stringify(urlArrayLocal));
//=============================================================================

}

componentDidMount(){
  /*If the slideshow screen appears*/
  if($("body").find(".active").length!=0){
    this.getSelectedImage();
  }

}

populateInputBox(){
  let alreadyAddedContent = document.getElementById('added-content-id').innerHTML;
  $('#addContentInputId').val(alreadyAddedContent);
  console.log('focused');
}
//localStorage me save krna h.
getSelectedImage(){
  setTimeout(function(){
    let e = $(".active");
    selected_img_url= e.children([0]).prop("src");
    console.log(selected_img_url);
    localStorage.setItem('selected_img_url',selected_img_url);
    //setting the location tag: ================================================
    let urlArrayLocal = JSON.parse(localStorage.getItem('urlArrayLocal'));
    let location = "Add Location";
    let content = '';
    let urlArrayLocalIndex = -1;
    for(let i=0;i<urlArrayLocal.length;i++){
      if(urlArrayLocal[i].selected_img_url==selected_img_url){
        if(urlArrayLocal[i].location!=null){
          location = urlArrayLocal[i].location;
        }
        if(urlArrayLocal[i].content!=null){
          content = urlArrayLocal[i].content;
        }

        urlArrayLocalIndex = i;
        break;
      }
    }

document.getElementById('add-location-id').innerHTML=location;
document.getElementById('added-content-id').innerHTML=content;
//===========================================================================
}, 700);

    let URLObject = JSON.parse(localStorage.getItem('URLObject'));
    //console.log(URLObject);
    // if(imgURLFromLocalStorage!=null && imgURLFromLocalStorage!=undefined){
    //
    // }


     /*here we could get the location from the database and change according to the image*/
}

  render(){
    /*This displays the instagram selected images on the slideshow*/
    if(this.state.selectedImgURL==null && !this.state.redirect_to_te){
    const imgTags = this.props.selectedImgURLS.map((url,index) =>{

      let imgid = "instaimg"+index.toString();
      let imgsubcontainerid = "instaimgsubcontainer"+index.toString();
      let imgcarouselid = "imgcarousel"+index.toString();
      if(index==0)
      {
        return(
          <div key={imgcarouselid} className="carousel-item  active">
            <img className="d-block w-100" src={url} alt="Loading"/>
          </div>
        )
      }
      else{
      return (

          <div key={imgcarouselid} className="carousel-item">
            <img className="d-block w-100" src={url} alt="Loading"/>
          </div>
      )}
    });



    const liTags = this.props.selectedImgURLS.map((url,index)=>{
      let liTagId = "liCarousel"+index.toString();
      return(
        <li key={liTagId} data-target="#carouselExampleIndicators" data-slide-to={index}></li>
      )
    })

    return (
      <div>
      <div className="container-fluid selected-img-header" id="entire-content-id">
        <img className="roamerOnly" src={roamerOnly}/>
      </div>

      <div className="container-fluid padding-null" >
      <button type="button" id="continue-btn-id" className="ig-continue-btn" onClick={this.handleSelectedContinue}>Continue</button><br className="break-style-1"/>
      <p className="ig-header-content" >Add location, travel tips and URLS</p>
      <button type="button" id="add-location-id" className="add-location-btn"  data-toggle="modal" data-target="#addContentModal">Add Location</button>
        <AddContentModal/>
{/*carousel slide show==============================================================================*/}
      <div id="carouselExampleIndicators" className="carousel carousel-custom slide" data-ride="carousel" data-interval={false}>
        <ol className="carousel-indicators">
          {liTags}
        </ol>
        <div className="carousel-inner">

              {imgTags}
        </div>
        <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev" onClick={this.getSelectedImage}>
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next" onClick={this.getSelectedImage}>
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>
      </div>
{/*=======================================================================================================*/}

      </div>

      <form className="addContentForm"  id="addContentFormId">
        <input type="text" className="addContentInput" id="addContentInputId" placeholder="Write a comment..." onBlur={this.setDisplay} onFocus={this.populateInputBox} onMouseUp={this.slideUp}/>
        <button type="submit" className="post-btn" id="post-btn-id" onFocus={this.addComment} onClick={this.addComment}>Post</button>
      </form>
      <p className="added-content" id="added-content-id"></p>
      <div className="additional-div" id="additional-div-id"/>
      </div>
    )
  }

  else if(this.state.redirect_to_te){
    return (<Redirect to='/travellerExplorer'/>)
  }

}
}

export default BloggerInstaSelection
