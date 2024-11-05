// Fetch the JSON data
fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const ringsContainer = document.getElementById('rings');
        data.rings.forEach(ring => {
            const ringDiv = document.createElement('div');
            ringDiv.className = `ring ${ring.status}`; // Set class based on status
            ringDiv.textContent = ring.id; // Display ring number
            ringDiv.setAttribute('data-status', ring.status);
            ringDiv.setAttribute('data-last-checked', ring.lastChecked);
            ringDiv.onclick = () => updateStatus(ringDiv); // Attach click event
            ringsContainer.appendChild(ringDiv);
        });
    })
    .catch(error => console.error('Error fetching data:', error));

// Function to update the status when a ring is clicked
function updateStatus(ringDiv) {
    const currentStatus = ringDiv.getAttribute('data-status');
    let newStatus;
    
    // Simple cycling of statuses for demonstration
    switch (currentStatus) {
        case 'open':
            newStatus = 'forms';
            break;
        case 'forms':
            newStatus = 'sparring';
            break;
        case 'sparring':
            newStatus = 'open';
            break;
        default:
            newStatus = 'open';
    }

    ringDiv.className = `ring ${newStatus}`; // Update class for new status
    ringDiv.setAttribute('data-status', newStatus); // Update the status attribute

    // Update the last checked time
    const now = new Date();
    ringDiv.setAttribute('data-last-checked', now.toLocaleString());
    ringDiv.textContent = `${ringDiv.textContent} - ${now.toLocaleString()}`; // Optional: show last checked time
}
