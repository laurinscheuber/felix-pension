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
let speedupStartTime = 0; // Track when speedup began
let speedupReferenceTime = 0; // Track the 'real' time just before speedup
let isFinished = false; // Track if countdown finished

function updateCountdown() {
    const now = new Date().getTime();
    let effectiveNow;

    if (timeMultiplier > 1) {
        // Calculate elapsed time since speedup started
        const elapsedSinceSpeedup = now - speedupStartTime;
        // Calculate the effective time jump
        effectiveNow = speedupReferenceTime + (elapsedSinceSpeedup * timeMultiplier);
    } else {
        // Normal speed calculation based on initial page load time
        effectiveNow = startTime + (now - startTime);
    }

    const distance = retirementDate - effectiveNow;

    if (distance <= 0 && !isFinished) {
        isFinished = true;
        clearInterval(intervalId);
        timerContainerEl.innerHTML = "<h1>FREIHEIT!</h1>";
        escapeHatch.style.display = 'none';
        retirementVisual.classList.remove('hidden');
        document.body.classList.add('sunny-mode'); // Activate sunny theme
        // Keep the back to reality button visible
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
    console.log('Escape hatch clicked! Speeding up.');
    timeMultiplier = 3600; // Speed up: 1 hour per second (3600 seconds/hour)
    speedupStartTime = new Date().getTime(); // Record when speedup starts

    // Calculate the 'real' time elapsed just before speedup
    const elapsedRealTimeBeforeSpeedup = speedupStartTime - startTime;
    speedupReferenceTime = startTime + elapsedRealTimeBeforeSpeedup;

    clearInterval(intervalId); // Clear existing interval
    intervalId = setInterval(updateCountdown, 50); // Update faster for visual effect

    // Show retirement visual immediately on click, even if not finished
    retirementVisual.classList.remove('hidden');
    // Optionally hide the hatch itself after clicking
    // escapeHatch.style.display = 'none';
});

backToRealityBtn.addEventListener('click', () => {
    console.log('Back to reality clicked!');
    timeMultiplier = 1; // Reset speed
    clearInterval(intervalId);

    // Reset the timer display to its original state
    timerContainerEl.innerHTML = originalTimerHTML;
    retirementVisual.classList.add('hidden');
    document.body.classList.remove('sunny-mode'); // Remove sunny mode if active
    escapeHatch.style.display = 'block'; // Show the hatch again

    // Restart the timer at normal speed
    startTimer(1000);
});

// Ensure the GIF reloads if the user goes back and forth
retirementVisual.addEventListener('transitionend', (event) => {
    if (event.propertyName === 'opacity' && !retirementVisual.classList.contains('hidden')) {
        // Reload GIF when shown (optional, might cause flicker)
        // const currentSrc = retirementGif.src;
        // retirementGif.src = ''; // Clear src briefly
        // retirementGif.src = currentSrc; // Set it back to trigger reload
    }
});
