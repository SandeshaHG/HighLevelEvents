const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  setDoc,
  getDocs,
  doc,
  Timestamp,
  arrayUnion,
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

async function addEvent(date, timestamp, duration) {
  try {
    await setDoc(
      doc(db, "events", date),
      {
        timestamp: arrayUnion(Timestamp.fromMillis(timestamp)),
      },
      { merge: true }
    );
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
    console.log("get events", events);
    return events;
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
}

module.exports = { addEvent, getEvents };
