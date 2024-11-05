// Initialize the ring status data
const ringStatuses = {
    ring1: { status: 'open', lastChecked: '' },
    ring2: { status: 'open', lastChecked: '' },
    ring3: { status: 'open', lastChecked: '' },
    ring4: { status: 'open', lastChecked: '' },
    ring5: { status: 'open', lastChecked: '' },
    // Add more rings as necessary
};

// Function to update ring status and time
function updateRingStatus(ringId, status) {
    const ring = document.getElementById(ringId);
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Only the time (HH:MM)

    // Update the ring's status class and timestamp
    ring.classList.remove('open', 'extreme', 'forms', 'weapons', 'combat', 'sparring', 'creative');
    ring.classList.add(status);

    // Update the ring number, status, and timestamp in the square
    ring.querySelector('.ring-number').textContent = ringId.replace('ring', ''); // Ring number
    ring.querySelector('.status-text').textContent = status.charAt(0).toUpperCase() + status.slice(1); // Status (capitalized)
    ring.querySelector('.timestamp').textContent = currentTime; // Time only (no date)

    // Update the JSON object with the current time
    ringStatuses[ringId].status = status;
    ringStatuses[ringId].lastChecked = currentTime; // Save the current time
}

// Function to open the modal and allow status change
function openModal(ringId) {
    const modal = document.getElementById('myModal');
    const statusButtons = modal.querySelectorAll('.status-option');
    
    // Set up click event for each status button
    statusButtons.forEach(button => {
        button.addEventListener('click', function () {
            const status = button.getAttribute('data-status');
            updateRingStatus(ringId, status); // Update the status and time
            modal.style.display = 'none'; // Close the modal after selection
        });
    });

    modal.style.display = 'flex'; // Show the modal
}

// Close the modal when the close button is clicked
document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('myModal').style.display = 'none'; // Close the modal
});

// Add event listeners for all rings (you can add more rings if needed)
document.querySelectorAll('.ring').forEach(ring => {
    ring.addEventListener('click', function () {
        const ringId = ring.id; // Get the ring id
        openModal(ringId); // Open the modal for the clicked ring
    });
});
