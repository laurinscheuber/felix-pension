// Set the actual retirement date
const actualRetirementDate = new Date("September 1, 2025 00:00:00").getTime();
let countdownDate = actualRetirementDate; // Start with the real date

let speed = 1; // Normal speed
let isHyperspeed = false;
let countdownInterval;
let lastUpdate = new Date().getTime();

// DOM Elements
const space = document.getElementById('space');
const hyperspace = document.getElementById('hyperspace');
const countdownContainer = document.getElementById('countdown-container');
const countdownDisplay = document.getElementById('countdown');
const titleDisplay = document.getElementById('title');
const ufo = document.getElementById('ufo');
const easterEggs = document.querySelectorAll('.easter-egg');
const beachScene = document.getElementById('beach-scene');
const backButton = document.getElementById('back-button');
const hyperspeedEgg = document.getElementById('hyperspeed-egg');

// Create stars
function createStars() {
    space.innerHTML = ''; // Clear existing stars if any
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.top = Math.random() * 100 + '%';
        star.style.left = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 5 + 's';
        space.appendChild(star);
    }
}

// Create planets
function createPlanets() {
    const colors = ['#ff4500', '#00bfff', '#32cd32', '#ff69b4', '#ffd700'];
    // Remove existing planets before creating new ones
    document.querySelectorAll('.planet').forEach(p => p.remove());
    for (let i = 0; i < 5; i++) {
        const planet = document.createElement('div');
        planet.className = 'planet';
        const size = Math.random() * 40 + 20;
        planet.style.width = size + 'px';
        planet.style.height = size + 'px';
        planet.style.backgroundColor = colors[i];
        planet.style.top = Math.random() * 80 + 10 + '%';
        planet.style.left = Math.random() * 80 + 10 + '%';
        // Adjust animation based on size for parallax effect
        planet.style.animationDuration = (size / 20) * 120 + 's'; 
        planet.style.animationDelay = Math.random() * -120 + 's'; // Random start point
        space.appendChild(planet);
    }
}

// Create hyperspace stars
function createHyperspaceEffect() {
    hyperspace.innerHTML = '';
    for (let i = 0; i < 300; i++) {
        const star = document.createElement('div');
        star.className = 'hyperspeed-star';
        hyperspace.appendChild(star);
    }
}

// Function to animate hyperspace stars (using Web Animations API)
function animateHyperspaceStars() {
    const stars = hyperspace.querySelectorAll('.hyperspeed-star');
    stars.forEach(star => {
        animateSingleHyperspaceStar(star);
    });
}

function animateSingleHyperspaceStar(star) {
    if (!isHyperspeed) return; // Stop animation if not in hyperspeed

    const duration = (1 + Math.random() * 1.5) * 1000; // 1s to 2.5s duration
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 50; // Fly out 50-100% viewport distance
    const endX = 50 + Math.cos(angle) * distance;
    const endY = 50 + Math.sin(angle) * distance;

    star.animate([
        { transform: 'translate(-50%, -50%) scale(0.1)', opacity: 0, offset: 0 },
        { opacity: 1, offset: 0.1 }, // Quickly fade in
        { transform: `translate(-50%, -50%) translate(${Math.cos(angle) * 50}px, ${Math.sin(angle) * 50}px) scale(1)`, opacity: 1, offset: 0.2 }, // Move slightly out
        { transform: `translate(-50%, -50%) translate(${Math.cos(angle) * window.innerWidth}px, ${Math.sin(angle) * window.innerHeight}px) scale(5)`, opacity: 0, offset: 1 } // Fly way out
    ], {
        duration: duration,
        easing: 'linear',
        fill: 'forwards'
    }).onfinish = () => {
        // Restart the animation for this star immediately if still in hyperspeed
        if (isHyperspeed) {
            animateSingleHyperspaceStar(star);
        }
    };
}

