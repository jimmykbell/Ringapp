let selectedRingId = null;

// Open the popup
document.querySelectorAll('.ring').forEach(ring => {
    ring.addEventListener('click', function() {
        selectedRingId = this.id;
        openPopup();
    });
});

function openPopup() {
    document.getElementById('popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

// Update the ring status
function updateStatus() {
    const selectedStatus = document.getElementById('status-select').value;
    const ring = document.getElementById(selectedRingId);

    // Update the ring text and color based on selected status
    ring.textContent = `Ring ${selectedRingId.replace('ring', '')}\n${selectedStatus}`;
    switch (selectedStatus) {
        case 'OPEN':
        case 'EXTREME':
            ring.style.backgroundColor = '#4caf50'; // Green for OPEN, EXTREME
            break;
        case 'FORMS':
        case 'WEAPONS':
        case 'COMBAT':
            ring.style.backgroundColor = '#f44336'; // Red for FORMS, WEAPONS, COMBAT
            break;
        case 'SPARRING':
        case 'CREATIVE':
            ring.style.backgroundColor = '#ff9800'; // Orange for SPARRING, CREATIVE
            break;
    }

    closePopup();
}
