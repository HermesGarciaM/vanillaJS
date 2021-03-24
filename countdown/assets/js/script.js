let counter = document.getElementById('app'),
    controlBtns = document.getElementById('controlBtns'),
    pauseBtn = document.getElementById('pause'),
    pause = false,
    timeOut,
    timer;

document.getElementById('timeout').focus();

document.getElementById('submit').addEventListener('click', function() {
    startCountdown();
    return false;
});

document.getElementById('restart').addEventListener('click', function() {
    startCountdown();
    pauseBtn.innerHTML = 'Pause';
    pause = false;
    counter.classList.remove('paused');
});

document.getElementById('pause').addEventListener('click', function() {
    tooglePause();
});

document.getElementById('timeout').addEventListener('keydown', function (e){
    let code = (e.which) ? e.which : e.keyCode;
    ( code > 31 && !( (code >= 48 && code <= 57) || (code >= 96 && code <= 105) ))? e.preventDefault():'';
});

function startCountdown(resume = false){
    counter.innerHTML = '';
    counter.classList.remove('finish');
    counter.classList.remove('paused');
    let value = (resume)? timeOut : document.getElementById('timeout').value;
    clearInterval(timer);
    if( (value > 0 && value <= 60) || (resume === true ) ){
        timeOut = (resume)? timeOut : value * 60;
        let mins = Math.floor(timeOut / 60),
            secs = timeOut - mins * 60;
        counter.innerHTML = formatTime(mins) + ':' + formatTime(secs);
        decreaseTime();
        controlBtns.style.display = 'block';
    }else{
        controlBtns.style.display = 'none';
        alert("Please type a number between 1 & 60");
    }
}

function decreaseTime(){
    timer = setTimeout(function (){
        timeOut--;
        let mins = Math.floor(timeOut / 60),
            secs = timeOut - mins * 60;
        counter.innerHTML = formatTime(mins) + ':' + formatTime(secs);

        if(timeOut < 1){
            clearInterval(timer);
            counter.classList.add('finish');
            controlBtns.style.display = 'none';
        }else{
            decreaseTime();
        }
    },1000);
}

function formatTime(num) {
    return (new Array(3).join('0')+num).slice(-2);
}

function tooglePause(){
    if(pause){
        startCountdown(true);
        pauseBtn.innerHTML = 'Pause';
        counter.classList.remove('paused');
        pause = false;
    }else{
        clearInterval(timer);
        counter.classList.add('paused');
        pauseBtn.innerHTML = 'Resume';
        pause = true;
    }
}