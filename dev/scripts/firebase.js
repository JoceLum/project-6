import firebase from 'firebase';

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCKKV93VAeKcnntNl43pU5KtIT3pg6aXZE",
    authDomain: "project-6-7f761.firebaseapp.com",
    databaseURL: "https://project-6-7f761.firebaseio.com",
    projectId: "project-6-7f761",
    storageBucket: "project-6-7f761.appspot.com",
    messagingSenderId: "410905838070"
  };
  firebase.initializeApp(config);

  export const provider = new firebase.auth.GoogleAuthProvider();
  export const auth = firebase.auth();
  export default firebase;

