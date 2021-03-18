let tokenData,
    app = document.getElementById('app'),
    moreAnimals = document.getElementById('moreAnimals'),
    fadeTarget = document.getElementById('preloader'),
    goTopBtn = document.querySelector('.back-to-top'),
    page = 1,
    clientId = 'Oye2EyphIL3euN2Ueq0Q5KATmKPLi9AYlRiVsSOfGNQQXKxg8V',
    clientSecret = 'sbCLo32fDf6zWoKbbJV8fHEwQlgscRUmaTaGipmh',
    tokenExp;

function fadeLoader(){
    setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.1;
        } else {
            fadeTarget.style.display = "none";
            clearInterval(fadeLoader);
        }
    }, 20);
}

function trackScroll() {
    let scrolled = window.pageYOffset,
        coords = 80;
    if (scrolled > coords) goTopBtn.style.display = 'block';
    if (scrolled < coords) goTopBtn.style.display = 'none';
}

function backToTop() {
    if (window.pageYOffset > 0) {
        window.scrollTo(0,window.pageYOffset - 30);
        setTimeout(backToTop, 1);
    }
}

function serviceError() {
    const div = document.createElement('div');
    div.className = 'col-lg-8 col-10';
    div.innerHTML = `<div class="error">
                            <span>Ocurrió un error en el servicio <br> Intenta más tarde</span>
                        </div>
                         `;
    while(app.firstChild) app.removeChild(app.firstChild)
    app.appendChild(div);
    moreAnimals.remove();
    fadeLoader();
}

function getToken(){
    return new Promise(function(resolve) {
        if (typeof tokenExp === 'undefined' || tokenExp < Math.round(new Date().getTime() / 1000)) {
            fetch('https://api.petfinder.com/v2/oauth2/token', {
                method: 'POST',
                body: 'grant_type=client_credentials&client_id=' + clientId + '&client_secret=' + clientSecret,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response) {
                return (response.ok)? response.json() : Promise.reject(response);
            }).then(function (data) {
                tokenData = data;
                tokenExp = Math.round(new Date().getTime() / 1000) + (data.expires_in -  data.expires_in/10);
                resolve();
            }).catch(function () {
                serviceError();
            });
        }else {
            resolve();
        }
    });
}

function getAnimals(page = 1){
    getToken().then(function () {
        fetch('https://api.petfinder.com/v2/animals?sort=-recent&page=' + page, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': tokenData.token_type + ' ' + tokenData.access_token
            }
        }).then(function (response) {
            return (response.ok) ? response.json() : Promise.reject(response);
        }).then(function (data) {
            data.animals.forEach(function (animal) {
                let animalPhoto = 'assets/img/generic.png';
                if (animal.photos.length) {
                    animalPhoto = animal.photos[0].medium;
                }
                const div = document.createElement('div');
                div.className = 'col-lg-3 col-md-4 col-sm-6 col-8';
                div.innerHTML = `<article class="animal" id="` + animal.id + `">
                                    <div class="photo">
                                        <img src="` + animalPhoto + `" alt="` + animal.name + `">
                                    </div>
                                    <div class="body">
                                        <div class="name">` + animal.name + `</div>
                                        <div class="type">` + animal.type + `</div>
                                        <div class="gender"><span>Gender: </span>` + animal.gender + `</div>
                                    </div>
                                    <div class="footer">
                                        <div class="status"><span>Status: </span>` + animal.status + `</div>
                                    </div>
                                 </article>`;
                app.appendChild(div);
            });
            if (page === 1) {
                fadeLoader();
            } else {
                let btn = moreAnimals;
                btn.disabled = false;
                btn.innerHTML = "Show More Pets"
            }
        }).catch(function () {
            serviceError();
        });
    });
}


function getAnimal(id){
    return new Promise(function(resolve) {
        getToken().then(function () {
            fetch('https://api.petfinder.com/v2/animals/' + id, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': tokenData.token_type + ' ' + tokenData.access_token
                }
            }).then(function (response) {
                return (response.ok) ? response.json() : Promise.reject(response);
            }).then(function (data) {
                resolve(data.animal);
            }).catch(function () {
                serviceError();
            });
        });
    });
}

moreAnimals.addEventListener("click", function() {
    this.disabled = true;
    this.innerHTML = "Loading..."
    page++;
    getAnimals(page);
});

window.addEventListener('scroll', trackScroll);
goTopBtn.addEventListener('click', function (event){
    event.preventDefault();
    backToTop();
});


document.addEventListener('click', function(event){
    if (event.target && event.target.closest('article')) {
        document.getElementById('loader').style.display = 'block';
        getAnimal(event.target.closest('article').id).then(function (animal){
            let modalBody = document.querySelector('.modal-body');
            while(modalBody.firstChild) modalBody.removeChild(modalBody.firstChild)
            let animalPhoto = 'assets/img/generic.png';
            if (animal.photos.length) {
                animalPhoto = animal.photos[0].medium;
            }
            const div = document.createElement('div');
            div.className = 'animalModalInfo';
            div.innerHTML = `<div class="photo">
                                <img src="` + animalPhoto + `" alt="` + animal.name + `">
                             </div>
                             <div class="body">
                                <div class="name">` + animal.name + `</div>
                                <div>` + animal.type + `</div>
                                <div><span>Gender: </span>` + animal.gender + `</div>
                                <div><span>Age: </span>` + animal.age + `</div>
                                <div><span>Breed: </span>` + animal.breeds.primary + `</div>
                                <div><span>Size: </span>` + animal.size + `</div>
                                <div><span>Specie: </span>` + animal.species + `</div>
                                <div><span>Status: </span>` + animal.status + `</div>
                             </div>`;
            modalBody.appendChild(div);
            document.getElementById('moreInfoRef').href = animal.url;

            $('#animalModal').modal(); //w Jquery because of Bootstrap 4
            document.getElementById('loader').style.display = 'none';
        });
    }
});

getToken().then(function (){
    getAnimals();
});