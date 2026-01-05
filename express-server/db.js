const firebase = require('firebase');
const config = require('./config');

const db = firebase.initializeApp({
  apiKey: 'AIzaSyCMu70Q5Vx-8ne1WmHquIqYRGKhURjTZrA',
  authDomain: 'test-project-5c14a.firebaseapp.com',
  projectId: 'test-project-5c14a',
  storageBucket: 'test-project-5c14a.firebasestorage.app',
  messagingSenderId: '1096887051284',
  appId: '1:1096887051284:web:905f55c9289ee838103301',
  measurementId: 'G-7JVHHTSB1K',
});

const firebaseConfig = {};

module.exports = db;
