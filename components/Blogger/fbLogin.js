/*all the views of the login popup are displayed here*/
import React, { Component } from 'react';
import $ from 'jquery';
import 'font-awesome/css/font-awesome.min.css';
import tick from '../../images/tick.png';
import FacebookLogin from 'react-facebook-login';
import '../../styles/insta_popup_style.css';
import bluetick from "../../images/bluetick.png";
import { database } from "../../firebase_folder";
import { db , auth } from "../../firebase_folder/firebase";


export default class Facebook extends Component{
  constructor(props)
  {
    super(props);
    this.enableApproveBtn = this.enableApproveBtn.bind(this);
    this.getInsta_baccount = this.getInsta_baccount.bind(this);
    this.redirect_to_gallery = this.redirect_to_gallery.bind(this);
  }
  state={
    isLoggedIn:false,
    isInstaSelected:false,
    userID:'',
    name:'',
    email:'',
    picture:'',
    accessToken:'',
    total_baccounts:0,
  }

  customAuth = (response) => {
      auth.signInWithCustomToken(response.accessToken).catch(function(error) {
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;
          console.log("errorAccured",errorMessage);
          // ...
      });
  };

responseFacebook = response => {
  //if(response.status==undefined)--> no storge in db
  console.log("response=",response);


//If there is a response from fb, then updating or creating user in database(firebase)===========
      if(response.userID!=undefined && localStorage.getItem('userID')!=response.userID){
        console.log("response called--")
          let toBeLoggedInUserID = response.userID;
          let dbResponse = null;
          let blogURLDB = db.ref(`BloggerAccounts/${toBeLoggedInUserID}`);
          blogURLDB.once("value", function(snapshot) {
          dbResponse = snapshot.val();
          });
          //Creating a new user if not present =====================================================
          if(dbResponse==null){
            console.log("created new user in firebase");
          database.createBloggerUser(response.userID,response.name,response.email,response.accessToken,null,null,'blogger');
        }
        //updating the existing user================================================================
        else{
          console.log("Updated in firebase")
          let toBeLoggedInUserID = response.userID;
          db.ref(`BloggerAccounts/${toBeLoggedInUserID}`).update({
            username:response.name,
            email:response.email,
            accessToken:response.accessToken,
            role:'blogger',
          });

        }
    }
    this.customAuth(response);



    //============================================= TC==
    localStorage.setItem('isLoggedIn',true);
      localStorage.setItem('accessToken',response.accessToken);
    localStorage.setItem('userID',response.userID);
    localStorage.setItem('isInstaSelected',false);
    localStorage.setItem('isPolicyApproved',false);
    localStorage.setItem('urlArrayLocal',JSON.stringify([]));
    localStorage.setItem('role','blogger');





  if(response.picture!=undefined){
  this.props.setAppState(true,response.accessToken);


  this.setState(
    {
      isLoggedIn:true,
      accessToken: response.accessToken,
      userID:response.userID,
      name:response.name,
      email:response.email,
      picture:response.picture.data.url,
    }
  );
  let instaloginbtn = document.getElementById('instaloginid');

  if(!this.state.instaChoosen && this.state.isLoggedIn){
  instaloginbtn.click();}

  console.log("******"+this.state.isLoggedIn);
}
else{
  localStorage.setItem('isLoggedIn',false);
  localStorage.setItem('isInstaSelected',false);
  localStorage.setItem('isPolicyApproved',false);
}
}
  componentClicked = () =>{
    //this.facebookAuthFirebase();
    console.log('clicked');
    //this.facebookAuthCustom();

  }
/* Function=========================================================================*/
getInsta_baccount(total_accounts){

console.log(total_accounts);
let selected_account_id = '';
    for(let i=0;i<total_accounts;i++){
      let id = "rbtn"+i.toString();
      let profilePicId = '#insta'+i.toString();
      let usernameId = 'username'+i.toString();
      console.log(id);
      if (document.getElementById(id).checked) {
  selected_account_id = document.getElementById(id).value;
  let  profile_picture_url = $(profilePicId).css('background-image');
       profile_picture_url = profile_picture_url.replace('url(','').replace(')','').replace(/\"/gi, "");
      let blogger_name = document.getElementById(usernameId).innerHTML;
  localStorage.setItem('profile_picture_url',profile_picture_url);
  localStorage.setItem('blogger_name',blogger_name);
  //alert(selected_account_id);
}
}
if(selected_account_id!==''){
  localStorage.setItem('isInstaSelected',true);
  localStorage.setItem('instaAccount',selected_account_id);
this.props.setInstaAccountId(selected_account_id);

this.setState(
  {
    isInstaSelected:true,
  }
)
}



// if(selected_account_id!==''){
//   this.props.setInstaAccountId(selected_account_id);
// }
}

/*redirect_to_gallery =========================================*/
  redirect_to_gallery(){
    /* To automatically close the popup.. =======================*/
    $('#fbloginModal').modal('toggle');
    this.props.setPolicyAccepted();
    localStorage.setItem('isPolicyApproved','true');
  }
  /*enableApproveBtn==============================================*/
enableApproveBtn(){

  let approveBtn = document.getElementById("approveBtnId");
  if(approveBtn.disabled === true){
    approveBtn.disabled = false;
  }
}


  render(){
    let fbContent;
    console.log(this.state.isLoggedIn);

    {/* Instagram business accounts displayed with radio btn============================================================================*/}
    if(localStorage.getItem('isLoggedIn')=='true' && localStorage.getItem('isInstaSelected')!='true'){
      fbContent = "";
      {/*getting the instagram accounts from accesstoken===================================*/}
      let fbpageids = [];
      let fbpageresponse;
      let insta_baccountids = [];
      let insta_usernames = [];
      let selected_baccountids = [];
      {/*getting the page ids================================================================*/}
      let insta_profile_pic = [];
      $.ajax({
              type: 'GET',
              url: 'https://graph.facebook.com/me/accounts?access_token='+localStorage.getItem('accessToken')+'&fields=name',
              dataType: 'json',
              success: function(res){
                fbpageresponse = res.data;
                for(let i=0;i<res.data.length;i++){
                  fbpageids.push(fbpageresponse[i].id);
                };
              },
              error:function(err){ console.log(err);
            },
              async: false
          });

        console.log("Page IDS===========================");
        console.log(fbpageids);
        console.log("Page id length=====",fbpageids.length);
      {/*Fetching the instagram business account ids====================================================*/}
      for(let i=0;i<fbpageids.length;i++){
        $.ajax({
                type: 'GET',
                url: 'https://graph.facebook.com/'+fbpageids[i]+'?access_token='+localStorage.getItem('accessToken')+'&fields=instagram_business_account',
                dataType: 'json',
                success: function(res){
                    if(res.instagram_business_account!==undefined){
                    insta_baccountids.push(res.instagram_business_account.id);

                  }
                  else{
                    console.log("=======================No account=====================",fbpageids[i]);
                  }

                },
                error:function(err){ console.log(err);
              },
                async: false
            });
      }
      console.log("Instagram page ids================================================");
      console.log(insta_baccountids);

      {/*Getting the profile pic url and username====================================================*/}
      if(insta_baccountids.length!==0){
      for(let i=0;i<insta_baccountids.length;i++){
        $.ajax({
                type: 'GET',
                url: 'https://graph.facebook.com/'+insta_baccountids[i]+'?access_token='+localStorage.getItem('accessToken')+'&fields=username,profile_picture_url',
                dataType: 'json',
                success: function(res){

                  insta_usernames.push(res.username);
                  insta_profile_pic.push(res.profile_picture_url);
                  selected_baccountids.push(res.id);
                },
                error:function(err){ console.log(err);
              },
                async: false
            });
      }

      console.log(insta_usernames);
      console.log(insta_profile_pic);
      console.log(selected_baccountids);
      {/*==================================================================================*/}
      console.log("hii");
      {/*generating the radio buttons=========================================================*/}
      let insta_radiobtns = insta_usernames.map((username,index) =>{
        let pic_src = insta_profile_pic[index];
        let row_id = "insta"+index.toString();
        let p_id = "username"+index.toString();
        let div_row= "div_row"+index.toString();
        let radio_btn = "rbtn"+index.toString();

        return (
          <div className="row insta_row" id={div_row}>
            <div className="insta_profile_style" style={{backgroundImage: `url(${insta_profile_pic[index]})`}} id={row_id}></div><p id={p_id} className="username_style">{username}</p><label className="rbcontainer"><input onChange={this.enableApproveBtn} className="input_style" id={radio_btn} type="radio" name="insta_baccount_rbtn" value={selected_baccountids[index]}/><img className="img_tick" /></label>
          </div>
        )
      });
      {/*======================================================================================*/}
      const insta_header = (
        <p className="fbpopup-content"><span className="fbpopup-heading">Connect to Instagram.<br/></span>Select the Instagram Business<br/>Account you want to share:</p>
      );
       insta_radiobtns = (<div className="radio_btn_container"> {insta_radiobtns} </div>);
      const approveBtn = (<button type="button" id="approveBtnId"   className="btn approveBtn"   onClick={()=>this.getInsta_baccount(selected_baccountids.length)}>Approve selection</button>)
      fbContent =  [insta_header,insta_radiobtns,approveBtn];
      /*(
        <p className="fbpopup-content"><span className="fbpopup-heading">Connect to Instagram.<br/></span>Select the Instagram Business<br/>Account you want to share:</p>
      );*/
    }

  /*if there are no business accounts=================================================================*/
    else if(insta_baccountids.length==0){
      const insta_header = (
        <p className="fbpopup-content"><span className="fbpopup-heading">Connect to Instagram.<br/></span>Select the Instagram Business<br/>Account you want to share:</p>
      );

      const approveBtn = (<button type="button" id="approveBtnId" disabled={true} className="btn approveBtn" >Approve selection</button>)

      const msg = (<p className="fbpopup-content">You need to have an <br/> Instagram Business Account</p>);
      fbContent = [insta_header,msg,approveBtn];
    }
  }
  /*Policy  approval popup====================================================================================*/
  else if(localStorage.getItem('isInstaSelected')=='true' && localStorage.getItem('isPolicyApproved')!='true'){

    const insta_header = (
      <p className="fbpopup-content"><span className="fbpopup-heading">Privacy Policy &<br/>Terms of Service Agreement</span><br/><br/>Please read and acknowledge<br/>that you understand and approve<br/>of our <a href="https://www.roamer.world/privacy-policy" className="privacy-link">Privacy Policy</a> and <a href="https://www.roamer.world/terms-of-service-agreement" className="privacy-link">Terms<br/>of Service Agreement</a></p>
    );

    const approveBtn = (<button type="button" id="policyBtnId"  onClick={this.redirect_to_gallery} className="btn approveBtn" >I Accept the "Roamer" Privacy<br/>Policy & Terms of Service</button>)
    fbContent =  [insta_header,approveBtn];

  }
  /*Facebook Login as a Blogger=========================================================================================*/
    else if(!localStorage.getItem('isLoggedIn')){

       fbContent = (
<div>
  <p className="fbpopup-content"><span className="fbpopup-heading">Sign in as an influencer <br/>to share your travel blog.<br/></span><br/>Login to the Facebook Account<br/>connected to your Instagram<br/>Business Account to start <br/> sharing travel tips:</p>
  <div className="fbLogin-btn">
  <FacebookLogin
  appId="212185559399960"

  autoLoad={false}
  fields="name,email,picture"
  onClick={this.componentClicked}
  callback={this.responseFacebook} />
  <p className="dont_post_style">We don't post to Facebook</p>
  </div>
</div>
  );
    }
    return (
      <div>
      {fbContent}
      </div>
    )
  }
}
