

function createTemplate(section) {
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

    const carousel_template = `
        <div class="main-prds-box-inner">
        <div class="pd_content1">
                
            <div class="prds-sub_title">${section.sub_title}</div>
            <div class="prds-title">${section.title}</div>
            <div class="container">
                <div class="viewport">
                    {{#.}}
                    <div class="box">
                        <ul class="pd_box_lst">
                            {{#.}}
                            <li class="pd_box">
                                <a href="javascript:void(0)" onclick="modalOpen('{{title}}','{{detail_hash}}')">
                                    <div class="thumb_img">
                                        <p><img src="{{image}}" alt="{{alt}}"></p>
                                        <div class="delivery_type_lst">
                                            <div>
                                                <ul>
                                                    <li class="d1"><span>새벽배송</span></li>
                                                    <li class="d2"><span>전국택배</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div class="circle_mask">&nbsp;</div>
                                    </div>
                                    <dl>
                                        <dt class="prd_tlt">{{title}}</dt>
                                        <dd class="prd_description">{{description}}</dd>
                                        <dd class="prd_price">
                                            <span class="n_price">{{n_price}}</span>
                                            <span class="s_price">{{s_price}}</span>
                                        </dd>
                                    </dl>
                                    <div class="badge_area">
                                    </div>
                                </a>
                            </li>
                            {{/.}}
                        </ul>
                    </div>
                    {{/.}}
                </div>
                <div class="pd_slides_navi">
                    <a href="#" class="slides_prev" title="이전">이전</a>
                    <a href="#" class="slides_next" title="다음">다음</a>
                </div><!--
                <div class="button">
                    <button id="left">left</button>
                    <button id="right">right</button>
                </div>-->
            </div>
        </div>
    </div>`;
    var el = document.createElement('div');
    el.className = 'main-prds-box';
    el.innerHTML = Mustache.render(carousel_template, procArr);
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