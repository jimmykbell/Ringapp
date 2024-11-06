// Your Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR-API-KEY",
    authDomain: "YOUR-PROJECT-ID.firebaseapp.com",
    databaseURL: "https://YOUR-PROJECT-ID.firebaseio.com",
    projectId: "YOUR-PROJECT-ID",
    storageBucket: "YOUR-PROJECT-ID.appspot.com",
    messagingSenderId: "YOUR-MESSAGING-SENDER-ID",
    appId: "YOUR-APP-ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Elements for modal
const modal = document.getElementById('ringModal');
const closeModal = document.getElementsByClassName('close')[0];
const updateButton = document.getElementById('updateButton');
const statusSelect = document.getElementById('statusSelect');

// To keep track of the current ring being updated
let currentRingId = null;

// Create the 28 rings
function createRings() {
    const gridContainer = document.querySelector('.grid-container');
    for (let i = 1; i <= 28; i++) {
        const ring = document.createElement('div');
        ring.classList.add('ring');
        ring.setAttribute('data-ring-id', i);
        ring.innerHTML = `<div class="ring-number">${i}</div><div class="timestamp"></div>`;
        gridContainer.appendChild(ring);

        // Add click event to open the modal
        ring.addEventListener('click', () => openModal(i));
    }
}

// Open the modal for selecting a new status
function openModal(ringId) {
    currentRingId = ringId;
    modal.style.display = "block";
}

// Close the modal
closeModal.onclick = function () {
    modal.style.display = "none";
}

// Update the status in Firebase and reflect changes
updateButton.onclick = function () {
    const status = statusSelect.value;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Update the database with new status and timestamp
    updateRingStatus(currentRingId, status, currentTime);

    // Close the modal
    modal.style.display = "none";
}

// Function to update ring status in Firebase
function updateRingStatus(ringId, status, time) {
    const ringRef = database.ref('rings/' + ringId);
    ringRef.set({
        status: status,
        time: time
    });
}

// Function to fetch ring data from Firebase
function fetchRingData() {
    const ringsRef = database.ref('rings');

    ringsRef.on('value', (snapshot) => {
        const ringsData = snapshot.val();

        document.querySelectorAll('.ring').forEach((ringElement) => {
            const ringId = ringElement.getAttribute('data-ring-id');
            const ringData = ringsData[ringId];

            if (ringData) {
                // Update the ring's background color based on status
                ringElement.style.backgroundColor = getColorFromStatus(ringData.status);

                // Update the timestamp inside the ring
                const timestampElement = ringElement.querySelector('.timestamp');
                timestampElement.textContent = ringData.time ? `Last checked: ${ringData.time}` : '';
            }
        });
    });
}

// Helper function to get the color based on status
function getColorFromStatus(status) {
    switch (status) {
        case 'Open':
        case 'Extreme':
            return 'green';
        case 'Forms':
        case 'Weapons':
        case 'Combat':
            return 'red';
        case 'Sparring':
        case 'Creative':
            return 'orange';
        default:
            return 'gray';
    }
}

// Initialize the app
createRings();
fetchRingData();
