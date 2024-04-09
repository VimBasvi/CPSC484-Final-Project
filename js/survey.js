// file with code to detect activity and update UI accordingly: 

function detectActivity() {
	// fill in logic:
    // Logic to detect activity and update UI accordingly
    const activityIndicator = document.getElementById('activity-indicator');
    activityIndicator.innerHTML = '<div style="background-color: green;">Activity detected</div>';
}

// Simulate activity detection every 2 seconds
setTimeout(detectActivity, 2000);