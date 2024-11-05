// Initialize the ring status data (all rings start as "open")
const ringStatuses = {};
for (let i = 1; i <= 28; i++) {
    ringStatuses[`ring${i}`] = { status: 'open', lastChecked: '' };
}

// Function to update the ring status and timestamp
function updateRingStatus(ringId, status) {
    const ring = document.getElementById(ringId);
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Time only (HH:MM)

    // Update the ring's status class and timestamp
    ring.classList.remove('open', 'extreme', 'forms', 'weapons', 'combat', 'sparring', 'creative');
    ring.classList.add(status);

    // Update the ring number and status in the square
    ring.querySelector('.ring-number').textContent = ringId.replace('ring', ''); // Ring number
    ring.querySelector('.timestamp').textContent = currentTime; // Time only

    // Save the current time to the ringStatuses object
    ringStatuses[ringId].status = status;
    ringStatuses[ringId].lastChecked = currentTime;
}

// Function to open the modal when a ring is clicked
function openModal(ringId) {
    const modal = document.getElementById('myModal');
    const statusButtons = modal.querySelectorAll('.status-option');

    // Set up click event for each status button
    statusButtons.forEach(button => {
        button.addEventListener('click', function () {
            const status = button.getAttribute('data-status');
            updateRingStatus(ringId, status); // Update the ring status and timestamp
            modal.style.display = 'none'; // Close the modal after selection
        });
    });

    modal.style.display = 'flex'; // Show the modal
}

// Close the modal when the close button is clicked
document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('myModal').style.display = 'none'; // Close the modal
});

// Add event listeners for all rings (28 rings in total)
for (let i = 1; i <= 28; i++) {
    document.getElementById(`ring${i}`).addEventListener('click', function () {
        openModal(`ring${i}`); // Open the modal for the clicked ring
    });
}
