// script.js

let selectedRing;

// Get the modal and the close button
const modal = document.getElementById("modal");
const closeModal = document.getElementsByClassName("close")[0];

// Get the rings
const rings = document.querySelectorAll(".ring");

// When a ring is clicked, open the modal
rings.forEach(ring => {
    ring.addEventListener("click", () => {
        selectedRing = ring;
        modal.style.display = "block"; // Show the modal
    });
});

// When the user clicks on <span> (x), close the modal
closeModal.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Handle status button clicks
const statusButtons = document.querySelectorAll(".status-button");
statusButtons.forEach(button => {
    button.addEventListener("click", () => {
        const status = button.getAttribute("data-status");
        
        // Update the ring's text and color based on status
        selectedRing.textContent = status; // Update the ring text
        selectedRing.style.backgroundColor = getColorByStatus(status); // Change color based on status

        modal.style.display = "none"; // Close the modal
    });
});

// Function to get color by status
function getColorByStatus(status) {
    switch (status) {
        case "Open":
        case "Extreme":
            return "green";
        case "Forms":
        case "Weapons":
        case "Combat":
            return "orange";
        case "Sparring":
        case "Creative":
            return "lightblue"; // Different color for Sparring and Creative
        default:
            return "white"; // Default color
    }
}
