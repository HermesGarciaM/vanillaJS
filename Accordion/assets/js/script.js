function toggleElement (element){
    if(element.classList.contains('closed')){
        let accordions = document.querySelectorAll('.wrapper');
        for (let key in accordions) {
            if(accordions.hasOwnProperty(key)) {
                accordions[key].classList.add("closed");
                accordions[key].classList.remove("opened");
            }
        }
        element.classList.remove("closed");
        element.classList.add("opened");
    }else if(element.classList.contains('opened')){
        element.classList.remove("opened");
        element.classList.add("closed");
    }
}