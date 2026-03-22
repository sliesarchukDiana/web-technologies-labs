const onoffStandard = document.getElementById("onoff");
const onoffLED = document.getElementById("LEDonoff");
const body = document.querySelector("body");

const standardContainer = document.getElementById("standard-container");
const ledContainer = document.getElementById("led-container");
const switchBulbBtn = document.getElementById("switch-bulb-btn");

function toggleLight(e) {
    if (e.target.checked) {
        body.classList.add('lighton');
    } else {
        body.classList.remove('lighton');
    }
}

onoffStandard.addEventListener("change", toggleLight);
onoffLED.addEventListener("change", toggleLight);

switchBulbBtn.addEventListener("click", () => {
    body.classList.remove('lighton');
    onoffStandard.checked = false;
    onoffLED.checked = false;

    if (standardContainer.classList.contains("hidden")) {
        standardContainer.classList.remove("hidden");
        ledContainer.classList.add("hidden");
    } else {
        standardContainer.classList.add("hidden");
        ledContainer.classList.remove("hidden");
    }
});