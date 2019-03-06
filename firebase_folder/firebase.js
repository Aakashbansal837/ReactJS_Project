import firebase from 'firebase';

// Web setup:
const config = {
    apiKey: "AIzaSyAb72lB_b1e-RPzw9IYwyZ4NPl_1ocNMxs",
    authDomain: "roamer-main-app.firebaseapp.com",
    databaseURL: "https://roamer-main-app.firebaseio.com",
    projectId: "roamer-main-app",
    storageBucket: "roamer-main-app.appspot.com",
    messagingSenderId: "935050942810"
    };
const app_initializer = firebase.initializeApp(config); //initialize the firebase app by its config.
//to provide firebase authentication.
const db = firebase.database(); //to send/retreive data from db
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider(); //to provide fb auth.

const storage = firebase.storage().ref(); //for using storage for images
export {facebookAuthProvider,app_initializer};

const auth = firebase.auth();
//For traveller
export {
    db,
    auth,
    storage,
};
