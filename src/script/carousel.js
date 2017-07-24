function createTemplate(section) {
    let carousel_template = document.querySelector('link[rel="import"][href*="/carousel.template"]').import.querySelector('template').innerHTML;
    var req = new XMLHttpRequest();
    req.open('GET', 'http://52.78.212.27:8080/woowa/' + section.name, false);
    req.send(null);
    var obj = JSON.parse(req.responseText);

    obj = obj.concat(obj);
    let divideConst = 4;
    for (divideConst = 4; divideConst >= 0; divideConst--) {
        if (obj.length % divideConst === 0) break;
    }

    var procArr = [];
    for (let i = 0; i < divideConst; i++) {
        procArr.push(obj.slice(i * divideConst, (i * divideConst) + 4))
    }
    console.log(procArr);
    
    var el = document.createElement('div');
    el.className = 'main-prds-box';
    el.innerHTML = Mustache.render(carousel_template, {title: section.title, sub_title: section.sub_title, data: procArr});
    return el;
}

class Pane {
    constructor(preference) {
        this.container = preference.container;
        this.container.setAttribute('style', `--slider-width: ${preference.sliderWidth}`);
        this.viewport = this.container.querySelector('.viewport');
        this.registerEvents();
    }

    registerEvents() {
        this.container.querySelector('.slides_prev').addEventListener('click', this.slidePrev.bind(this))
        this.container.querySelector('.slides_next').addEventListener('click', this.slideNext.bind(this))
        this.viewport.addEventListener('transitionend', this.transitionEndEvtHandler.bind(this));
    }
    transitionEndEvtHandler(event) {
        if (this.direction === 'prev') {
            this.direction = null;
            this.viewport.insertBefore(this.nextElement, this.prevElement)
        }
        else if (this.direction === 'next') {
            this.direction = null;
            this.viewport.appendChild(this.prevElement);
        }
    }

    get prevElement() {
        return this.viewport.firstElementChild;
    }

    get nextElement() {
        return this.viewport.lastElementChild;
    }

    get transition() {
        return this._transition || false;
    }
    set transition(bool) {
        this.viewport.classList[(bool ? 'remove' : 'add')]('noTransition');
        this._transition = bool;
    }

    get direction() {
        return this._direction || null;
    }
    set direction(value) {
        let className = ((this._direction || value) === 'prev' ? 'slideLeft' : 'slideRight');
        if (value === null) {
            this.transition = false;
            this.viewport.classList.remove(className);
        } else {
            this.transition = true;
            this.viewport.classList.add(className);
        }
        this._direction = value;
    }

    triggerSlide(direction) {
        if (this.transition) return;
        this.direction = direction;
    }

    slidePrev() {
        this.triggerSlide('prev');
    }

    slideNext() {
        this.triggerSlide('next');
    }
}

function registerEvents() {
    document.querySelector('#left').addEventListener('click', pane.slidePrev.bind(pane))
    document.querySelector('#right').addEventListener('click', pane.slideNext.bind(pane))
}

document.addEventListener('DOMContentLoaded', () => {
    var data = [
        {
            name: 'main',
            title: '담기만 하면 완성되는 메인반찬',
            sub_title: '메인반찬'
        },
        {
            name: 'course',
            title: '밥맛을 잊지 못하게 만드는 일품요리',
            sub_title: '일품요리'
        },
        {
            name: 'soup',
            title: '김이 모락모락 국·찌개',
            sub_title: '국·찌개'
        },
        {
            name: 'side',
            title: '언제 먹어도 든든한 밑반찬',
            sub_title: '밑반찬'
        },
    ]
    var el;
    for (let section of data) {
        el = createTemplate(section);
        document.querySelector('main').appendChild(el);
        console.log(el.querySelector('.container'));
        window.pane = new Pane({
            container: el.querySelector('.container'),
            sliderWidth: '980px'
        });
    }
});