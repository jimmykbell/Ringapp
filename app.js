// Initialize Firebase (if not already done)
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

// Load ring data from Firebase Firestore when the page loads
function loadData() {
    db.collection("ringData").get()
        .then(snapshot => {
            snapshot.forEach((doc, index) => {
                if (index < 28) {
                    // Update ringData array with data from Firebase
                    ringData[index] = doc.data();
                }
            });
            renderGrid(); // Re-render the grid with the data from Firebase
        })
        .catch(error => {
            console.error("Error loading data:", error);
        });
}

// Save updated data to Firebase Firestore
function saveData(index) {
    db.collection("ringData").doc(`ring${index}`).set(ringData[index])
        .catch(error => {
            console.error("Error saving data:", error);
        });
}

// Render the grid with the data (from Firebase or default values)
function renderGrid() {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    ringData.forEach((ring, index) => {
        const square = document.createElement("div");
        square.classList.add("square");
        square.style.backgroundColor = getColor(ring.status);
        
        const timestampFormatted = new Date(ring.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        square.innerHTML = `
            <span class="timestamp">${timestampFormatted}</span>
            <span class="ring-number">${index + 1}</span>
            <span class="status-text">${ring.status}</span>
        `;
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

// Update the ring status and timestamp, then save it to Firebase
function updateStatus(status) {
    const timestamp = new Date().toLocaleString();
    ringData[currentSquareIndex] = { status, timestamp };
    saveData(currentSquareIndex);  // Save to Firebase
    renderGrid();  // Re-render the grid to show changes
    closePopup();
}

// Get the color based on status
function getColor(status) {
    switch (status) {
        case "Open":
        case "Extreme":
            return "green"; // Open and Extreme turn green
        case "Forms":
        case "Weapons":
        case "Combat":
            return "red"; // Forms, Weapons, Combat turn red
        case "Sparring":
        case "Creative":
            return "orange"; // Sparring and Creative turn orange
        default:
            return "#ddd"; // Default color
    }
}

// Load data from Firebase on page load
window.onload = loadData;
