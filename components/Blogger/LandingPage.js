import React, { Component } from 'react';
import $ from 'jquery';
  //two dots to go one level up
import 'font-awesome/css/font-awesome.min.css';
import glowturtle from '../../images/glow_turtle.png';
import logo from './logo.png';
import '../../styles/landing_page.css';
import FbModal from './fbmodal';
import Facebook from './fbLogin';
import turtle from '../../images/turtle-logo.png';



class LandingPage extends Component{
constructor(props){
  super(props);

}

  render(){
    return (
      <div className="landingPageMainDiv container-fluid">

          <img className="LogoStyle centerMe" src={logo} alt="Turtle logo"/>

          <h6 className="subheading">VISUAL SEARCH FOR TRAVEL BLOGS</h6>
          <div>
              <a href="/travellerExplorer" className="turtle-btn"><img id="turtleimgid"
        className="turtleStyle centerMe" src={glowturtle} alt="turtle"/></a>
          </div>

          <p className="sidetext" style={{marginTop:`4vh`}}>Tap the Turtle to Start Roaming</p>
          <br/>
          <a href="#" className="btn btn-roamerlogin centerMe" ><strong>Create a Roamer Account</strong></a>

          <p className='sidetext1'>Sign up to share your travel blog*:</p>

          <button className='btn btn-instalogin centerMe' id="instaloginid" style={{marginTop:`2vh`}} data-toggle="modal" data-target="#fbloginModal"><strong>Sign up with Instagram</strong></button>
          <p id="redirect_to_policy" className="redirect_to_policy"></p>
          <p className='sidetext2'>*Instagram business account only.</p>
          <br/><br/>
              <FbModal setAppState={this.props.setAppState} setPolicyAccepted={this.props.setPolicyAccepted} setInstaAccountId={this.props.setInstaAccountId}/>
      </div>
    );
  }

}

export default LandingPage;
