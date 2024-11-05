document.querySelectorAll('.status-button').forEach(button => {
    button.addEventListener('click', function() {
        const status = button.getAttribute('data-status');
        const ring = document.querySelector('.active-ring');
        const timestampElement = ring.querySelector('.timestamp');

        let ringColor;
        // Get current time, formatted to show hours and minutes only
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        switch (status) {
            case 'Open':
            case 'Extreme':
                ringColor = 'green';
                break;
            case 'Forms':
            case 'Weapons':
            case 'Combat':
                ringColor = 'red';
                break;
            case 'Sparring':
            case 'Creative':
                ringColor = 'orange';
                break;
            default:
                ringColor = 'gray'; // Default color for undefined statuses
                break;
        }

        // Change the ring's background color based on the selected status
        ring.style.backgroundColor = ringColor;

        // Update the timestamp text to display only the time (hours and minutes)
        timestampElement.textContent = `Checked: ${currentTime}`;

        // Close the modal after a selection
        document.getElementById('modal').style.display = 'none';
    });
});
