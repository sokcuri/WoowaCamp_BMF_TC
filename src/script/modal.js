
function modalOpen(title, hash_detail) {
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

    var prod_detail_template = `
    <div class="detail_container">
        <div class="side_left">
            <div class="top_images" style="background:url('{{data.top_image}}');background-size:contain"></div>
            <ul class="thumb_images">
            <li style="background:url('${obj.data.thumb_images[0]}');background-size:contain;"></li>
            <li style="background:url('${obj.data.thumb_images[1]}');background-size:contain;"></li>
            <li style="background:url('${obj.data.thumb_images[2]}');background-size:contain;"></li>
            <li style="background:url('${obj.data.thumb_images[3]}');background-size:contain;"></li>
            <li style="background:url('${obj.data.thumb_images[4]}');background-size:contain;"></li>
            </ul>
        </div>
        <div class="side_right">
            <div class="prod_title">${title}</div>
            <div class="prod_description">{{data.product_description}}</div>
            <dl class="prod_info">
            <dt>적립금</dt>
            <dd>{{data.point}}</dd>
            <dt>배송정보</dt>
            <dd>{{data.delivery_info}}</dd>
            <dt>배송비</dt>
            <dd>{{data.delivery_fee}}</dd>
            <dd class="prod_price">
            <span class="n_price">${n_price}</span>
            <span class="s_price">${s_price}</span>
            </dd>
            </dl>
            </div>
            <div class="detail_section">
                <ul>
                {{#data.detail_section}}
                    <img src="{{.}}">
                {{/data.detail_section}}
                </ul>
            </div>
        </div>
    </div>`;
    
    prod_detail.innerHTML = Mustache.render(prod_detail_template, obj);
    document.querySelector('bmf-modal').setAttribute('opened', '');
}