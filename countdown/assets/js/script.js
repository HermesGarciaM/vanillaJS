let counter = document.getElementById('app'),
    controlBtns = document.getElementById('controlBtns'),
    pauseBtn = document.getElementById('pause'),
    pause = false,
    timeOut,
    timer;

document.getElementById('submit').addEventListener('click', function() {
    let pattern = /^[0-5][0-9]:[0-5][0-9]$/,
        value = document.getElementById('timeout').value;
    if(pattern.test(value)){
        startCountdown();
    }else{
        alert('Please type a time in minutes:seconds');
    }
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

document.getElementById('timeout').addEventListener('input', function (e){
    let keycode = (e.which) ? e.which : e.keyCode;
    if(keycode !== 37 && keycode !== 39) {
        if (!/^[0-9+.-]*$/i.test(this.value)) {
            this.value = this.value.replace(/[^0-9+.-]+/ig, "");
        }
    }
});

function startCountdown(resume = false){
    counter.innerHTML = '';
    counter.classList.remove('finish');
    counter.classList.remove('paused');
    timeOut = (resume)? timeOut : (parseInt(document.getElementById('timeout').value.substr(0,2)) * 60) + parseInt(document.getElementById('timeout').value.substr(3,5));
    clearInterval(timer);
    if( (timeOut > 0 && timeOut <= 6039) || (resume === true ) ){
        let mins = Math.floor(timeOut / 60),
            secs = timeOut - mins * 60;
        counter.innerHTML = formatTime(mins) + ':' + formatTime(secs);
        decreaseTime();
        controlBtns.style.display = 'block';
    }else{
        controlBtns.style.display = 'none';
        alert('Please type a time in minutes:seconds');
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

function doFormat(value, pattern, mask, e= false) {
    let strippedValue = value.replace(/[^0-9]/g, ""),
        chars = strippedValue.split(''),
        count = 0,
        formatted = '';
    for (let i = 0; i < pattern.length; i++) {
        const c = pattern[i];
        if(chars[count]) {
            if (/\*/.test(c)) {
                formatted += chars[count];
                count++;
            }else {
                formatted += c;
            }
        }else if(mask) {
            if (mask.split('')[i])
                formatted += mask.split('')[i];
        }
    }
    return formatted;
}

function format(element,event) {
    const val = doFormat(element.value, element.getAttribute('data-format'),false,event);
    element.value = doFormat(element.value, element.getAttribute('data-format'), element.getAttribute('data-mask'),event);
    if (element.selectionStart) {
        element.focus();
        element.setSelectionRange(val.length, val.length);
    }
}

document.querySelectorAll('[data-mask]').forEach(function(e) {
    e.addEventListener('keyup', function (event) {
        let keycode = (event !== false)? (e.which) ? e.which : event.keyCode : '';
        if(keycode !== 37 && keycode !== 39) {
            format(e, event);
        }
    });
});