import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyANOKyuTRphmK68wQzGlIb6u3wx-crGDis',
  authDomain: 'to-do-app-fem.firebaseapp.com',
  projectId: 'to-do-app-fem',
  storageBucket: 'to-do-app-fem.appspot.com',
  messagingSenderId: '649584923253',
  appId: '1:649584923253:web:8280b7ff31642af5ff5e3c',
};

// init firebase
firebase.initializeApp(firebaseConfig);

// init services
const projectFirestore = firebase.firestore();

// timestamp
const timestamp = firebase.firestore.Timestamp;

export { projectFirestore, timestamp };
