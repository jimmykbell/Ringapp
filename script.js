let selectedRing = null;

// Fetch the JSON data
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const ringsContainer = document.getElementById('rings');
        data.rings.forEach(ring => {
            const ringDiv = document.createElement('div');
            ringDiv.className = `ring ${ring.status}`;
            ringDiv.textContent = ring.id;
            ringDiv.setAttribute('data-status', ring.status);
            ringDiv.setAttribute('data-last-checked', ring.lastChecked || "Not checked");

            // Set click event to open modal
            ringDiv.onclick = () => openModal(ringDiv);

            ringsContainer.appendChild(ringDiv);
        });
    })
    .catch(error => console.error('Error fetching data:', error));

// Function to open the status selection modal
function openModal(ringDiv) {
    selectedRing = ringDiv; // Store the clicked ring
    document.getElementById('statusModal').style.display = 'block'; // Show modal
}

// Function to close the modal
function closeModal() {
    document.getElementById('statusModal').style.display = 'none';
    selectedRing = null; // Clear the selected ring
}

// Event listener for closing the modal
document.getElementById('closeModal').onclick = closeModal;

// Event listeners for status option buttons
document.querySelectorAll('.status-option').forEach(button => {
    button.onclick = function() {
        if (selectedRing) {
            const newStatus = this.getAttribute('data-status');
            updateStatus(selectedRing, newStatus); // Update ring with new status
            closeModal();
        }
    };
});

// Function to update the ring's status
function updateStatus(ringDiv, newStatus) {
    // Update ring's class and data attribute
    ringDiv.className = `ring ${newStatus}`;
    ringDiv.setAttribute('data-status', newStatus);

    // Update the last checked time
    const now = new Date();
    ringDiv.setAttribute('data-last-checked', now.toLocaleString());
    ringDiv.textContent = `${ringDiv.textContent.split(" - ")[0]} - ${now.toLocaleString()}`; // Update text
}
