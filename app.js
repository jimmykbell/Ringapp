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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Get reference to the rings data
const ringsRef = database.ref('rings');

// Create the rings grid dynamically based on data
function createRingGrid() {
  const ringsContainer = document.getElementById("rings-container");
  for (let i = 1; i <= 28; i++) {
    const ringElement = document.createElement("div");
    ringElement.classList.add("ring");
    ringElement.id = "ring-" + i; // Use ring ID
    ringElement.innerHTML = `
      <span class="ring-number">${i}</span>
      <span class="ring-time" id="time-${i}">Not checked yet</span>
    `;
    ringElement.addEventListener("click", () => openModal(i)); // Add event listener
    ringsContainer.appendChild(ringElement);
  }
}

// Open the modal to select the status of the clicked ring
function openModal(ringId) {
  const modal = document.getElementById("myModal");
  const ringStatusSelect = document.getElementById("ring-status");
  const ringTimeSpan = document.getElementById("time-" + ringId);

  // Open the modal
  modal.style.display = "block";

  // Handle form submission for the ring
  document.getElementById("submit-status").onclick = function() {
    const newStatus = ringStatusSelect.value;
    const timestamp = new Date().toLocaleTimeString(); // Format the time
    updateRingStatus(ringId, newStatus, timestamp);
    modal.style.display = "none"; // Close modal
  };
}

// Update the ring status in Firebase
function updateRingStatus(ringId, status, timestamp) {
  const ringRef = ringsRef.child(ringId); // Get a reference to the specific ring in Firebase

  ringRef.update({
    status: status,
    timestamp: timestamp
  }).then(() => {
    // Update the UI immediately after Firebase update
    document.getElementById("ring-" + ringId).style.backgroundColor = getColorForStatus(status);
    document.getElementById("time-" + ringId).innerText = timestamp;
  }).catch((error) => {
    console.error("Error updating ring: ", error);
  });
}

// Map statuses to background colors
function getColorForStatus(status) {
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
      return "white";
  }
}

// Create the initial grid of rings
createRingGrid();
