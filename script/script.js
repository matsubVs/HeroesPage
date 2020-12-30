String.prototype.firstLetterCaps = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

class CardsGenerator {
    constructor(menu, cards) {
        this.menu = menu;
        this.cards = cards;
        this.reload = true;
        this.cardWorker();
        this.menuEventHandler();
    }

    menuEventHandler() {
        this.menu.addEventListener('click', event => {
            const target = event.target;
            if (target.matches('.list__item')) {
                target.classList.toggle('list__item-active');
                this.cardWorker();
            }
        });
    }

    createCardElement(params) {
        const divElement = document.createElement('div');
        divElement.classList.add('cards__card');
        const additionalItems = [];

        for (const [key, value] of params) {

            if (key === 'photo') {
                const imgWrapper = document.createElement('div');
                imgWrapper.classList.add('cards__img');

                const imgElement = document.createElement('img');
                imgElement.src = value;

                imgWrapper.appendChild(imgElement);
                divElement.appendChild(imgWrapper);
                continue;

            } else if (key === 'movies') {

                const filmsWrapper = document.createElement('div');
                filmsWrapper.classList.add('cards__films');
                filmsWrapper.classList.add('films');

                const spanItem = document.createElement('span');
                spanItem.classList.add('title');
                spanItem.textContent = 'Films: ';
                filmsWrapper.appendChild(spanItem);

                const olItem = document.createElement('ol');
                olItem.classList.add('films__list');
                value.forEach(item => {
                    const liElement = document.createElement('li');
                    liElement.classList.add('films__item');
                    liElement.textContent = item;
                    
                    olItem.appendChild(liElement);
                });

                filmsWrapper.appendChild(olItem);
                additionalItems.push(filmsWrapper);

            } else {

                const element = document.createElement('div');
                element.classList.add(`cards__${key.toLowerCase()}`);

                const spanItem = document.createElement('span');
                spanItem.classList.add('title');
                spanItem.textContent = `${key.firstLetterCaps()}: `;
                element.insertAdjacentElement('afterbegin', spanItem);

                element.insertAdjacentText('beforeend', `${value}`);

                additionalItems.push(element);
            }
        }

        additionalItems.forEach(item => {
            divElement.appendChild(item);
        });

        return divElement;
    }

    createMenuElement(item) {
        const li = document.createElement('li');
        li.classList.add('list__item');
        li.textContent = item;

        return li;
    }

    renderCards(data) {
        this.cards.innerHTML = '';

        const filterConditions = this.getSelectedFilms();
        if (filterConditions) {
            data = data.filter(item => {
                if (item.movies) {
                    const executor = filterConditions.every(elem => item.movies.includes(elem));
                    return executor;
                } else {
                    return false;
                }
            });
        }
        data.forEach(item => {
            const entries = Object.entries(item);
            const newElement = this.createCardElement(entries);
            this.cards.appendChild(newElement);
        });
    }

    renderMenu(data) {
        // this.menu.innerHTML = '';
        const allFilms = this.getAllFilms(data);
        
        allFilms.forEach(item => this.menu.appendChild(this.createMenuElement(item)));
    }

    getAllFilms(data) {
        const films = new Set();
        data.forEach(item => {
            if (item.movies) {
                item.movies.forEach(item => films.add(item));
            }
        });

        return films;
    }

    getSelectedFilms() {
        const selectedItems = [...this.menu.querySelectorAll('.list__item-active')];
        const selectedFilms = selectedItems.map(item => item.textContent);

        return selectedFilms;
        
    }

    cardWorker() {
        this.fetchData()
            .then(response => response.json())
            .then(data => {
                this.renderCards(data);
                if (this.reload) {
                    this.renderMenu(data);
                    this.reload = false;
                }
            });
    }

    fetchData() {
        return fetch('./dbHeroes.json');
    }
}


const menu = document.querySelector('.list__items');
const cards = document.querySelector('.cards');
new CardsGenerator(menu, cards);

const button = document.querySelector('.reset');
button.addEventListener('click', () => {
    location.reload();
});
