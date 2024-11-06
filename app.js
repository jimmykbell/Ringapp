// Firebase configuration
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Ring data array (28 rings)
let ringsData = Array(28).fill({
    status: 'OPEN',
    timestamp: Date.now(),
    stacked: false
});

// Render the grid of 28 rings
function renderGrid() {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";  // Clear the grid before re-rendering

    ringsData.forEach((ring, index) => {
        const square = document.createElement("div");
        square.classList.add("square", getStatusColorClass(ring.status));
        
        // Insert ring data: timestamp, number, and status text
        square.innerHTML = `
            <span class="timestamp">${new Date(ring.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span class="ring-number">${index + 1}</span>
            <span class="status-text">${ring.status}</span>
            <input type="checkbox" class="stacked-toggle" ${ring.stacked ? 'checked' : ''} />
        `;

        // Event listener to open the popup when the square is clicked
        square.addEventListener("click", () => openPopup(index));
        grid.appendChild(square);
    });
}

// Get the color for each status
function getStatusColorClass(status) {
    switch (status) {
        case 'OPEN':
        case 'EXTREME':
            return 'green';
        case 'FORMS':
        case 'WEAPONS':
        case 'COMBAT':
            return 'red';
        case 'SPARRING':
        case 'CREATIVE':
            return 'orange';
        default:
            return '';
    }
}

// Open the popup to select a new status
let selectedRingIndex = null;

function openPopup(index) {
    selectedRingIndex = index;  // Store selected ring index
    document.getElementById("popup").classList.add("open");
}

// Close the popup without making changes
function closePopup() {
    document.getElementById("popup").classList.remove("open");
}

// Update the status of the selected ring
function updateStatus(status) {
    if (selectedRingIndex !== null) {
        const ring = ringsData[selectedRingIndex];
        ring.status = status;  // Update the status
        ring.timestamp = Date.now();  // Update the timestamp
        ring.stacked = document.querySelectorAll(".stacked-toggle")[selectedRingIndex].checked; // Update stacked toggle

        // Save updated data to Firebase Realtime Database
        database.ref('rings/' + selectedRingIndex).set({
            status: ring.status,
            timestamp: ring.timestamp,
            stacked: ring.stacked
        });

        // Re-render the grid with the updated data
        renderGrid();
        closePopup();  // Close the popup after updating
    }
}

// Fetch ring data from Firebase Realtime Database when the page loads
database.ref('rings').once('value').then(snapshot => {
    const rings = snapshot.val();
    if (rings) {
        for (let i = 0; i < 28; i++) {
            ringsData[i] = rings[i] || ringsData[i];
        }
    }
    renderGrid();  // Render the grid after data is loaded
});

// Listen for real-time updates from Firebase Realtime Database
database.ref('rings').on('value', snapshot => {
    const rings = snapshot.val();
    if (rings) {
        for (let i = 0; i < 28; i++) {
            ringsData[i] = rings[i] || ringsData[i];
        }
    }
    renderGrid();  // Re-render grid when Firebase data changes
});
