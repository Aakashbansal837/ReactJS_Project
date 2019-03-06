//This contains the map with all the markers.
import React from 'react';
import $ from 'jquery';
import BluePinImage_big from "../../images/SavedPinBig.png";
import BluePinImage_small from "../../images/SavedPinSmall.png";
import {roamer_map_styles_default,roamer_map_styles_zoomed} from './roamerMapStyles';
import { db } from "../../firebase_folder/firebase";

let mapStyles = roamer_map_styles_default;
let pinImage = BluePinImage_small;
let scaleValue = 4;
const _ = require("lodash");
const { compose, withProps, lifecycle , withHandlers} = require("recompose");
const {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
} = require ("react-google-maps");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");


let markers =[];

function getAllFirebaseMarkers() {
    let snapshotArray = db.ref("LatLngTree");
    snapshotArray.on('value' , (snapshot)=>{
        for(let value in snapshot.val()){
            let latlngData = (value.replace("_" , ".").replace("_",".").split("+"));
            markers.push({lat : parseFloat(latlngData[0]) , lng: parseFloat(latlngData[1])});
        };
    });
}
getAllFirebaseMarkers();
console.log("markers",markers);


const MapWithAllMarkers = compose(
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
            // eslint-disable-next-line {/*this currently holds the starting state of the map.*/}
            this.setState({
                mapStyles: roamer_map_styles_default,
                bounds: null,
                center: {
                    lat: 30.7333, lng: 76.7794
                },

                markers,
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
                let imagesArrayFromfirebase =[];
                let six_img_urls = [];
                this.props.setSixImgs(six_img_urls);
            }
                },
                // onBoundsChanged: () => {

                //     this.setState({
                //         bounds: refs.map.getBounds(),
                //         center: refs.map.getCenter(),
                //     })

                //     // eslint-disable-next-linex      {/*the bounds will give us the region bounded by the current screen*/}
                //     //console.log('bounds:',this.state.bounds);
                //     // eslint-disable-next-line  {/*the center will give the coordinates of the current screen center.*/}
                //     //console.log("center:" + this.state.center.lng() + " " + this.state.center.lat());

                // },
                onSearchBoxMounted: ref => {
                    refs.searchBox = ref;
                },

                //Changing the styling on zoom of map..
                onZoomChanged: () => {

                    if(refs.map.getZoom()>3){
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
                    // eslint-disable-next-line   {/*this will give us the place id of the place searched in the searchbox*/}
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



        defaultZoom={3}
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




        {markers.map((marker, index) =>
            <Marker icon={{
                url : pinImage,
                scale : 4,
            }}
                    onClick={props.handleMarkerClick}
                    position={{lat:marker.lat , lng : marker.lng}}
                    key={index} zIndex={10} />
        )}


    </GoogleMap>
);

export default MapWithAllMarkers;
