import React, { Component } from 'react';
import 'jquery/dist/jquery.min.js';
import 'popper.js/dist/popper.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router,Redirect} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import InstaGallery from './components/Blogger/InstaGallery';
import InstaGalleryDump from './components/Blogger/instaGalleryDump';
import LandingPage from './components/Blogger/LandingPage';
import logo from './logo.png';
import BloggerInstaSelection from './components/Blogger/BloggerInstaSelection';
import TravellerExplorer from './components/traveller/travellerExplorer';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      isLoggedIn:false,
      accessToken:'',
      selectedInstaAccountId:null,
      isPolicyAccepted:false,
      selectedImgURLS:null,

    }
    this.setAppState = this.setAppState.bind(this);
    this.setInstaAccountId = this.setInstaAccountId.bind(this);
    this.setPolicyAccepted = this.setPolicyAccepted.bind(this);
    this.setSelectedImages = this.setSelectedImages.bind(this);

   }

  setAppState(isLoggedIn,accessToken){
    this.setState(
      {
        isLoggedIn,
        accessToken,
      }
    );

  }

  setInstaAccountId(selectedInstaAccountId){
    //console.log("in app",selectedInstaAccountId);
    this.setState({selectedInstaAccountId,}
  )

  }

  setSelectedImages(selectedImgURLS){
      this.setState({selectedImgURLS,})
  }



  setPolicyAccepted(){
    this.setState({
      isPolicyAccepted:true,
    })
  }

  render() {
    return (
      <div>
        <Router>
        <div>

        <Route path="/instaGallery" exact strict render={
          ()=>{

                const url = "https://graph.facebook.com/17841402224576486/media?access_token="+localStorage.getItem('accessToken');
            return (
              <div>

              <InstaGallery accessToken={this.state.accessToken} url={url} setSelectedImages={this.setSelectedImages}/>
              </div>
            );
        }
        }/>

        <Route path="/" exact strict render={
          ()=>(
            (localStorage.getItem('isPolicyApproved')!='true') ? <LandingPage setPolicyAccepted={this.setPolicyAccepted} setAppState={this.setAppState} setInstaAccountId={this.setInstaAccountId}/> : (<Redirect to="/instaGallery" />)
          )
        }/>

        <Route path="/selectedImages" exact strict render={
          ()=>{

            let sURLS = JSON.parse(localStorage.getItem('selectedImgURLS'));
            console.log(sURLS);
            if(sURLS!=null){
            return (
              <BloggerInstaSelection selectedImgURLS={sURLS}/>
            )}
            else{
              return(
              <h1>Hello</h1>)
            }
          }

        }/>

        <Route path="/InstaGalleryDump" exact strict render={
          ()=>{


            return (
              <InstaGalleryDump />
            )}
          }
        />

        <Route path="/travellerExplorer" exact strict render={
          ()=>{

            return (
              <TravellerExplorer />
            )
          }

        }/>
        <Route path="/travellerExplorer/:lat/:lng" exact strict render={
          (props)=>{

            return(
              <TravellerExplorer lat={props.match.params.lat} lng={props.match.params.lng}/>
            )
          }

        }/>

        </div>
        </Router>
      </div>
    );
  }
}

export default App;
