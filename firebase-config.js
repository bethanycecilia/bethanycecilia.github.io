// Firebase config for Joe's Bookshelf
const firebaseConfig = {
  apiKey: "AIzaSyAQ7tu132gIIlMNHjd3vQVD-M_3Ln7R2JM",
  authDomain: "bookshelf-a9a41.firebaseapp.com",
  projectId: "bookshelf-a9a41",
  storageBucket: "bookshelf-a9a41.firebasestorage.app",
  messagingSenderId: "109345995230",
  appId: "1:109345995230:web:b3806df9daede197b5054f",
  databaseURL: "https://bookshelf-a9a41-default-rtdb.firebaseio.com/"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
