function initClock() {
    const hoursEl = document.getElementById('clock-hours');
    const minsEl = document.getElementById('clock-minutes');
    const secsEl = document.getElementById('clock-seconds');

    function update() {
        const now = new Date();
        hoursEl.textContent = String(now.getHours()).padStart(2, '0');
        minsEl.textContent = String(now.getMinutes()).padStart(2, '0');
        secsEl.textContent = String(now.getSeconds()).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
}
initClock();

let timerIntervalId;

document.getElementById('start-timer-btn').addEventListener('click', () => {
    const inputVal = document.getElementById('timer-input').value;
    if (!inputVal) return;

    const targetDate = new Date(inputVal).getTime();
    const displayEl = document.getElementById('timer-display');

    clearInterval(timerIntervalId);

    timerIntervalId = setInterval(() => {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff <= 0) {
            clearInterval(timerIntervalId);
            displayEl.textContent = "Time's up!";
            displayEl.style.color = "var(--glowcolor)";
            return;
        }

        displayEl.style.color = "var(--accentcolor)";
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);

        displayEl.textContent = `${d}d ${h}h ${m}m ${s}s`;
    }, 1000);
});

const calInput = document.getElementById('calendar-month-input');
const calGrid = document.getElementById('calendar-grid');

function renderCalendar(year, month) {
    calGrid.innerHTML = '';

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let firstDayIndex = new Date(year, month, 1).getDay() - 1;
    if (firstDayIndex === -1) firstDayIndex = 6;

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    for (let i = 0; i < firstDayIndex; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('empty');
        calGrid.appendChild(emptyDiv);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = i;
        if (isCurrentMonth && i === today.getDate()) {
            dayDiv.classList.add('today');
        }
        calGrid.appendChild(dayDiv);
    }
}

const currentDate = new Date();
calInput.value = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
renderCalendar(currentDate.getFullYear(), currentDate.getMonth());

calInput.addEventListener('change', (e) => {
    const [year, month] = e.target.value.split('-');
    renderCalendar(parseInt(year), parseInt(month) - 1);
});

const bdayInput = document.getElementById('bday-input');
const bdayDisplay = document.getElementById('bday-display');
let bdayIntervalId;

bdayInput.addEventListener('change', () => {
    clearInterval(bdayIntervalId);

    function updateBdayCountdown() {
        if (!bdayInput.value) return;

        const now = new Date();
        const bdayDate = new Date(bdayInput.value);

        let nextBday = new Date(now.getFullYear(), bdayDate.getMonth(), bdayDate.getDate());

        if (now > nextBday) {
            nextBday.setFullYear(now.getFullYear() + 1);
        }

        const diffMs = nextBday - now;

        let months = nextBday.getMonth() - now.getMonth();
        if (months < 0) months += 12;

        let days = nextBday.getDate() - now.getDate();
        if (days < 0) {
            months -= 1;
            if (months < 0) months += 12;
            const prevMonthDate = new Date(nextBday.getFullYear(), nextBday.getMonth(), 0);
            days += prevMonthDate.getDate();
        }

        days -= 1;
        if (days < 0) {
            days = 0;
        }

        const h = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diffMs / 1000 / 60) % 60);
        const s = Math.floor((diffMs / 1000) % 60);

        if (diffMs <= 0 || (months === 0 && days === 0 && h === 0 && m === 0 && s === 0)) {
            bdayDisplay.textContent = "Happy Birthday! 🎉";
            bdayDisplay.style.color = "var(--glowcolor)";
            clearInterval(bdayIntervalId);
            return;
        }

        bdayDisplay.textContent = `Time left: ${months} mo, ${days} d, ${h} h, ${m} m, ${s} s`;
        bdayDisplay.style.color = "var(--accentcolor)";
    }

    updateBdayCountdown();
    bdayIntervalId = setInterval(updateBdayCountdown, 1000);
});