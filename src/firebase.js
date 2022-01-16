import firebase from 'firebase';

const firebaseConfig = {
	apiKey: 'AIzaSyDx-S_mW7Bg5HbAvkk8WoHjLd4fFBQhQB4',
	authDomain: 'telegram-clone-2.firebaseapp.com',
	databaseURL: 'https://telegram-clone-2.firebaseio.com',
	projectId: 'telegram-clone-2',
	storageBucket: 'telegram-clone-2.appspot.com',
	messagingSenderId: '289374900840',
	appId: '1:289374900840:web:0495d88edc183ab8e6a1dd',
	measurementId: 'G-RYTMLF362G'
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { provider, auth, storage };
export default db;
