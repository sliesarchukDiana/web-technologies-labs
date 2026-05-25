const redLight = document.querySelector('.steady-light');
const yellowLight = document.querySelector('.ready-light');
const greenLight = document.querySelector('.go-light');
const lightsContainer = document.querySelector('.lights-flex');
const configBtn = document.getElementById('freq-btn');

let redDuration = 5;
let yellowDuration = 3;
let greenDuration = 7;
let currentState = -1;
let timerId;
let blinkIntervalId;

function createLabel(parentEl, text) {
    parentEl.style.position = 'relative';
    const label = document.createElement('div');
    label.classList.add('light-label');
    label.textContent = text;
    parentEl.appendChild(label);
    return label;
}

const redLabel = createLabel(redLight, 'Red');
const yellowLabel = createLabel(yellowLight, 'Yellow');
const greenLabel = createLabel(greenLight, 'Green');
const blinkLabelText = 'Blinking Yellow';

function resetLights() {
    redLight.style.backgroundColor = 'var(--steadycoloroff)';
    yellowLight.style.backgroundColor = 'var(--readycoloroff)';
    greenLight.style.backgroundColor = 'var(--gocoloroff)';

    redLabel.classList.remove('active');
    yellowLabel.classList.remove('active');
    greenLabel.classList.remove('active');

    yellowLabel.textContent = 'Yellow';

    clearInterval(blinkIntervalId);
}

function switchState() {
    clearTimeout(timerId);
    resetLights();

    currentState = (currentState + 1) % 4;

    switch (currentState) {
        case 0:
            redLight.style.backgroundColor = 'var(--steadycoloractive)';
            redLabel.classList.add('active');
            timerId = setTimeout(switchState, redDuration * 1000);
            break;

        case 1:
            yellowLight.style.backgroundColor = 'var(--readycoloractive)';
            yellowLabel.classList.add('active');
            timerId = setTimeout(switchState, yellowDuration * 1000);
            break;

        case 2:
            greenLight.style.backgroundColor = 'var(--gocoloractive)';
            greenLabel.classList.add('active');
            timerId = setTimeout(switchState, greenDuration * 1000);
            break;

        case 3:
            yellowLabel.textContent = blinkLabelText;
            yellowLabel.classList.add('active');

            let blinkCount = 0;
            let isYellowOn = false;

            blinkIntervalId = setInterval(() => {
                isYellowOn = !isYellowOn;
                yellowLight.style.backgroundColor = isYellowOn ? 'var(--readycoloractive)' : 'var(--readycoloroff)';
                blinkCount++;

                if (blinkCount >= 6) {
                    clearInterval(blinkIntervalId);
                    switchState();
                }
            }, 500);
            break;
    }
}

if (configBtn) {
    configBtn.addEventListener('click', () => {
        let newRed = parseInt(prompt("Enter RED light duration (sec):", redDuration));
        let newYellow = parseInt(prompt("Enter YELLOW light duration (sec):", yellowDuration));
        let newGreen = parseInt(prompt("Enter GREEN light duration (sec):", greenDuration));

        if (!isNaN(newRed) && newRed > 0) redDuration = newRed;
        if (!isNaN(newYellow) && newYellow > 0) yellowDuration = newYellow;
        if (!isNaN(newGreen) && newGreen > 0) greenDuration = newGreen;
    });
} else {
    console.warn("Settings button (#freq-btn) not found on the page.");
}

lightsContainer.addEventListener('click', () => {
    if (currentState === 3) {
        clearInterval(blinkIntervalId);
    }
    switchState();
});
switchState();