const onoffStandard = document.getElementById("onoff");
const onoffLED = document.getElementById("LEDonoff");
const body = document.querySelector("body");

const standardContainer = document.getElementById("standard-container");
const ledContainer = document.getElementById("led-container");
const switchBulbBtn = document.getElementById("switch-bulb-btn");
const brightnessBtn = document.getElementById("brightness-btn");

let inactivityTimeout;
const TIME_UNTIL_BURNOUT = 5000;

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

    document.documentElement.style.setProperty('--led-brightness', '1');

    if (standardContainer.classList.contains("hidden")) {
        standardContainer.classList.remove("hidden");
        ledContainer.classList.add("hidden");
        if (brightnessBtn) brightnessBtn.classList.add("hidden");
    } else {
        standardContainer.classList.add("hidden");
        ledContainer.classList.remove("hidden");
        if (brightnessBtn) brightnessBtn.classList.remove("hidden");
    }
});

if (brightnessBtn) {
    brightnessBtn.addEventListener("click", () => {
        let userBrightness = prompt("Set brightness (from 0 to 100):", "100");

        if (userBrightness !== null) {
            let brightnessValue = parseInt(userBrightness, 10);

            if (!isNaN(brightnessValue) && brightnessValue >= 0 && brightnessValue <= 100) {
                let normalizedBrightness = brightnessValue / 100;
                document.documentElement.style.setProperty('--led-brightness', normalizedBrightness);
            } else {
                alert("Enter value in range of 0 to 100");
            }
        }
        resetTimer();
    });
}

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