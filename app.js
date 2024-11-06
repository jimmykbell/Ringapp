// Firebase configuration from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyBa7CfejKs6jApm_u6qKdxeZozg-b8agyk",
    authDomain: "atarings00.firebaseapp.com",
    databaseURL: "https://atarings00-default-rtdb.firebaseio.com",
    projectId: "atarings00",
    storageBucket: "atarings00.firebasestorage.app",
    messagingSenderId: "Y981428477768",
    appId: "1:981428477768:web:ce13879472db8df2349d7d",
    measurementId: "G-93M7Q2CJVB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Create rings grid
function createRings() {
    const gridContainer = document.querySelector('.grid-container');
    
    for (let i = 1; i <= 28; i++) {
        const ring = document.createElement('div');
        ring.classList.add('grid-item');
        ring.id = `ring-${i}`;
        
        // Firebase - Fetch ring status from database
        database.ref(`rings/${i}`).once('value', (snapshot) => {
            const data = snapshot.val();
            const status = data ? data.status : "Open";  // Default to Open if no data
            const timestamp = data ? data.timestamp : new Date().toLocaleTimeString();
            
            ring.innerHTML = `<span class="ring-number">${i}</span><br><span class="timestamp">${timestamp}</span>`;
            
            // Set the ring color based on the status
            if (status === "Open" || status === "Extreme") {
                ring.style.backgroundColor = "green";
            } else if (status === "Forms" || status === "Weapons" || status === "Combat") {
                ring.style.backgroundColor = "red";
            } else if (status === "Sparring" || status === "Creative") {
                ring.style.backgroundColor = "orange";
            }

            ring.addEventListener('click', () => openModal(i, status));
        });

        gridContainer.appendChild(ring);
    }
}

// Open modal and update status
function openModal(ringId, currentStatus) {
    const modal = document.getElementById('ringModal');
    const selectElement = document.getElementById('statusSelect');
    const updateButton = document.getElementById('updateButton');

    // Set the current status in the select menu
    selectElement.value = currentStatus;

    // Show the modal
    modal.style.display = "block";

    // Update the status in Firebase when the button is clicked
    updateButton.onclick = () => {
        const newStatus = selectElement.value;
        const timestamp = new Date().toLocaleTimeString();

        // Update Firebase with new status and timestamp
        database.ref(`rings/${ringId}`).set({
            status: newStatus,
            timestamp: timestamp
        });

        // Close the modal after updating
        modal.style.display = "none";
        // Refresh the rings to show updated status
        createRings();
    };
}

// Close the modal
const closeModal = document.querySelector('.close');
closeModal.onclick = () => {
    const modal = document.getElementById('ringModal');
    modal.style.display = "none";
};

// Load the rings when the page loads
window.onload = createRings;
