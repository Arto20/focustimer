let interval = null;
let endTime = null;
let timePattern = null;
let pause = false;
let timeLeft = 0;
const clickSound = new Audio('click.mp3')

styles = {
    "start": {bg:"#FFF", txt:"#000", hover:"#444"},
    "counting": {bg:"#000", txt:"#FFF", hover:"#AAA"},
    "pause": {bg:"#79B824", txt:"#FFF", hover:"#AAA"},
    "waiting": {bg:"#B84F12", txt:"#FFF", hover:"#AAA"},
}
// This code is a fucking turd and mess, but I'm too lazy to fix it now.

window.onload = function () {
    setStartState()
    updateCheckboxes()
}

function updateTime() {
    const now = new Date().getTime();
    if (endTime > now) {
        writeTime(Math.floor((endTime - now) / 1000));
    } else {
        playClick();
        if (!document.getElementById('auto_start').checked) {
            stopTimer();
            setWaitingState()
            writeToTemplate("Press continue when ready");
        } else {
            runTimer();
        }

    }
}

function setTimer() {
    // lol.
    let work_time = parseInt(document.getElementById('work_time').value) * 1000;
    let short_break = parseInt(document.getElementById('short_break').value) * 1000;
    let long_break = parseInt(document.getElementById('long_break').value) * 1000;
    work_time = !isNaN(work_time) ? work_time : parseInt(document.getElementById('work_time').placeholder) * 1000
    short_break = !isNaN(short_break) ? short_break : parseInt(document.getElementById('short_break').placeholder) * 1000
    long_break = !isNaN(long_break) ? long_break : parseInt(document.getElementById('long_break').placeholder) * 1000

    // add here tuples ("work time": work time, "short break": short_break) ?? So I can communicate "press continue
    // to start work time".
    timePattern = [work_time, short_break, work_time, short_break, work_time, short_break, work_time, long_break];
    runTimer()
}

function setEndTime() {
    const time = timePattern.shift();
    timePattern.push(time);
    endTime = new Date().getTime() + time;
}

function stopTimer() {
    if (pause) {
        pauseTimer()
    }
    setTimeDisableValue(false)
    setStartState()
    writeToTemplate("Click play to start.")
    clearInterval(interval);
}

function runTimer() {
    setTimeDisableValue(true)
    setCountingState()
    setEndTime();
    clearInterval(interval);
    interval = setInterval(updateTime, 100);
}

function writeToTemplate(value) {
    let tag = document.getElementById('timer');
    tag.innerText = value;
}

function writeTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = (time - minutes * 60).toLocaleString('en-US', {minimumIntegerDigits: 2});
    const text = minutes.toString() + ":" + seconds.toString();
    writeToTemplate(text);
}

function playClick() {
    const playSound = document.getElementById('play_sound').checked
    if (playSound) {
        clickSound.play().then();
    }
}

function pauseTimer() {
    if (pause) {
        setCountingState()
        pause = false;
        endTime = new Date().getTime() + timeLeft;
        timeLeft = 0;
        interval = setInterval(updateTime, 100);
    } else {
        setPauseState()
        pause = true;
        timeLeft = endTime - new Date().getTime();
        clearInterval(interval);
    }
}

function hideElement(elementID) {
    const element = document.getElementById(elementID)
    element.style.display = "none"
}

function showElement(elementID) {
    const element = document.getElementById(elementID)
    element.style.display = "block"
}

function updateCheckboxes() {
    if (document.getElementById('play_sound').checked) {
        showElement("sound_on")
        hideElement("sound_mute")
    }
    else {
        hideElement("sound_on")
        showElement("sound_mute")
    }
    if (document.getElementById('auto_start').checked) {
        showElement("auto_resume")
        hideElement("no_auto_resume")
    }
    else {
        hideElement("auto_resume")
        showElement("no_auto_resume")
    }
}

function changeValue(element, value) {
    let el = document.getElementById(element);
    if (el.disabled) {
        return;
    }
    if (isNaN(parseInt(el.value))) {
        el.value = parseInt(el.placeholder) + parseInt(value);
    }
    else {
        el.value = parseInt(el.value) + parseInt(value);
    }

    if (el.value < 0) {
        el.value = 0;
    }
}

function setTimeDisableValue(value) {
    document.querySelectorAll('input[type=number]').forEach(function(button) {
        button.disabled = value;
    })
}

function changeStyle(name) {
    const style = styles[name]
    let root = document.documentElement;
    root.style.setProperty('--background', style.bg)
    root.style.setProperty('--text', style.txt)
    root.style.setProperty('--hover', style.hover)
}

// UI states
function setStartState() {
    showElement('play')
    hideElement("stop")
    hideElement("continue")
    hideElement("pause")
    changeStyle('start')
}

function setCountingState() {
    hideElement('play')
    hideElement("stop")
    hideElement("continue")
    showElement("pause")
    changeStyle('counting')
}

function setPauseState() {
    hideElement('play')
    showElement("stop")
    hideElement("continue")
    showElement("pause")
    changeStyle('pause')
}

function setWaitingState() {
    hideElement('play')
    showElement("stop")
    showElement("continue")
    hideElement("pause")
    changeStyle('waiting')
}