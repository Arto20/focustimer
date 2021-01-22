let interval = null;
let endTime = null;
let timePattern = null;
let startAutomatically = true;
let pause = false;
const clickSound = new Audio('click.mp3')


function updateTime(){
    const now = new Date().getTime();
    if(endTime > now) {
        writeTime(Math.floor((endTime - now) / 1000));
    } else {
        playClick();
        if(!startAutomatically) {
            writeToTemplate("Press continue when ready");
            stopTimer();
        } else {
            runTimer();
        }

    }
}

function setTimer() {
    const work_time = parseInt(document.getElementById('work_time').value) * 1000 ;
    const short_break = parseInt(document.getElementById('short_break').value) * 1000;
    const long_break = parseInt(document.getElementById('long_break').value) * 1000 ;
    startAutomatically = document.getElementById('auto_start').checked // move it outside, so you can change
    // it when the timer is already running

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

