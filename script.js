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
async function loadData() {
    try {
        const snapshot = await db.collection("ringData").get();
        snapshot.forEach((doc, index) => {
            if (index < 28) ringData[index] = doc.data();
        });
        renderGrid();
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// Save ring data to Firebase Firestore
async function saveData(index) {
    try {
        await db.collection("ringData").doc(`ring${index}`).set(ringData[index]);
    } catch (error) {
        console.error("Error saving data:", error);
    }
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
function updateStatus(status) {
    const timestamp = new Date().toLocaleString();
    ringData[currentSquareIndex] = { status, timestamp };
    saveData(currentSquareIndex);
    renderGrid();
    closePopup();
}

// Get the color based on status
function getColor(status) {
    switch (status) {
        case "Open":
        case "Extreme":
            return "green";
        case "Forms":
        case "Weapons":
        case "Combat":
        case "Sparring":
        case "Creative":
            return "orange";
        default:
            return "#ddd";
    }
}

// Load data on page load
window.onload = loadData;
