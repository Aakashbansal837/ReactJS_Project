import { db } from './firebase';

// User API
export const createBloggerUser = (id,username,email,accessToken,blogURL,insta_pics,role)=>
db.ref(`BloggerAccounts/${id}`).set({
    username,
    email,
    accessToken,
    blogURL,
    insta_pics,
    role,
});

export const createImagesTree = (imgID,imgURL,location,lat,lng,content,bloggerName,bloggerProfileURL)=>
db.ref(`AllImagesTree/${imgID}`).set({
  imgURL,
  location,
  lat,
  lng,
  content,
  bloggerName,
  bloggerProfileURL,
});

export const createLatLongTree = (id , imageID,imgURL , location,lat ,lng , content ,BloggerName , BloggerPicUrl ) =>
    db.ref(`LatLngTree/${id}/${imageID}`).set({
        imgURL,
        lat ,
        lng ,
        BloggerName ,
        BloggerPicUrl ,
        location ,
        content
    });

// export const getLatLongFromFirebase =() => {
//     let snapshotArray = db.ref("LatLngTree");
//     let latLngArray = [];
//     snapshotArray.on('value' , (snapshot)=>{
//         for(let value in snapshot.val()){
//             let latlngData = (value.replace("_" , ".").replace("_",".").split("+"));
//             latLngArray.push({lat : latlngData[0] , lng:latlngData[1]});
//         };
//         console.log("myArray :",latLngArray);
//     });
// }


//Sending the values to the db
export const doCreateUser = (id, username, email) =>
    db.ref(`TravellerAccounts/${id}`).set({
        username,
        email,
    });
//Recieving the values to the db
export const onceGetUsers = () =>
    db.ref('TravellerAccounts').once('value');

// Other db APIs ...
