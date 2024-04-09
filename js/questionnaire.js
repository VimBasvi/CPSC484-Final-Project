// Mock functions to simulate direction detection
function detectDirection() {
    // This would be replaced by actual Kinect SDK calls and logic
	// eg if left hand is raised, food, else study pot if moved to right 
    const optionFood = document.getElementById('option-food');
    optionFood.innerHTML += '<p>Move Left</p>';

    const optionStudySpot = document.getElementById('option-study-spot');
    optionStudySpot.innerHTML += '<p>Move Right</p>';
}

// simulate direction detection
setTimeout(detectDirection, 2000);
