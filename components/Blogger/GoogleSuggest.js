import PropTypes from "prop-types"
import React from "react"
import $ from 'jquery';
import ReactGoogleMapLoader from "react-google-maps-loader"
import ReactGooglePlacesSuggest from "react-google-places-suggest"
import "../../styles/googleSuggestStyle.css"
const API_KEY = "AIzaSyB8X9GiDl-mPD1j0K6lTEiMhs3D8axW53U"
class GoogleSuggest extends React.Component {
  state = {
    search: "",
    value: "",
  }

  handleInputChange(e) {
    this.setState({search: e.target.value, value: e.target.value})
  }
//this function is called when any location is selected..
  handleSelectSuggest(suggest) {
//set location in local storage to respective userID
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
      urlArrayLocal[urlArrayLocalIndex].location = suggest.formatted_address;
      urlArrayLocal[urlArrayLocalIndex].lat = suggest.geometry.location.lat();
      urlArrayLocal[urlArrayLocalIndex].lng = suggest.geometry.location.lng();
      console.log("urlArrayLocal===",urlArrayLocal);
    }
    else{
      let obj = {selected_img_url:selected_img_url,
                location:suggest.formatted_address,
                lat:suggest.geometry.location.lat(),
                lng:suggest.geometry.location.lng(),
              };
      urlArrayLocal.push(obj);
      console.log("urlArrayLocal=",urlArrayLocal);
    }


document.getElementById('add-location-id').innerHTML=suggest.formatted_address;
    //urlArrayLocal.selected_img_url.location = suggest.formatted_address;

    localStorage.setItem('urlArrayLocal',JSON.stringify(urlArrayLocal));
    console.log(suggest);


    //$('#google-place-suggest-id').val = '';
    $('#addContentModal').modal('toggle');

    this.setState({search: "", value: suggest.formatted_address})
  }

  render() {
    const {search, value} = this.state
    return (
      <ReactGoogleMapLoader
        params={{
          key: API_KEY,
          libraries: "places,geocode",
        }}
        render={googleMaps =>
          googleMaps && (
            <div className="search-box-container">
            <i className="fa fa-search search-icon"></i>
              <ReactGooglePlacesSuggest
                autocompletionRequest={{input: search}}
                googleMaps={googleMaps}
                onSelectSuggest={this.handleSelectSuggest.bind(this)}
              >
                <input
                  id="google-place-suggest-id"
                  className="google-searchbox"
                  autoFocus={true}
                  type="text"
                  value={value}
                  placeholder="Search"
                  onChange={this.handleInputChange.bind(this)}
                />
              </ReactGooglePlacesSuggest>
            </div>
          )
        }
      />
    )
  }
}

GoogleSuggest.propTypes = {
  googleMaps: PropTypes.object,
}

export default GoogleSuggest
