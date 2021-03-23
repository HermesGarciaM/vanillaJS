let counter = document.getElementById('app'),
    controlBtns = document.getElementById('controlBtns'),
    pauseBtn = document.getElementById('pause'),
    pause = false,
    timeOut,
    timer;

document.getElementById('timeout').focus();

document.getElementById('submit').addEventListener('click', function() {
    startCountdown();
});


document.getElementById('restart').addEventListener('click', function() {
    startCountdown();
});

document.getElementById('pause').addEventListener('click', function() {
    tooglePause();
});

document.getElementById('timeout').addEventListener('keydown', function (e){
    let code = (e.which) ? e.which : e.keyCode;
    ( code > 31 && !( (code >= 48 && code <= 57) || (code >= 96 && code <= 105) ))? e.preventDefault():'';
});

function decreaseTime(){
    timer = setTimeout(function (){
        timeOut--;
        let mins = Math.floor(timeOut / 60),
            secs = timeOut - mins * 60;
        counter.innerHTML = formatTime(mins) + ':' + formatTime(secs);
        decreaseTime();
    },1000); //update every second
}

function formatTime(num) {
    return (new Array(3).join('0')+num).slice(-2);
}

function startCountdown(resume = false){
    counter.innerHTML = '';
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

function tooglePause(){
    if(pause){
        startCountdown(true);
        pauseBtn.innerHTML = 'Pause';
        pause = false;
    }else{
        clearInterval(timer);
        pauseBtn.innerHTML = 'Resume';
        pause = true;
    }
}

//TO DO - timer go to 0
//check input number numpad
