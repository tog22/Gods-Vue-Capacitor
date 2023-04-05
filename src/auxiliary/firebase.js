/* Based on:
	
	https://dev.to/vbanditv/how-to-add-fcm-firebase-cloud-messaging-to-vuejs-37np)
*/

import firebase from 'firebase/app'
import 'firebase/firebase-messaging'

const firebaseConfig = {
  apiKey: "AIzaSyBGhSRGXLRM1m-nNMFNuJnSKu5AX--6vb0",
  authDomain: "godsgamefbase.firebaseapp.com",
  projectId: "godsgamefbase",
  storageBucket: "godsgamefbase.appspot.com",
  messagingSenderId: "306649763697",
  appId: "1:306649763697:web:228785d43cabe34913b0d0"
};

firebase.initializeApp(firebaseConfig);
export default firebase.messaging()