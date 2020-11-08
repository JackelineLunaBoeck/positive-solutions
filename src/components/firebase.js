import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyC7oJoM8DhkSOKFESPy7zpgcpx-X9iOLoc",
    authDomain: "positivesolution-f40a1.firebaseapp.com",
    databaseURL: "https://positivesolution-f40a1.firebaseio.com",
    projectId: "positivesolution-f40a1",
    storageBucket: "positivesolution-f40a1.appspot.com",
    messagingSenderId: "974715181483",
    appId: "1:974715181483:web:4cef761c1c626ee2fe5aee",
    measurementId: "G-JZXVC3JRZT"
  };
 
  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();
  
  export default firebaseApp.firestore();
  export { db, auth, storage };