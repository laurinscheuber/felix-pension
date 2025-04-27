const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const timerContainerEl = document.getElementById('timer-container'); // Get the container
const timerEl = document.getElementById('timer'); // Keep reference if needed, maybe not
const escapeHatch = document.querySelector('.escape-hatch');
const retirementVisual = document.getElementById('retirement-visual');
const backToRealityBtn = document.getElementById('back-to-reality');
const retirementGif = document.getElementById('retirement-gif');

// Store the original timer HTML structure for resetting
const originalTimerHTML = timerContainerEl.innerHTML;

// Set the target date: September 1st, 2025 00:00:00
const retirementDate = new Date('2025-09-01T00:00:00').getTime();

let intervalId;
let timeMultiplier = 1; // 1 for normal speed
let startTime = new Date().getTime(); // Store the initial start time
let isFinished = false; // Track if countdown finished

function updateCountdown() {
    const now = new Date().getTime();
    const elapsedRealTime = (timeMultiplier > 1) ? (now - speedupStartTime) : 0;
    // Use the initial start time for normal speed calculation
    const effectiveNow = (timeMultiplier > 1) ? speedupReferenceTime + elapsedRealTime * timeMultiplier : startTime + (now - startTime);

    const distance = retirementDate - effectiveNow;

    if (distance <= 0 && !isFinished) {
        isFinished = true;
        clearInterval(intervalId); // Stop the interval
        timerContainerEl.innerHTML = "<h1>FREIHEIT!</h1>"; // German Freedom!
        escapeHatch.style.display = 'none';
        retirementVisual.classList.remove('hidden');
        // Keep the back to reality button visible
        // backToRealityBtn.style.display = 'none'; // REMOVED
        return;
    }

    // If already finished, don't update numbers
    if (isFinished) return;

    // Ensure elements exist before updating (needed after reset)
    const currentDaysEl = document.getElementById('days');
    const currentHoursEl = document.getElementById('hours');
    const currentMinutesEl = document.getElementById('minutes');
    const currentSecondsEl = document.getElementById('seconds');

    if (!currentDaysEl || !currentHoursEl || !currentMinutesEl || !currentSecondsEl) {
        console.error("Timer elements not found after potential reset.");
        return; // Stop if elements are missing
    }

    const days = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = Math.max(0, Math.floor((distance % (1000 * 60)) / 1000));

    // Add slight animation class briefly when numbers change (optional)
    if (currentSecondsEl.textContent !== String(seconds).padStart(2, '0')) {
        currentSecondsEl.parentNode.classList.add('pop');
        setTimeout(() => currentSecondsEl.parentNode.classList.remove('pop'), 100);
    }

    currentDaysEl.textContent = String(days).padStart(2, '0');
    currentHoursEl.textContent = String(hours).padStart(2, '0');
    currentMinutesEl.textContent = String(minutes).padStart(2, '0');
    currentSecondsEl.textContent = String(seconds).padStart(2, '0');
}

// Variables to manage speedup timing correctly
let speedupStartTime = 0;
let speedupReferenceTime = 0;

function startTimer(speed = 1000) {
    clearInterval(intervalId); // Clear any existing interval
    isFinished = false; // Reset finished state
    startTime = new Date().getTime(); // Reset start time for normal speed calculation
    intervalId = setInterval(updateCountdown, speed);
    updateCountdown(); // Initial call
}

// Start the countdown immediately at normal speed
startTimer(1000);

// --- Event Listeners ---

escapeHatch.addEventListener('click', () => {
    console.log('Escape hatch clicked!');
    timeMultiplier = 86400; // Approx 1 day per second (24*60*60)
    speedupStartTime = new Date().getTime(); // Record when speedup starts
    // Calculate the 'time' the counter showed just before speedup
    const elapsedSinceStart = speedupStartTime - startTime;
    speedupReferenceTime = startTime + elapsedSinceStart; // Use the correct reference

    clearInterval(intervalId); // Clear existing interval
    intervalId = setInterval(updateCountdown, 50); // Start faster interval for visual spin

    retirementVisual.classList.remove('hidden');
    escapeHatch.style.display = 'none'; // Hide the trigger
});

backToRealityBtn.addEventListener('click', () => {
    console.log('Back to reality clicked!');
    timeMultiplier = 1; // Back to normal speed

    // Reset timer display if it showed "FREIHEIT!"
    if (isFinished) {
        timerContainerEl.innerHTML = originalTimerHTML;
    }

    clearInterval(intervalId); // Clear faster interval
    startTimer(1000); // Restart normal interval

    retirementVisual.classList.add('hidden');
    escapeHatch.style.display = 'block'; // Show the trigger again
});

// --- Easter Egg Example ---
const footerEgg = document.querySelector('.footer-egg');
footerEgg.addEventListener('mouseover', () => {
    // Could add a temporary message or another small animation
    console.log('Footer egg hovered!');
});

// Add CSS class for timer pop animation (needs corresponding CSS)
const styleSheet = document.styleSheets[0];
try {
    styleSheet.insertRule(`
        @keyframes timerPop {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `, styleSheet.cssRules.length);
    styleSheet.insertRule(`
        .pop { animation: timerPop 0.2s ease-in-out; }
    `, styleSheet.cssRules.length);
} catch (e) {
    console.error("Could not insert CSS rules for timer pop animation:", e);
}
