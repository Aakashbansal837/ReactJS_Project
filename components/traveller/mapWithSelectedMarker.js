//this is the map with only the selected marker.
import React from 'react';
import $ from 'jquery';
import BluePinImage_big from "../../images/SavedPinBig.png";
import BluePinImage_small from "../../images/SavedPinSmall.png";
import {roamer_map_styles_default,roamer_map_styles_zoomed} from './roamerMapStyles';

let mapStyles = roamer_map_styles_default;
let pinImage = BluePinImage_big;
let scaleValue = 8;
const _ = require("lodash");
const { compose, withProps, lifecycle , withHandlers} = require("recompose");
const {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
} = require ("react-google-maps");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");


const selectedMarker =[{lat:30.7, lng:74.785}];


const MapWithSelectedMarker = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyB8X9GiDl-mPD1j0K6lTEiMhs3D8axW53U&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `65vh` }} />,
        mapElement: <div style={{ height: `100%` }} />,

    }),
    withHandlers({
        handleMarkerClick : () => () =>{
            console.log("markerCLicked");
            },


    }),
    lifecycle({




        componentWillMount() {
            const refs = {}
            // {/*this currently holds the starting state of the map.*/}
            this.setState({
                mapStyles: roamer_map_styles_default,
                bounds: null,
                center: {
                    lat: selectedMarker[0].lat, lng: selectedMarker[0].lng
                },

                markers:selectedMarker,
                onMapMounted: ref => {
                    refs.map = ref;
                    console.log("mounted");
                    //console.log(this.state.markers);
                },
                onMapIdle: () =>{
                    let b = refs.map.getBounds();
                    const NELat = b.getNorthEast().lat();
                    const SWLat = b.getSouthWest().lat();
                    const NELng = b.getNorthEast().lng();
                    const SWLng = b.getSouthWest().lng();
                    const SELat = b.getNorthEast().lat();
                    const SELng = b.getSouthWest().lng();
                    const NWLat = b.getSouthWest().lat();
                    const NWLng = b.getNorthEast().lng();

                    this.setState({
                        bounds: refs.map.getBounds(),
                        center: refs.map.getCenter(),
                    })

                    let markers = this.state.markers;

                   if (markers) {
                  const foundMarkers = markers.filter(marker => {
                    if (
                      marker.lat>SWLat && marker.lat<SELat && marker.lng>SWLng && marker.lng<NELng
                    ){
                      return marker;
                    }
                  });
                console.log("foundMarkers",foundMarkers);
                let six_img_urls = [
                  "https://scontent.xx.fbcdn.net/v/t51.2885-15/34983459_202777683876783_1899543956325138432_n.jpg?_nc_cat=0&oh=3fd47e68f3e70cb38cb4c4666d4c9d4f&oe=5B9F094A",
"https://scontent.xx.fbcdn.net/v/t51.2885-15/33913486_436226256851658_2225749299436716032_n.jpg?_nc_cat=0&oh=cba65baf1de965e4c559b22f364c2e5f&oe=5BE6F1B7",
"https://scontent.xx.fbcdn.net/v/t51.2885-15/34373623_1931053380241210_711559459700211712_n.jpg?_nc_cat=0&oh=1a362a7d72ca4905265952d5c06dcad4&oe=5BA314EB",
"https://scontent.xx.fbcdn.net/v/t51.2885-15/34523256_464068830715754_2264772375855759360_n.jpg?_nc_cat=0&oh=b9e1987d0e46cdbd82dcfd5e4854f1e7&oe=5BAC0F94",
"https://scontent.xx.fbcdn.net/v/t51.2885-15/34982515_1749515191771150_6842505084375400448_n.jpg?_nc_cat=0&oh=eadc170c99cec29029c2db24e9e706b5&oe=5BA4CABC",
"https://scontent.xx.fbcdn.net/v/t51.2885-15/34982515_1749515191771150_6842505084375400448_n.jpg?_nc_cat=0&oh=eadc170c99cec29029c2db24e9e706b5&oe=5BA4CABC"];
                this.props.setSixImgs(six_img_urls);
            }
                },

                //Changing the styling on zoom of map..
                onZoomChanged: () => {

                    if(refs.map.getZoom()>5){
                        mapStyles = roamer_map_styles_zoomed;
                        pinImage = BluePinImage_big;
                        scaleValue = 8;
                    }
                    else{
                        mapStyles = roamer_map_styles_default;
                        pinImage = BluePinImage_small;
                        scaleValue = 4;
                    }
                },
                onPlacesChanged: () => {
                   {/*this will give us the place id of the place searched in the searchbox*/}
                    const places = refs.searchBox.getPlaces();
                    if (typeof (places[0]) !== 'undefined'){
                        this.setState({
                            placeId : places[0].place_id,
                        });
                        // eslint-disable-next-line    {/*gives the id of the location searched in  the search box.*/}
                        //console.log("PlaceId:" +  this.state.placeId);
                    }

                    const bounds = new window.google.maps.LatLngBounds();
                    places.forEach(place => {
                        if (place.geometry.viewport) {
                            bounds.union(place.geometry.viewport)
                        } else {
                            bounds.extend(place.geometry.location);
                            console.log("position:",places.geometry.location);
                        }
                    });

                    const nextMarkers = places.map(place => ({
                        position: place.geometry.location,
                        placeName : place.geometry.name,
                    }));
                    //console.log("next marker : ", nextMarkers);
                    const nextCenter = _.get(nextMarkers, '0.position', this.state.center);
                    // console.log("NEXT center : " + nextCenter);
                    this.setState({
                        center: nextCenter,
                        markers: nextMarkers,
                    });
                    // refs.map.fitBounds(bounds);

                },
            })
        },
    }),
    withScriptjs,
    withGoogleMap
)(props =>

    <GoogleMap

        ref={props.onMapMounted}
//to apply styles and hide all the controls
   options={{
      styles:mapStyles,

    disableDefaultUI: true,
   }}



        defaultZoom={5}
        center={props.center}

        place = {props.place}
        onIdle={props.onMapIdle}

        onZoomChanged={props.onZoomChanged}
    >{props.isMarkerShown && (
            <Marker icon = {{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: scaleValue
            }}   position={{lat:props.lat,lng : props.lng}} />
        )}




        {selectedMarker.map((marker, index) =>
            <Marker icon={{
                url : pinImage,
                scale : 4,
            }}
                    onClick={props.handleMarkerClick}
                    position={{lat:marker.lat , lng : marker.lng}}  key={index} />
        )}


    </GoogleMap>
);

export default MapWithSelectedMarker;
