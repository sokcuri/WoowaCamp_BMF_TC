
function modalOpen(title, hash_detail) {
    let prod_detail_template = document.querySelector('link[rel="import"][href*="/prod_detail.template"]').import.querySelector('template').innerHTML;
    var req = new XMLHttpRequest();
    req.open('GET', 'http://52.78.212.27:8080/woowa/detail/' + hash_detail, false);
    req.send(null);
    var obj = JSON.parse(req.responseText);
    history.replaceState(null, title, `./#/detail/${hash_detail}`);
    
    var prod_detail = document.querySelector('.prod_detail-content');
    var n_price, s_price;
    if (obj.data.prices[1] === undefined) {
        n_price = '';
        s_price = obj.data.prices[0];
    }
    else {
        n_price = obj.data.prices[0];
        s_price = obj.data.prices[1];
    }
    obj.n_price = n_price;
    obj.s_price = s_price;
    obj.title = title;

    obj.thumb_images = [];
    for (let i = 0; i < 5; i++) {
        obj.thumb_images.push(obj.data.thumb_images[i]);
    }
    
    prod_detail.innerHTML = Mustache.render(prod_detail_template, obj);
    document.querySelector('bmf-modal').setAttribute('opened', '');
}