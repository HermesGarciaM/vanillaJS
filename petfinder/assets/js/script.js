let tokenData,
    app = document.getElementById('app'),
    moreAnimals = document.getElementById('moreAnimals'),
    moreAnimalsDiv = document.getElementById('moreAnimalsDiv'),
    fadeTarget = document.getElementById('preloader'),
    goTopBtn = document.querySelector('.back-to-top'),
    page = 1,
    lastPage = false,
    clientId = 'Oye2EyphIL3euN2Ueq0Q5KATmKPLi9AYlRiVsSOfGNQQXKxg8V',
    clientSecret = 'sbCLo32fDf6zWoKbbJV8fHEwQlgscRUmaTaGipmh',
    tokenExp,
    filters = '',
    typeF = '', sizeF = '', genderF = '' , ageF = '';

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

function toggleLoader(display){
    document.getElementById('loader').style.display = display;
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

function serviceError(msg) {
    const div = document.createElement('div');
    div.className = 'col-lg-8 col-10';
    div.innerHTML = `<div class="error">
                            <span>` + msg + `</span>
                        </div>
                         `;
    while(app.firstChild) app.removeChild(app.firstChild)
    app.appendChild(div);
    moreAnimals.remove();
    fadePreloader();
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
                serviceError('Service Error <br> Please try again later');
            });
        }else {
            resolve();
        }
    });
}

function getAnimals(page = 1){
    return new Promise(function(resolve) {
        getToken().then(function () {
            fetch('https://api.petfinder.com/v2/animals?sort=-recent&page=' + page + filters, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': tokenData.token_type + ' ' + tokenData.access_token
                }
            }).then(function (response) {
                return (response.ok) ? response.json() : Promise.reject(response);
            }).then(function (data) {
                if(filters !== '' && page === 1){
                    while(app.firstChild) app.removeChild(app.firstChild)
                }
                if(data.animals.length){
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
                    if(page === data.pagination.total_pages){
                        lastPage = true;
                        moreAnimalsDiv.style.display = 'none';
                    }else{
                        lastPage = false;
                        moreAnimalsDiv.style.display = 'flex';
                    }
                }else{
                    serviceError('No pets in this selection <br> Please try again later')
                }
                resolve();
            }).catch(function () {
                serviceError('Service Error <br> Please try again later');
            });
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
                serviceError('Service Error <br> Please try again later');
            });
        });
    });
}

function getAnimalTypes(){
    return new Promise(function(resolve) {
        getToken().then(function () {
            fetch('https://api.petfinder.com/v2/types', {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': tokenData.token_type + ' ' + tokenData.access_token
                }
            }).then(function (response) {
                return (response.ok) ? response.json() : Promise.reject(response);
            }).then(function (data) {
                let types = data.types;
                types.forEach(function (type){
                    let opt = document.createElement('option');
                    opt.value = type.name;
                    opt.innerHTML = type.name;
                    document.getElementById('type').appendChild(opt);
                });
                resolve();
            }).catch(function () {
                serviceError('Service Error <br> Please try again later');
            });
        });
    });
}

moreAnimals.addEventListener("click", function() {
    toggleLoader('block');
    this.disabled = true;
    this.innerHTML = "Loading..."
    page++;
    getAnimals(page).then(r => {
        let btn = moreAnimals;
        btn.disabled = false;
        btn.innerHTML = "Show More Pets"
        toggleLoader('none');
    });
});

window.addEventListener('scroll', trackScroll);
goTopBtn.addEventListener('click', function (event){
    event.preventDefault();
    backToTop();
});


document.addEventListener('click', function(event){
    if (event.target && event.target.closest('article')) {
        toggleLoader('block');
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
                                <div class="description">` + animal.description + `</div>
                                <div class="attr"><span>Gender: </span>` + animal.gender + `</div>
                                <div class="attr"><span>Age: </span>` + animal.age + `</div>
                                <div class="attr"><span>Breed: </span>` + animal.breeds.primary + `</div>
                                <div class="attr"><span>Size: </span>` + animal.size + `</div>
                                <div class="attr"><span>Specie: </span>` + animal.species + `</div>
                                <div class="attr"><span>Status: </span>` + animal.status + `</div>
                             </div>`;
            modalBody.appendChild(div);
            document.getElementById('moreInfoRef').href = animal.url;
            $('#animalModal').modal(); //w Jquery because of Bootstrap 4
            toggleLoader('none');
        });
    }
});


document.querySelectorAll('select').forEach(element => {
    element.addEventListener('change', function() {
        toggleLoader('block');
        switch (this.id){
            case 'type':
                typeF = (this.value === '0')? '' : '&type=' + this.value;
                break;
            case 'size':
                sizeF = (this.value === '0')? '' : '&size=' + this.value;
                break;
            case 'gender':
                genderF = (this.value === '0')? '' : '&gender=' + this.value;
                break;
            case 'age':
                ageF = (this.value === '0')? '' : '&age=' + this.value;
                break;
            default:
                break;
        }
        filters = typeF + sizeF + genderF + ageF;
        page = 1;
        getAnimals(page).then(function (){
            toggleLoader('none');
        });
    })
});


getToken().then(function (){
    getAnimalTypes().then(function (){
        getAnimals().then(r => {
            fadePreloader();
        });
    });
});
