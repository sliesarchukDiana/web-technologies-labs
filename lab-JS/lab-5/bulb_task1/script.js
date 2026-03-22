const onoffStandard = document.getElementById("onoff");
const onoffLED = document.getElementById("LEDonoff");
const body = document.querySelector("body");

const standardContainer = document.getElementById("standard-container");
const ledContainer = document.getElementById("led-container");
const switchBulbBtn = document.getElementById("switch-bulb-btn");
let inactivityTimeout;
const TIME_UNTIL_BURNOUT = 6000;

function toggleLight(e) {
    if (e.target.checked) {
        body.classList.add('lighton');
    } else {
        body.classList.remove('lighton');
    }
    resetTimer();
}

onoffStandard.addEventListener("change", toggleLight);
onoffLED.addEventListener("change", toggleLight);

switchBulbBtn.addEventListener("click", () => {
    body.classList.remove('lighton');
    onoffStandard.checked = false;
    onoffLED.checked = false;
    clearTimeout(inactivityTimeout);

    if (standardContainer.classList.contains("hidden")) {
        standardContainer.classList.remove("hidden");
        ledContainer.classList.add("hidden");
    } else {
        standardContainer.classList.add("hidden");
        ledContainer.classList.remove("hidden");
    }
});

function resetTimer() {
    clearTimeout(inactivityTimeout);

    if (body.classList.contains('lighton') && !body.classList.contains('flicker')) {
        inactivityTimeout = setTimeout(triggerBurnOut, TIME_UNTIL_BURNOUT);
    }
}

function triggerBurnOut() {
    body.classList.add('flicker');

    const delays = [50, 150, 50, 300, 100, 400];
    let accumulatedTime = 0;

    delays.forEach((delay) => {
        accumulatedTime += delay;
        setTimeout(() => {
            body.classList.toggle('lighton');
        }, accumulatedTime);
    });

    setTimeout(() => {
        body.classList.remove('lighton');
        body.classList.remove('flicker');
        onoffStandard.checked = false;
        onoffLED.checked = false;
    }, accumulatedTime + 50);
}

['mousemove', 'keydown', 'click', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, resetTimer);
});