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
const database = firebase.database(); // Reference to Firebase Realtime Database

// Function to update the status of a ring and record the time it was checked
function updateRingStatus(ringNumber, status) {
    const timestamp = new Date().toLocaleTimeString(); // Get the current time without date
    
    // Reference to the specific ring in Firebase
    const ringRef = database.ref('rings/' + ringNumber);
    
    // Update the status and timestamp in Firebase
    ringRef.set({
        status: status,
        timestamp: timestamp
    }).then(() => {
        console.log("Ring " + ringNumber + " updated with status: " + status + " at " + timestamp);
        
        // Re-render the rings after the update
        renderRings();
    }).catch((error) => {
        console.error("Error updating ring:", error);
    });
}

// Function to handle when a user clicks on a ring
function onRingClick(event, ringNumber) {
    // Create the modal with the status options
    const modal = document.getElementById("statusModal");
    modal.style.display = "block";
    
    // When the user selects a status, update the ring
    const statusButtons = document.querySelectorAll(".status-btn");
    statusButtons.forEach(button => {
        button.addEventListener("click", function() {
            const selectedStatus = button.innerText; // Get the selected status

            // Update the status and time for the selected ring in Firebase
            updateRingStatus(ringNumber, selectedStatus);

            // Close the modal after updating
            modal.style.display = "none";
        });
    });
}

// Function to render all the rings from Firebase
function renderRings() {
    const gridContainer = document.querySelector(".grid-container");

    // Get all rings from Firebase
    const ringsRef = database.ref("rings");
    ringsRef.once("value", (snapshot) => {
        const ringsData = snapshot.val();
        
        // Clear previous rings if any
        gridContainer.innerHTML = "";

        // Loop through the rings and create their corresponding elements
        for (let ringNumber in ringsData) {
            const ring = ringsData[ringNumber];
            const ringElement = document.createElement("div");
            ringElement.classList.add("ring");
            ringElement.setAttribute("data-ring-number", ringNumber);
            ringElement.style.backgroundColor = getRingColor(ring.status); // Set color based on status

            // Add the ring number and timestamp (time last checked) inside the ring
            ringElement.innerHTML = `
                <span class="ring-number">${ringNumber}</span>
                <br><span class="timestamp">${ring.timestamp}</span>
            `;
            
            // Add event listener for ring click
            ringElement.addEventListener("click", (event) => onRingClick(event, ringNumber));

            // Append the ring element to the grid
            gridContainer.appendChild(ringElement);
        }
    });
}

// Function to get the color for a ring based on its status
function getRingColor(status) {
    switch (status) {
        case "Open":
        case "Extreme":
            return "green";
        case "Forms":
        case "Weapons":
        case "Combat":
            return "red";
        case "Sparring":
        case "Creative":
            return "orange";
        default:
            return "white"; // Default color if no status is set
    }
}

// Initial render call to display rings from Firebase
renderRings();
