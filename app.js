// Firebase config
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

// Ring data
let ringsData = Array(28).fill({
    status: 'OPEN',
    timestamp: Date.now(),
    stacked: false
});

// Render the grid
function renderGrid() {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    ringsData.forEach((ring, index) => {
        const square = document.createElement("div");
        square.classList.add("square", getStatusColorClass(ring.status));
        square.innerHTML = `
            <span class="timestamp">${new Date(ring.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span class="ring-number">${index + 1}</span>
            <span class="status-text">${ring.status}</span>
            <input type="checkbox" class="stacked-toggle" ${ring.stacked ? 'checked' : ''} />
        `;
        square.addEventListener("click", () => openPopup(index));
        grid.appendChild(square);
    });
}

// Get color for ring status
function getStatusColorClass(status) {
    switch(status) {
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

// Open the popup for changing status
let selectedRingIndex = null;

function openPopup(index) {
    selectedRingIndex = index;
    document.getElementById("popup").classList.add("open");
}

// Close the popup
function closePopup() {
    document.getElementById("popup").classList.remove("open");
}

// Update the ring status and store in Firebase
function updateStatus(status) {
    if (selectedRingIndex !== null) {
        const ring = ringsData[selectedRingIndex];
        ring.status = status;
        ring.timestamp = Date.now();
        ring.stacked = document.querySelectorAll(".stacked-toggle")[selectedRingIndex].checked;

        db.collection("rings").doc(selectedRingIndex.toString()).set({
            status: ring.status,
            timestamp: ring.timestamp,
            stacked: ring.stacked
        });

        renderGrid();
        closePopup();
    }
}

// Fetch data from Firebase on load
db.collection("rings").get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
        const ringIndex = doc.id;
        const ringData = doc.data();
        ringsData[ringIndex] = ringData;
    });
    renderGrid();
});

// Listen for real-time updates
db.collection("rings").onSnapshot(querySnapshot => {
    querySnapshot.forEach(doc => {
        const ringIndex = doc.id;
        const ringData = doc.data();
        ringsData[ringIndex] = ringData;
    });
    renderGrid();
});