// Initialize countdown
function updateCountdown() {
    const now = new Date().getTime();
    let difference = countdownDate - now;

    // If in hyperspeed mode, adjust the difference based on elapsed time and speed
    if (isHyperspeed) {
        const elapsed = now - lastUpdate;
        difference -= elapsed * (speed - 1);
        // Ensure countdown doesn't go negative artificially fast
        if (difference < 0) difference = 0; 
    }

    lastUpdate = now; // Update lastUpdate time for the next calculation

    // If countdown finished
    if (difference <= 0) {
        clearInterval(countdownInterval);
        countdownDisplay.innerHTML = "0d 0h 0m 0s"; // Show zero
        showBeachScene();
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    countdownDisplay.innerHTML =
        days + "d " + hours + "h " + minutes + "m " + seconds + "s";
}

function showBeachScene() {
    space.style.display = 'none';
    hyperspace.style.display = 'none';
    countdownContainer.style.display = 'none';
    ufo.style.display = 'none';
    easterEggs.forEach(egg => egg.style.display = 'none');
    beachScene.style.display = 'block';
    isHyperspeed = false; // Ensure hyperspeed is off
    hyperspace.style.opacity = '0';
    space.style.filter = 'none';
}

function showSpaceScene() {
    beachScene.style.display = 'none';
    space.style.display = 'block';
    countdownContainer.style.display = 'block';
    ufo.style.display = 'block';
    ufo.style.animation = 'flyby 20s linear infinite'; // Restart UFO animation
    easterEggs.forEach(egg => egg.style.display = 'block');

    // Reset countdown to actual retirement date
    countdownDate = actualRetirementDate;
    lastUpdate = new Date().getTime();

    // Restart countdown
    clearInterval(countdownInterval);
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call to display immediately
}

// Handle Easter Eggs
function setupEasterEggs() {
    // Egg 1: Hue Rotate
    document.getElementById('egg1').addEventListener('click', () => {
        space.style.filter = 'hue-rotate(90deg)';
        setTimeout(() => {
            space.style.filter = 'none';
        }, 3000);
    });

    // Egg 2: Rotate Countdown
    document.getElementById('egg2').addEventListener('click', () => {
        countdownDisplay.style.transition = 'transform 0.5s'; // Add transition for smoothness
        countdownDisplay.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            countdownDisplay.style.transform = 'none';
        }, 3000);
    });

    // Egg 3: Twinkle Stars (Visual Feedback)
    document.getElementById('egg3').addEventListener('click', () => {
        const originalColors = [];
        const stars = space.querySelectorAll('.star');
        stars.forEach(star => {
            originalColors.push(star.style.backgroundColor);
            star.style.backgroundColor = '#ff00ff'; // Magenta twinkle
        });
        setTimeout(() => {
            stars.forEach((star, index) => {
                star.style.backgroundColor = originalColors[index] || 'white';
            });
        }, 2000);
    });

    // Egg 4: Change Title
    document.getElementById('egg4').addEventListener('click', () => {
        const originalTitle = titleDisplay.textContent;
        titleDisplay.textContent = "Endlich frei von Felix! 🎉";
        setTimeout(() => {
            titleDisplay.textContent = originalTitle;
        }, 3000);
    });

    // UFO Easter Egg: Abduct
    ufo.addEventListener('click', () => {
        ufo.style.animation = 'none'; // Stop flying
        ufo.style.transition = 'all 0.5s ease-in-out';
        ufo.style.top = '50%';
        ufo.style.left = '50%';
        ufo.style.transform = 'translate(-50%, -50%) scale(3)';
        ufo.style.backgroundColor = '#00ff00'; // Green abduction beam color

        setTimeout(() => {
            ufo.style.transition = 'none'; // Remove transition for instant reset
            ufo.style.top = '100px';
            ufo.style.left = '-100px';
            ufo.style.transform = 'none';
            ufo.style.backgroundColor = '#c0c0c0';
            // Use requestAnimationFrame to ensure reset happens before restarting animation
            requestAnimationFrame(() => {
                ufo.style.animation = 'flyby 20s linear infinite';
            });
        }, 2000);
    });

    // Hyperspeed Easter Egg
    hyperspeedEgg.addEventListener('click', () => {
        if (!isHyperspeed) {
            isHyperspeed = true;
            speed = 1000; // Set hyperspeed factor
            hyperspace.style.opacity = '1';
            space.style.filter = 'blur(3px)';
            createHyperspaceEffect(); // Recreate stars for animation
            animateHyperspaceStars(); // Start the animation

            // Update countdown faster
            clearInterval(countdownInterval);
            countdownInterval = setInterval(updateCountdown, 10); // Update every 10ms
            lastUpdate = new Date().getTime(); // Reset lastUpdate for accurate fast counting

            // Set a timeout to automatically disable hyperspeed
            setTimeout(() => {
                if (isHyperspeed) { // Only disable if still active
                    isHyperspeed = false;
                    speed = 1;
                    hyperspace.style.opacity = '0';
                    space.style.filter = 'none';

                    // Reset countdown interval to normal speed
                    clearInterval(countdownInterval);
                    countdownInterval = setInterval(updateCountdown, 1000);
                    lastUpdate = new Date().getTime(); // Reset lastUpdate
                }
            }, 7000); // Hyperspeed duration (7 seconds)
        }
    });

    // Back to Reality Button
    backButton.addEventListener('click', showSpaceScene);
}

// Initialize everything on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    createPlanets();
    createHyperspaceEffect(); // Prepare hyperspace visuals
    setupEasterEggs();

    // Initial countdown update and start interval
    lastUpdate = new Date().getTime();
    updateCountdown(); // Initial call to display time immediately
    countdownInterval = setInterval(updateCountdown, 1000);
});
