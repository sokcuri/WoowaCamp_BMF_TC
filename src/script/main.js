document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('bmf-content-inner').focus();
    document.querySelector('#main-banners').addEventListener("beforeunload", function (e) {
        console.log(last_clicked);
    });
    loadBestPrd();
    
    registerSlideEvents();
    slideAnimation();
    let currentSlide = getCurrentSlide();
    let currentSlideNumber = extractSlideNumber(currentSlide);
    getPagination(currentSlideNumber).classList.add('now');
}, true);

var last_clicked;
window.addEventListener('click', function (e) {
    last_clicked = e.target;
    console.log(last_clicked);
    return true;
}, true);

function loadBestPrd() {
    var req = new XMLHttpRequest();
    req.open('GET', 'http://52.78.212.27:8080/woowa/best', false);
    req.send(null);
    var obj = JSON.parse(req.responseText);

    let prds_inner = document.querySelector('.main-best-prds-inner');

    var tabui_template = `
        {{resetIndex}}
        <div class="prds-sub_title">베스트셀러</div>
        <div class="prds-title">안먹어보면 너무나 아쉬운 베스트 반찬</div>
        <div class="tab_area">
            <ul>
                {{#data}}{{setUpIndex}}
                <li>
                    <a href="#" onclick="" data-index={{getIndex}}>{{name}}</a>
                </li>
                {{/data}}
            </ul>
        </div>`;
    prds_inner.innerHTML = Mustache.render(tabui_template, {
        data: obj
        ,setUpIndex: function() {
            ++window['INDEX']||(window['INDEX']=0);
            return;
        }
        , getIndex: function() {
            return window['INDEX'];
        }
        , resetIndex: function() {
            window['INDEX']=null;
            return;
        }
    });

    var tabui_content_template = `
        <div class="best-prds-container">
            {{#data}}<ul>{{#items}}
                <li>
                    <a href="javascript:void(0)" onclick="modalOpen('{{title}}','{{detail_hash}}')">
                        <div class="thumb-img">
                            <div class="delivery_type">
                            {{#delivery_type}}
                                <span>{{.}}</span>
                            {{/delivery_type}}
                            </div>
                            <div class="badge_area">
                            {{#badge}}
                            <span data-badge='{{.}}'>{{.}}</span>
                            {{/badge}}
                            </div>
                            <div>
                                <img src="{{image}}" alt="{{alt}}" style="max-width: 100%;">
                            </div>
                        </div>
                        <div class="prds-content">
                            <dl>
                                <dt class="prd_tlt">{{title}}</dt>
                                <dd class="prd_description">{{description}}</dd>
                                <dd class="prd_price">
                                    <span class="n_price">{{n_price}}</span>
                                    <span class="s_price">{{s_price}}</span>
                                </dd>
                            </dl>
                            <span>{{title}}</span>
                        </div>
                    </a>
                </li>{{/items}}
            </ul>{{/data}}
        </div>`;

    prds_inner.querySelector('.tab_area li:first-child a').className = "now";
    prds_inner.innerHTML += Mustache.render(tabui_content_template, { data: obj });
    prds_inner.querySelector('.best-prds-container ul:first-child').classList.add('active');
    document.querySelector('.tab_area').addEventListener('click', (e) => {
        document.querySelector('.tab_area .now').classList.remove('now');
        document.querySelector(`.tab_area li:nth-child(${e.target.dataset.index}) a`).classList.add('now');
        if (document.querySelector('.best-prds-container .active'))
            document.querySelector('.best-prds-container .active').classList.remove('active');
        document.querySelector(`.best-prds-container ul:nth-child(${e.target.dataset.index})`).classList.add('active');
    });
}
