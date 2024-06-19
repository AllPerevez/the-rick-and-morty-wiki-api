// Функция для создания запроса фильтрации
function buildQuery(params) {
    const query = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&');
    return query ? `?${query}` : '';
}

async function getData(params = {}) {
    const baseUrl = 'https://rickandmortyapi.com/api/character/';
    const queryString = buildQuery(params);
    const url = `${baseUrl}${queryString}`;
    const response = await fetch(url);
    const data = await response.json();

    return data;
}

async function main() {
    let charactersData = await getData();

    // Функция для отрисовки карточек
    function displayCharacters(characters) {
        const cards = document.querySelector('.characters-cards');
        cards.innerHTML = '';

        characters.results.forEach(character => {
            const { id, name, gender, image, species, status, url, location: { name: locationName }, origin: { name: originName } } = character;
            const card = document.createElement('div');
            const cardInfo = document.createElement('div');
            const cardTitle = document.createElement('p');
            const cardImg = document.createElement('img');
            const cardGender = document.createElement('p');
            const cardSpecies = document.createElement('p');
            const cardStatus = document.createElement('span');
            const cardLocation = document.createElement('p');
            const cardOrigin = document.createElement('p');
            const cardMoreInfo = document.createElement('a');

            card.classList.add('card');
            cardInfo.classList.add('card-info');

            cardImg.classList.add('card__img');
            cardImg.src = image;

            cardTitle.classList.add('card__title');
            cardTitle.innerHTML = name;

            cardGender.classList.add('card__gender');
            cardGender.innerHTML = `Gender: ${gender}`;

            cardSpecies.classList.add('card__species');
            cardSpecies.innerHTML = `Specie: ${species}`;

            if (status == 'Alive') {
                cardStatus.classList.add('status_alive');
            } else if (status == 'Dead') {
                cardStatus.classList.add('status_dead');
            } else {
                cardStatus.classList.add('status_unknown');
            }
            cardStatus.innerHTML = status;

            cardLocation.classList.add('card__location');
            cardLocation.innerHTML = `Location: ${locationName}`;

            cardOrigin.classList.add('card__origin');
            cardOrigin.innerHTML = `Origin: ${originName}`;

            cardMoreInfo.classList.add('card__info');
            cardMoreInfo.href = url;
            cardMoreInfo.innerHTML = 'View Details ...';
            cardMoreInfo.onclick = (e) => { e.preventDefault(); }

            cards.appendChild(card);
            card.appendChild(cardImg);
            card.appendChild(cardInfo);
            cardInfo.appendChild(cardTitle);
            cardInfo.appendChild(cardGender);
            cardInfo.appendChild(cardSpecies);
            cardInfo.appendChild(cardStatus);
            cardInfo.appendChild(cardLocation);
            cardInfo.appendChild(cardOrigin);
            cardInfo.appendChild(cardMoreInfo);
        })
    }

    displayCharacters(charactersData);

    const btn = document.querySelector('.search-btn');
    btn.addEventListener("click", searchCharacter);

    // Функция для фильтрации карточек
    async function searchCharacter() {
        const nameValue = document.querySelector('.search-input').value.toLowerCase();
        const statusValue = document.querySelector('.search-status').value.toLowerCase();
        const genderValue = document.querySelector('.search-gender').value.toLowerCase();

        const params = {};

        if (nameValue) { params.name = nameValue; }
        if (statusValue) { params.status = statusValue; }
        if (genderValue) { params.gender = genderValue; }

        charactersData = await getData(params);

        displayCharacters(charactersData);

        document.querySelector('.search-input').value = '';
        document.querySelector('.search-status').value = '';
        document.querySelector('.search-gender').value = '';
        document.querySelector('.search-input').focus();
    }

    // Постраничная пагинация
    // Находим общее кол-во страниц
    async function getTotalPages() {
        const data = await getData();
        return data.info.pages;
    }

    let currentPage = 1;

    async function displayPagination() {
        const totalPages = await getTotalPages();
        const pagination = document.querySelector('.pagination');

        const ulPage = document.createElement('ul');
        ulPage.classList.add('pagination__list');

        for (let i = 0; i < totalPages; i++) {
            const liPage = displayPage(i + 1);
            ulPage.appendChild(liPage);

        }
        pagination.appendChild(ulPage);
    }

    function displayPage(page) {
        const liPage = document.createElement('li');
        liPage.classList.add('pagination__item');
        liPage.innerHTML = page;

        if (page == currentPage) {
            liPage.classList.add('pagination__item_active');
        }

        liPage.addEventListener("click", async () => {
            document.querySelector('.pagination__item_active').classList.remove('pagination__item_active');
            currentPage = page;
            liPage.classList.add('pagination__item_active');

            const params = { page };
            charactersData = await getData(params);
            
            displayCharacters(charactersData);
            window.scrollTo(pageXOffset, 0);
        });
        return liPage;
    }

    displayPagination();

}

main();