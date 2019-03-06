//This contains map along with the  six images.
import { BrowserRouter as Router,Redirect,Link} from 'react-router-dom';
import React, { Component } from 'react';
import $ from 'jquery';
import MapWithAllMarkers from './mapWithAllMarkers';
import roamerOnly from '../../images/roamer_only.png';
import plusIcon from '../../images/plus_icon.png';
import '../../styles/travellerExplorerStyle.css';
import TravellerSelectedImgModal from './travellerSelectedImgModal';
import MapWithSelectedMarker from './mapWithSelectedMarker';
import { db } from "../../firebase_folder/firebase";


let role;
let loggedInUserID;
let isAddIconDisplayed=false;

class TravellerExplorer extends Component{
  constructor(props){
        super(props);
        this.state={
                lat : 30.0777, // default location if location not allowed by user
                lng :70.3424,
                six_img_urls:null,
                selected_lat:null,
                selected_lng:null,
                role:null,
            };
    this.showPosition = this.showPosition.bind(this);
    this.setSixImgs = this.setSixImgs.bind(this);
    this.redirect_to_selected_location = this.redirect_to_selected_location.bind(this);
    this.setDimensions = this.setDimensions.bind(this);
    this.handleAddBtn = this.handleAddBtn.bind(this);
    //localStorage.setItem('shouldInstaDump',true);
  }

  componentWillMount(){
//checking the role is blogger or traveller
// loggedInUserID = localStorage.getItem('userID');
//  let userDBPath = db.ref(`BloggerAccounts/${loggedInUserID}`);
//
//  userDBPath.once("value", function(snapshot) {
//    console.log("Function called.. ")
//    role = snapshot.val().role;
//
//    console.log("role=",role);
//   this.setState({
//     role,
//   });
//  }.bind(this));

role = localStorage.getItem('role')
//checking if any image is selected, getting the lat and lng and rendering that view ========================
    if(this.props.lat!=undefined && this.props.lng!=undefined){
        this.setState(
          {
            selected_lat:this.props.lat,
            selected_lng:this.props.lng,
          }
        )
    }
  }

handleAddBtn(){
  console.log("Add btn clicked");
  
}

setDimensions(){
//setting the position of the comments below the pic=====================================
  setTimeout(function(){
    console.log("called*******");
    let h = $("#selectedImgId").height();
    console.log(h);
    $('#onlyImgContainerId').height(h);
  }, 450);


}


  componentDidUpdate(){
//This is to make the images responsive..===============================================
  if(!isAddIconDisplayed && role=='blogger' ){
    console.log('blogger called');
    $('#add-img-btn-id').css("display", "block");;
    isAddIconDisplayed = true;
  }
  if(document.getElementById("sixinstaimgcontainer0")!=null)
    {
      let width = $("#sixinstaimgcontainer0").width();
      $('.insta-img-container').css({height:width});
      $('.insta-img-style').css({height:"100%"});
      $('.insta-img-style').css({width:"100%"});
      $('.insta-img-subcontainer').css({height:width});

//setting the map so that no space is left on the entire screen===========================
      let viewportHeight = $( window ).height();
      let mapContainerElementHeight = $('#mapContainerid').height();
      let sixImgGridHeight = $('#six_img_gallery_container_id').height();
      let diffOfHeight = (viewportHeight-(sixImgGridHeight+mapContainerElementHeight));
      let newHeight = (mapContainerElementHeight+diffOfHeight);

      if(diffOfHeight>0){
        document.getElementById("mapContainerid").style.height =newHeight.toString()+'px';
      }
//============================================================================================

//Giving random ids to all divs with non-ids to access the google map==========================
      var idCount = 1;
      $('div').each(function() {
        if((($(this).attr('id')))==undefined){
         $(this).attr('id', 'randomId' + idCount);
         idCount++;
       }
      });
//===============================================================================================
    $('#randomId4').height('100%');  //setting the map height 100%;

    }
    //setting the map 2 so that no space is left on the entire screen (selectedMarkerMap)====================
    if($('#mapContainerId2').height()!=undefined){
          let viewportHeight = $( window ).height();
          let viewportWidth = $(window).width();
          let requiredHeight = (viewportWidth/3)*2;
          let newHeight = (viewportHeight-(requiredHeight));
            $('#mapContainerId2').height(newHeight);
        }
  //============================================================================================
  }

redirect_to_selected_location(selectedImgLat,selectedImgLng){
  console.log("called");
   <Redirect to='/instaGallery'/>
}

setSixImgs(six_img_urls){
this.setState({
  six_img_urls,
});
}

  showPosition(position) {
        this.setState({
            lat:position.coords.latitude,
            lng:position.coords.longitude,
        })
      // this will show the current position of the user if allowed.
        console.log("show position:" , this.state.lat , this.state.lng)}

