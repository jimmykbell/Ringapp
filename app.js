// Firebase configuration and initialization
const firebaseConfig = {
 apiKey: "AIzaSyBa7CfejKs6jApm_u6qKdxeZozg-b8agyk",
  authDomain: "atarings00.firebaseapp.com",
  databaseURL: "https://atarings00-default-rtdb.firebaseio.com",
  projectId: "atarings00",
  storageBucket: "atarings00.firebasestorage.app",
  messagingSenderId: "981428477768",
  appId: "1:981428477768:web:ce13879472db8df2349d7d",
  measurementId: "G-93M7Q2CJVB"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let ringData = Array(28).fill({ status: "Open", timestamp: new Date().toLocaleString() });
let currentSquareIndex = null;

// Load ring data from Firebase Firestore
function loadData() {
    db.collection("ringData").get()
        .then(snapshot => {
            snapshot.forEach((doc, index) => {
                if (index < 28) ringData[index] = doc.data();
            });
            renderGrid();
        })
        .catch(error => {
            console.error("Error loading data:", error);
        });
}

// Save ring data to Firebase Firestore
function saveData(index) {
    db.collection("ringData").doc(`ring${index}`).set(ringData[index])
        .catch(error => {
            console.error("Error saving data:", error);
        });
}

// Render the grid
function renderGrid() {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    ringData.forEach((ring, index) => {
        const square = document.createElement("div");
        square.classList.add("square");
        square.style.backgroundColor = getColor(ring.status);
        square.innerHTML = `<span>${ring.timestamp}</span>`;
        square.addEventListener("click", () => openPopup(index));
        grid.appendChild(square);
    });
}

// Open popup and set the current square index
function openPopup(index) {
    currentSquareIndex = index;
    document.getElementById("popup").classList.add("open");
}

// Close the popup
function closePopup() {
    document.getElementById("popup").classList.remove("open");
}

// Update the ring status and timestamp
