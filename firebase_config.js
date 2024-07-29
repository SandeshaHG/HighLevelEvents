const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
} = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBVQKKBhKIq6h8dJrHsxBd-NAFaOwg4AyY",
  authDomain: "firestoreeventshighlevel.firebaseapp.com",
  projectId: "firestoreeventshighlevel",
  storageBucket: "firestoreeventshighlevel.appspot.com",
  messagingSenderId: "131630423147",
  appId: "1:131630423147:web:b0edda0f9f75ca5a90652e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addEvent(timestamp, duration) {
  try {
    const docRef = await addDoc(collection(db, "events"), {
      timestamp: timestamp,
      duration: duration,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function getEvents() {
  try {
    const snapshot = await getDocs(collection(db, "events"));
    const events = [];
    snapshot.docs.map((doc) => {
      events.push({ id: doc.id, ...doc.data() });
    });
    return events;
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
}

module.exports = { addEvent, getEvents };
