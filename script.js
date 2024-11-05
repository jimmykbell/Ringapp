// Keep track of the selected ring
let selectedRing = null;

// Define a function to create rings
function createRings() {
    const ringsContainer = document.getElementById('rings');
    const statuses = JSON.parse(localStorage.getItem('ringStatuses')) || {};

    for (let i = 1; i <= 28; i++) {
        const ringDiv = document.createElement('div');
        ringDiv.classList.add('ring');
        ringDiv.dataset.ringId = i;
        ringDiv.innerText = `Ring ${i}`;

        // Set the initial status color
        const status = statuses[i] || 'open'; // Default to 'open' if no status exists
        ringDiv.classList.add(status);

        // Display the time last checked
        const timestamp = statuses[`time_${i}`] || 'Never';
        const timeText = document.createElement('div');
        timeText.classList.add('timestamp');
        timeText.innerText = `Last checked: ${timestamp}`;
        ringDiv.appendChild(timeText);

        // Add click event to open the modal when a ring is clicked
        ringDiv.onclick = function() {
            selectedRing = ringDiv; // Store the selected ring
            openModal(ringDiv); // Open the modal
        };

        ringsContainer.appendChild(ringDiv);
    }
}

// Function to open the modal
function openModal(ringDiv) {
    const modal = document.getElementById('statusModal');
    const statusOptions = modal.querySelectorAll('.status-option');
    const currentStatus = ringDiv.classList[1]; // Get current status class (e.g., open, forms, etc.)

    // Preselect the button based on the current status of the ring
    statusOptions.forEach(button => {
        if (button.getAttribute('data-status') === currentStatus) {
            button.style.backgroundColor = '#666'; // Highlight current status
        } else {
            button.style.backgroundColor = ''; // Reset other buttons
        }
    });

    modal.style.display = 'flex'; // Show the modal
}

// Function to close the modal
function closeModal() {
    document.getElementById('statusModal').style.display = 'none'; // Hide modal
    selectedRing = null; // Reset selected ring
}

// Event listeners for status option buttons in the modal
document.querySelectorAll('.status-option').forEach(button => {
    button.onclick = function() {
        if (selectedRing) {
            const newStatus = this.getAttribute('data-status');
            updateStatus(selectedRing, newStatus); // Update ring with new status
            closeModal(); // Close modal after selection
        }
    };
});

// Update the status of the selected ring and save the timestamp
function updateStatus(ringDiv, newStatus) {
    // Set the new status on the ring
    ringDiv.className = 'ring ' + newStatus; // Remove previous status, add new one

    // Update timestamp
    const timestamp = new Date().toLocaleString();
    let statuses = JSON.parse(localStorage.getItem('ringStatuses')) || {};
    statuses[ringDiv.dataset.ringId] = newStatus; // Set new status for the ring
    statuses[`time_${ringDiv.dataset.ringId}`] = timestamp; // Store the timestamp for the ring

    // Save statuses and timestamps in localStorage
    localStorage.setItem('ringStatuses', JSON.stringify(statuses));

    // Update the timestamp display on the ring
    const timeText = ringDiv.querySelector('.timestamp');
    if (timeText) {
        timeText.innerText = `Last checked: ${timestamp}`;
    }
}

// Event listener for closing the modal when clicking outside of the modal content
window.onclick = function(event) {
    const modal = document.getElementById('statusModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Initialize the page by creating the rings
createRings();
