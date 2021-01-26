let interval = null;
let endTime = null;
let timePattern = null;
let startAutomatically = true;
let pause = false;
let timeLeft = 0;
const clickSound = new Audio('click.mp3')


// This code is a fucking turd and mess, but I'm too lazy to fix it now.

function updateTime(){
    const now = new Date().getTime();
    if(endTime > now) {
        writeTime(Math.floor((endTime - now) / 1000));
    } else {
        playClick();
        if(!startAutomatically) {
            stopTimer();
            writeToTemplate("Press continue when ready");
        } else {
            runTimer();
        }

    }
}

function setTimer() {
    // lol.
    let work_time = parseInt(document.getElementById('work_time').value) * 1000 * 60;
    let short_break = parseInt(document.getElementById('short_break').value) * 1000 * 60;
    let long_break = parseInt(document.getElementById('long_break').value) * 1000 * 60;
    work_time = !isNaN(work_time) ? work_time : parseInt(document.getElementById('work_time').placeholder) * 1000 * 60
    short_break = !isNaN(short_break) ? short_break : parseInt(document.getElementById('short_break').placeholder) * 1000 * 60
    long_break = !isNaN(long_break) ? long_break : parseInt(document.getElementById('long_break').placeholder) * 1000 * 60

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
    writeToTemplate("Click play to start.")
    clearInterval(interval);
}

function runTimer() {
    setEndTime();
    clearInterval(interval);
    interval = setInterval(updateTime,100);
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
    if(playSound) {
        clickSound.play().then();
    }
}

function pauseTimer() {
    if (pause) {
        pause = false;
        endTime = new Date().getTime() + timeLeft;
        timeLeft = 0;
        interval = setInterval(updateTime,100);
    } else {
        pause = true;
        timeLeft = endTime - new Date().getTime();
        clearInterval(interval);
    }
}

function updateCheckboxes() {
    startAutomatically = document.getElementById('auto_start').checked
}

