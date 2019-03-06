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

let blogURLFromDB = null;
let accessToken = null;
let fetchedMediaArray = false;
let loggedInUserID = null;


class InstaGalleryDump extends Component{
  constructor(props){
    super(props);
    this.state={
      imgURLS:null,
      selectedImgURLS:null,
      logInAgain:false,  //new
      //isBlogURL:false,  //new
      loading:true,
    }

    this.displayTick = this.displayTick.bind(this);
    this.setSelectedImages = this.setSelectedImages.bind(this);

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


componentWillMount(){


//==========================================================================
let allInstaImgURLS = JSON.parse(localStorage.getItem('allInstaImgURLS'));
let allInstaImgURLSId = [];
let toBeDisplayedURLS = [];
      //logic to compare with firebase_comparison
      //After comparing set the state to the imgURLS.
      allInstaImgURLS = JSON.parse(localStorage.getItem('allInstaImgURLS'));
      console.log(allInstaImgURLS);
      for(let i=0;i<allInstaImgURLS.length;i++){
        let s = allInstaImgURLS[i];
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
         allInstaImgURLSId.push(s);
      }


      for(let i=0;i<allInstaImgURLSId.length;i++){
        let imgTreePath = db.ref(`AllImagesTree/${allInstaImgURLSId[i]}`);
        console.log("imgtree", imgTreePath);
        imgTreePath.once("value", function(snapshot) {
          if(snapshot.val()==null){
            toBeDisplayedURLS.push(allInstaImgURLS[i]);
            this.setState({
              imgURLS:toBeDisplayedURLS
            })
          }

    }.bind(this));
      }


//         this.setState({
//           imgURLS:["https://scontent.xx.fbcdn.net/v/t51.2885-15/14240889_1091508224258392_468820574_n.jpg?_nc_cat=0&oh=70ad9060b5319a4e645d097fb7ef3788&oe=5BD45C27",
// "https://scontent.xx.fbcdn.net/v/t51.2885-15/22352174_582725335452169_5925942343101317120_n.jpg?_nc_cat=0&oh=98bd5e36995178db2b30b7494534ac53&oe=5BE3404C",
// "https://scontent.xx.fbcdn.net/v/t51.2885-15/26869206_2026705684284466_1653707565969702912_n.jpg?_nc_cat=0&oh=7b8fc83e5ab771935cc57cdb76831adc&oe=5BD5A6CC",
// "https://scontent.xx.fbcdn.net/v/t51.2885-15/34523256_464068830715754_2264772375855759360_n.jpg?_nc_cat=0&oh=b9e1987d0e46cdbd82dcfd5e4854f1e7&oe=5BAC0F94",
// ]
//         })

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
    if(this.state.imgURLS!=null && this.state.selectedImgURLS==null && !this.state.logInAgain ){
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
  else if(this.state.imgURLS==null && this.state.selectedImgURLS==null && !this.state.logInAgain )
  {

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
  else if(!this.state.logInAgain ){
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
  else if(this.state.logInAgain)
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

else if(this.state.loading && !this.state.logInAgain){
  return(<h1>Loading</h1>)
  }

  }
}

export default InstaGalleryDump;
