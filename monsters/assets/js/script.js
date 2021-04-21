let fadeTarget = document.getElementById('preloader'),
    app = document.getElementById('app'),
    counter = 0,
    modalImage = document.getElementById('modal-image');
    modalData = document.getElementById('modal-data');
    monsters = [
        'sock.svg',
        'monster1.svg',
        'monster2.svg',
        'monster3.svg',
        'monster4.svg',
        'monster5.svg',
        'monster6.svg',
        'monster7.svg',
        'monster8.svg',
        'monster9.svg',
        'monster10.svg',
        'monster11.svg'
    ];

function fadePreloader(){
    setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.1;
        } else {
            fadeTarget.style.display = "none";
            clearInterval(fadePreloader);
        }
    }, 20);
}

function renderGame(newGame = false){
    if(newGame){
        app.removeChild(app.firstChild);
    }

    let parentElement = document.createElement('div');
    parentElement.className = 'doors';
    monsters = shuffle(monsters);
    monsters.map(function (monster,index){
        let element = document.createElement('div');
        let img = document.createElement('img');
        img.className = 'door-img';
        img.src = './assets/img/door.svg';
        element.className = "door";
        element.appendChild(img);
        parentElement.appendChild(element);
    });
    app.appendChild( parentElement );

    document.querySelectorAll('.door').forEach(function (item,index){
        item.addEventListener('click', function () {
            openDoor(item,index);
        });
    });
    console.log(monsters);
    fadePreloader();
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function openDoor(el,index){
    let image = el.firstChild;
    image.className = 'monster-img';
    image.src = './assets/img/' + monsters[index];
    counter++;
    if(monsters[index] === "sock.svg"){
        loser();
    }else if(counter === 11){
        winwin();
    }
}

function winwin(){
    removeClickeableObjects();
    modalImage.src = './assets/img/winner.gif';
    modalData.textContent = 'Congratulations! You found all your monster friends.';
    document.getElementById('playAgain').classList.add('btn-success');
    $('#finishGame').modal(); //w Jquery because of Bootstrap 4
}

function loser(){
    removeClickeableObjects()
    modalImage.src = './assets/img/loser.gif';
    modalData.textContent = 'You lose! Be careful next time.';
    document.getElementById('playAgain').classList.add('btn-danger');

    $('#finishGame').modal(); //w Jquery because of Bootstrap 4
}

function removeClickeableObjects(){

    document.querySelectorAll('.door').forEach(function (item,index){
        item.style.pointerEvents = 'none';
        console.log("remover event")
    });
}

document.getElementById('playAgain').addEventListener('click', item =>{
   renderGame(true);
    $('#finishGame').modal('hide')
});



renderGame();