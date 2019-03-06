import React, { Component } from 'react';
import $ from 'jquery';
import roamerOnly from '../../images/roamer_only.png';
import '../../styles/travellerSelectedImgModalStyle.css';
import savePin from "../../images/SavedPinBig.png";
import 'font-awesome/css/font-awesome.min.css';
import demo from '../../images/3.jpg';

class TravellerSelectedImgModal extends Component{
  componentWillUpdate(){

  }
  render()
  {

    return (
        <div className="modal fade " id="travellerSelectedImgModal" tabIndex="-2" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
            <div className="modal-dialog travellerSelectedImgModalStyle" role="document">
                <div className="modal-content modal-content-custom-tsim">
                    <div className="modal-body modal-body-custom-tsim">
                    <button className="back-btn" data-dismiss="modal">Back</button>
                      <img src={roamerOnly} className="tsim_roamer_only"/>

                      <div className="tsim_subheading_container">
                      <div className="blogger_pic_tsim" style={{backgroundImage:`url(${demo})`, backgroundSize:'cover'}} />
                      <p className="bloggerName_tsim">Blogger Name</p>
                      <button className="visit-blog-btn">Visit Blog</button>
                      </div>

                      <div className="selectedImgContainer container-fluid">
                      <p className="locationTag-tsim">Location</p>
                      <div className="onlyImgContainer-tsim container-fluid" id="onlyImgContainerId">
                      <img src={this.props.selectedImgURL} className="selectedImg-tsim" id="selectedImgId"/>
                      <button className="btn-pin"><img src={savePin} className="savePin-tsim"/></button>
                      </div>

                      <p className="imgDescription-tsim">This is just a demo content to display on front end.This is just a demo content to display on front end.This is just a demo content to display on front end. </p>
                      </div>

                    </div>
                </div>
            </div>
        </div>
    );

  }
}

export default TravellerSelectedImgModal
