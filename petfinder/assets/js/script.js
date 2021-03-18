let tokenData, page=1;

(function getToken(){
    fetch('https://api.petfinder.com/v2/oauth2/token', {
        method: 'POST',
        body: 'grant_type=client_credentials&client_id=Oye2EyphIL3euN2Ueq0Q5KATmKPLi9AYlRiVsSOfGNQQXKxg8V&client_secret=sbCLo32fDf6zWoKbbJV8fHEwQlgscRUmaTaGipmh',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function (response) {
        return (response.ok)? response.json() : Promise.reject(response);
    }).then(function (data) {
        tokenData = data;
        getAnimals(page);
    }).catch(function (err) {
        // There was an error - improve error mngemnt
        console.warn('Something went wrong.', err);
    });
})();

function getAnimals(page){
    fetch('https://api.petfinder.com/v2/animals?sort=-recent&page=' + page, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': tokenData.token_type + ' ' + tokenData.access_token //add token expire validation
        }
    }).then(function (response) {
        return (response.ok)? response.json() : Promise.reject(response);
    }).then(function (data) {
        data.animals.forEach(function (animal){
            let animalPhoto = 'assets/img/generic.png';
            if(animal.photos.length){
                animalPhoto = animal.photos[0].medium;
            }
            const div = document.createElement('div');
            div.className = 'col-lg-3 col-md-4 col-sm-6 col-8';
            div.innerHTML = `<article class="animal" id="`+ animal.id + `">
                                <div class="photo">
                                    <img src="`+ animalPhoto + `" alt="`+ animal.name + `">
                                </div>
                                <div class="body">
                                    <div class="name">`+ animal.name + `</div>
                                    <div class="type">`+ animal.type + `</div>
                                    <div class="gender"><span>Gender: </span>`+ animal.gender + `</div>
                                </div>
                                <div class="footer">
                                    <div class="status"><span>Status: </span>`+ animal.status + `</div>
                                </div>
                             </article>`;
            document.getElementById('app').appendChild(div);
            console.log(animal);
        });
        if(page === 1){
            let fadeTarget = document.getElementById('preloader'),
                fadeEffect = setInterval(function () {
                    if (!fadeTarget.style.opacity) {
                        fadeTarget.style.opacity = 1;
                    }
                    if (fadeTarget.style.opacity > 0) {
                        fadeTarget.style.opacity -= 0.1;
                    } else {
                        fadeTarget.remove();
                        clearInterval(fadeEffect);
                    }
                }, 50);
        }else{
            let btn = document.getElementById('moreAnimals');
            btn.disabled = false;
            btn.innerHTML = "Show More Pets"
        }
    }).catch(function (err) {
        // There was an error - improve error mngemnt
        console.warn('Something went wrong.', err);
    });
}


function getAnimal(id){
    fetch('https://api.petfinder.com/v2/animals/' + id, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': tokenData.token_type + ' ' + tokenData.access_token //add token expire validation
        }
    }).then(function (response) {
        return (response.ok)? response.json() : Promise.reject(response);
    }).then(function (data) {
        console.log(data);
    }).catch(function (err) {
        // There was an error - improve error mngemnt
        console.warn('Something went wrong.', err);
    });
}



document.getElementById("moreAnimals").addEventListener("click", function() {
    this.disabled = true;
    this.innerHTML = "Loading..."
    page++;
    getAnimals(page);
});