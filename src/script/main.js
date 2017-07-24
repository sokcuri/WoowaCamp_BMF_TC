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

    var tabui_template = document.querySelector('link[rel="import"][href*="/tabui_tab.template"]').import.querySelector('template').innerHTML;
    var tabui_content_template = document.querySelector('link[rel="import"][href*="/tabui_content.template"]').import.querySelector('template').innerHTML;
    
    var req = new XMLHttpRequest();
    req.open('GET', 'http://52.78.212.27:8080/woowa/best', false);
    req.send(null);
    var obj = JSON.parse(req.responseText);

    let prds_inner = document.querySelector('.main-best-prds-inner');

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