  render(){
//asking for the location and rendering the map components without 6 imgs
  if (navigator.geolocation) {
      (navigator.geolocation.getCurrentPosition(this.showPosition));}
//View when six images are not loaded..===================================================================================================
  if(this.state.lat!=null && this.state.lng!=null && this.state.six_img_urls==null && this.state.selected_lat==null && this.state.selected_lng==null){
    return (
      <div className="container-fluid" style={{margin:0,padding:0}}>
      <div className="mapContainer">
      <img src={roamerOnly} className="te_roamer_only"/>
      <button className="add-img-btn" id="add-img-btn-id" onClick={this.handleAddBtn}><img src={plusIcon} id="plus-icon-id" className="plus_icon_style" /></button>
      <MapWithAllMarkers isMarkerShown={true} lat={this.state.lat} lng={this.state.lng} setSixImgs={this.setSixImgs}/>
      </div>
      </div>
    )
  }
  //when the images are also fetched.==================================================================================
  else if(this.state.six_img_urls!=null && this.state.selected_lat==null && this.state.selected_lng==null){
    const imgTags = this.state.six_img_urls.map((url,index) =>{

      let imgid = "sixinstaimg"+index.toString();
      let imgcontainer = "sixinstaimgcontainer"+index.toString();
      let selected_img_lat = (30.7).toString();
      let selected_img_lng = 70.4;
      let redirect_route = '/travellerExplorer/:'+selected_img_lat.toString()+'/:'+selected_img_lng.toString();
      return (
            <div className= "col-sm-4 col-4 insta-img-container extra-padding"><div className="insta-img-subcontainer extra-padding"  id={imgcontainer} key={imgcontainer}><Link to={redirect_route}><div style={{backgroundImage: `url(${url})`,backgroundSize:"100% 100%",backgroundRepeat:"no-repeat"}} key={imgid} id={imgid} className="insta-img-style"/></Link></div></div>
      )
    });

    return (
      <div className="container-fluid" style={{margin:0,padding:0}}>
      <div className="mapContainer" id="mapContainerid">
      <img src={roamerOnly} className="te_roamer_only"/>
      <button className="add-img-btn" id="add-img-btn-id" onClick={this.handleAddBtn}><img src={plusIcon} id="plus-icon-id" className="plus_icon_style"  /></button>
      <MapWithAllMarkers isMarkerShown={true} lat={this.state.lat} lng={this.state.lng} setSixImgs={this.setSixImgs}/>
      </div>
      <div className="six_img_gallery_container" id='six_img_gallery_container_id'>
      <div className="row">
      {imgTags}
      </div>
      </div>
      </div>
    )
  }
//View when an image is selected ======================================================================
  else if((this.state.selected_lat!=null && this.state.lng!=null)){
//logic to get the imgs from the lat and long of selected img.===========================================
//=======================================================================================================
//Temporary Code =======================================================================================
// const imgTags = this.state.six_img_urls.map((url,index) =>{
//
//   let imgid = "sixinstaimg"+index.toString();
//   let imgcontainer = "sixinstaimgcontainer"+index.toString();
//   let selected_img_lat = (30.7).toString();
//   let selected_img_lng = 70.4;
//   let redirect_route = '/travellerExplorer/:'+selected_img_lat.toString()+'/:'+selected_img_lng.toString();
//   return (
//         <div className= "col-sm-4 col-4 insta-img-container extra-padding"><div className="insta-img-subcontainer extra-padding"  id={imgcontainer} key={imgcontainer}><Link to={redirect_route}><div style={{backgroundImage: `url(${url})`,backgroundSize:"100% 100%",backgroundRepeat:"no-repeat"}} key={imgid} id={imgid} className="insta-img-style"/></Link></div></div>
//   )
// });
//=====================================================================================================
      return (
        <div className="container-fluid" style={{margin:0,padding:0}}>
        <div className="mapContainer" id="mapContainerId2">
        <p className="locationTag" id="locationTagId">Display location tag Here </p>
        <MapWithSelectedMarker isMarkerShown={true} lat={this.state.lat} lng={this.state.lng} setSixImgs={this.setSixImgs}/>
        </div>
        <div className="six_img_gallery_container" id='six_img_gallery_container_id'>
        <div className="row">
        {/*//replaced by the gallery view==============================================================*/}
        <button onClick={this.setDimensions} className="selectedImgs-btn" data-toggle="modal" data-target="#travellerSelectedImgModal">
        <img src="https://scontent.xx.fbcdn.net/v/t51.2885-15/34523256_464068830715754_2264772375855759360_n.jpg?_nc_cat=0&oh=b9e1987d0e46cdbd82dcfd5e4854f1e7&oe=5BAC0F94" style={{height:"100px",width:"100px"}}/>
        </button>

        </div>
        </div>
         <TravellerSelectedImgModal selectedImgURL={"https://scontent.xx.fbcdn.net/v/t51.2885-15/34523256_464068830715754_2264772375855759360_n.jpg?_nc_cat=0&oh=b9e1987d0e46cdbd82dcfd5e4854f1e7&oe=5BAC0F94"}/>
        </div>
      )



  }
  else{
    return (
      <h1> Hello Traveller img not selected</h1>
    )

  }

  }
}


export default TravellerExplorer
