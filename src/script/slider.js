const RegularExpressTemplate = {
    filterSlideNumber: /s([0-9]+)/
}

function getCurrentSlide() {
    return document.querySelector('.main_slides_lst li:not([style*="display: none"])');
}

function extractSlideNumber(slideElement) {
    var child = slideElement;
    var parent = document.querySelector('.main_slides_lst');
    return Array.prototype.indexOf.call(parent.children, child) + 1;
}

function getPagination(num) {
    return document.querySelector(`.slides_pagination li:nth-child(${num}) a`);
}

function getFirstSlide() {
    return document.querySelector('.main_slides_lst li:nth-child(1)');
}

function getLastSlide() {
    return document.querySelector('.main_slides_lst li:nth-last-child(1)');
}

function getPrevSlide() {
    let currentSlide = getCurrentSlide();
    let previousSlide = currentSlide.previousElementSibling || getLastSlide();
    return previousSlide;
}

function getNextSlide() {
    let currentSlide = getCurrentSlide();
    let nextSlide = currentSlide.nextElementSibling || getFirstSlide();
    return nextSlide;
}

function getSlide(num) {
    return document.querySelector(`.main_slides_lst li:nth-child(${num})`);
}

function slidesPrevBtnHandler() {
    let currentSlide = getCurrentSlide();
    let previousSlide = getPrevSlide();
    transitionSlide(currentSlide, previousSlide);
}

function slidesNextBtnHandler() {
    let currentSlide = getCurrentSlide();
    let nextSlide = getNextSlide();
    transitionSlide(currentSlide, nextSlide);
}

function slidesPaginationHandler(changeSlide) {
    let currentSlide = getCurrentSlide();
    transitionSlide(currentSlide, changeSlide);
}

function registerEvents() {
    document.querySelector('.slides_prev').addEventListener('click', slidesPrevBtnHandler);
    document.querySelector('.slides_next').addEventListener('click', slidesNextBtnHandler);

    document.querySelectorAll('.slides_pagination li a').forEach((el, i) => {
        let changeSlide = getSlide(i + 1);
        el.addEventListener('click', slidesPaginationHandler.bind(this, changeSlide));
    })
}

function transitionSlide(destSlide, sourceSlide) {
    // 현재 슬라이드와 바뀔 슬라이드는 같을 수 없음
    if (destSlide === sourceSlide)
        return;

    let TSI = transitionSlideInfo;

    // 바뀌는 도중에는 슬라이드를 변경할 수 없게끔 함. 시각적 효과를 위해
    if (TSI.progress !== null &&
        TSI.progress > 15 && TSI.progress <= 100)
        return;
        
    if (!TSI.destSlide) {
        destSlide = destSlide;
        destSlide.style.zIndex = '0';
        destSlide.style.opacity = 1;

        let slideNumber = extractSlideNumber(destSlide);
        getPagination(slideNumber).classList.remove('now');
    }

    if (TSI.sourceSlide) {
        TSI.sourceSlide.style.display = 'none';
        TSI.sourceSlide.style.zIndex = '0';
        TSI.sourceSlide.style.opacity = '';

        let slideNumber = extractSlideNumber(TSI.sourceSlide);
        getPagination(slideNumber).classList.remove('now');
    }

    sourceSlide.style.zIndex = '50';
    sourceSlide.style.opacity = 0;
    sourceSlide.style.display = '';
    let slideNumber = extractSlideNumber(sourceSlide);
    getPagination(slideNumber).classList.add('now');
    TSI.sourceSlide = sourceSlide;

    if (!TSI.destSlide) {
        TSI.destSlide = destSlide;
        TSI.progress = 0;
    }
}

let transitionSlideInfo = {
    destSlide: null,
    sourceSlide: null,
    progress: null
}

// dest z-index = 0, src z-index = 50으로 만들고
// dest opacity 1 -> 0, src opacity 0 -> 1로 시작
function slideAnimation() {
    let TSI = transitionSlideInfo;
    if (TSI.progress !== null) {
        console.log('progress')

        let opacityAmount = TSI.progress / 100;
        TSI.destSlide.style.opacity = 1 - opacityAmount;
        TSI.sourceSlide.style.opacity = opacityAmount;
        TSI.oldSourceSlide = TSI.sourceSlide;

        TSI.progress+=3;

        if (opacityAmount >= 1) {
            TSI.destSlide.style.opacity = '';
            TSI.destSlide.style.display = 'none';
            TSI.sourceSlide.style.opacity = '';

            TSI.destSlide = null;
            TSI.sourceSlide = null;
            TSI.progress = null;
        }
    }
    //console.log(`Test - ${new Date()}`)
    requestAnimationFrame(slideAnimation);
}

document.addEventListener('DOMContentLoaded', () => {
    registerEvents();
    slideAnimation();
    let currentSlide = getCurrentSlide();
    let currentSlideNumber = extractSlideNumber(currentSlide);
    getPagination(currentSlideNumber).classList.add('now');
});
