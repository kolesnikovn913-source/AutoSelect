'use strict';
// Цены и модели сохранены из лабораторной работы. Рейтинги демонстрационные.
const cars = [
 {id:'camry',name:'Toyota Camry 30',brand:'Toyota',type:'Седан',price:24000,rating:4.7,tag:'Классика',image:'https://commons.wikimedia.org/wiki/Special:FilePath/2004%20Toyota%20Camry%203.0V%20(1MZ).jpg?width=960'},
 {id:'rav4',name:'Toyota RAV4',brand:'Toyota',type:'Кроссовер',price:36500,rating:4.9,tag:'Популярный',image:'https://commons.wikimedia.org/wiki/Special:FilePath/2019%20Toyota%20RAV4%20LE%202.5L%20front%204.14.19.jpg?width=960'},
 {id:'lexus',name:'Lexus RX 300',brand:'Lexus',type:'Кроссовер',price:38700,rating:4.8,tag:'Премиум',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Lexus%20RX300.jpg?width=960'},
 {id:'honda',name:'Honda Civic',brand:'Honda',type:'Седан',price:15000,rating:4.6,tag:'Городской',image:'https://commons.wikimedia.org/wiki/Special:FilePath/2018%20Honda%20Civic%20(FC)%20sedan%2C%2012.1.18.jpg?width=960'},
 {id:'suzuki',name:'Suzuki Vitara',brand:'Suzuki',type:'Кроссовер',price:15000,rating:4.5,tag:'Практичный',image:'https://commons.wikimedia.org/wiki/Special:FilePath/2015%20Suzuki%20Vitara%20(New%20Zealand).jpg?width=960'}
];
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0}).format(n)+' $';
const key='autoselect-lab41-cart';
let selected=new Set();
try {const saved=JSON.parse(localStorage.getItem(key)||'[]'); if(Array.isArray(saved))selected=new Set(saved.filter(id=>cars.some(c=>c.id===id)));}catch(e){}
function save(){try{localStorage.setItem(key,JSON.stringify([...selected]));}catch(e){}}
function card(c){const checked=selected.has(c.id);return `<article class="car-card ${checked?'chosen':''}"><div class="photo-area"><div class="photo-fallback" aria-hidden="true"><span>🚘</span><small>${c.brand.toUpperCase()}</small></div><img loading="lazy" src="${c.image}" alt="Фотография ${c.name}" onload="this.classList.add('loaded')" onerror="this.remove()"><span class="card-tag">${c.tag}</span></div><div class="card-body"><div class="card-topline"><span>${c.brand.toUpperCase()} · ${c.type}</span><span class="rating" title="Демонстрационный рейтинг">★ ${c.rating}</span></div><h3>${c.name}</h3><div class="card-bottom"><div><small>СТОИМОСТЬ</small><strong>${money(c.price)}</strong></div><label class="select-btn ${checked?'active':''}"><input type="checkbox" class="car-check" data-id="${c.id}" ${checked?'checked':''}><span>${checked?'✓ Выбрано':'+ Выбрать'}</span></label></div></div></article>`}
function renderCatalog(){const q=$('search').value.trim().toLocaleLowerCase('ru');const mode=$('sort').value;let list=cars.filter(c=>(c.name+' '+c.brand+' '+c.type).toLocaleLowerCase('ru').includes(q));if(mode==='priceAsc')list.sort((a,b)=>a.price-b.price);if(mode==='priceDesc')list.sort((a,b)=>b.price-a.price);if(mode==='rating')list.sort((a,b)=>b.rating-a.rating);$('carGrid').innerHTML=list.length?list.map(card).join(''):'<div class="no-results">Ничего не найдено. Попробуйте другой запрос.</div>';$('results').textContent=`${list.length} ${list.length===1?'модель':list.length>=2&&list.length<=4?'модели':'моделей'}`;}
function renderBasket(){const list=cars.filter(c=>selected.has(c.id));const total=list.reduce((sum,c)=>sum+c.price,0);$('basketCount').textContent=list.length;$('cartBadge').textContent=list.length;$('itemCount').textContent=list.length;$('total').textContent=money(total);$('receiptBtn').disabled=!list.length;$('basketItems').innerHTML=list.length?list.map(c=>`<div class="basket-item"><div class="basket-item-icon">🚘</div><div class="basket-item-name"><b>${c.name}</b><small>${c.type}</small></div><div class="basket-item-price"><strong>${money(c.price)}</strong><button data-remove="${c.id}" aria-label="Удалить ${c.name}" title="Убрать из корзины">✕</button></div></div>`).join(''):'<div class="empty"><span>◇</span><b>Пока пусто</b><p>Добавьте автомобили из каталога, чтобы увидеть их здесь.</p></div>';}
function update(){save();renderCatalog();renderBasket();}
function resetSelection(){selected.clear();update();}
function calculate(){renderBasket();return cars.filter(c=>selected.has(c.id)).reduce((s,c)=>s+c.price,0);}
$('carGrid').addEventListener('change',e=>{if(!e.target.matches('.car-check'))return;const id=e.target.dataset.id;if(e.target.checked)selected.add(id);else selected.delete(id);update();});
$('basketItems').addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(b){selected.delete(b.dataset.remove);update();}});
$('search').addEventListener('input',renderCatalog);$('sort').addEventListener('change',renderCatalog);
$('resetBtn').addEventListener('click',resetSelection);$('goCart').addEventListener('click',()=>$('basket').scrollIntoView({behavior:'smooth',block:'start'}));
$('receiptBtn').addEventListener('click',()=>{const list=cars.filter(c=>selected.has(c.id));$('receiptDate').textContent=new Intl.DateTimeFormat('ru-RU',{dateStyle:'long',timeStyle:'short'}).format(new Date());$('receiptList').innerHTML=list.map((c,i)=>`<div class="receipt-item"><span>${i+1}. ${c.name}</span><strong>${money(c.price)}</strong></div>`).join('');$('receiptTotal').textContent=money(list.reduce((s,c)=>s+c.price,0));$('receiptDialog').showModal();});
$('closeReceipt').addEventListener('click',()=>$('receiptDialog').close());$('receiptDialog').addEventListener('click',e=>{if(e.target===$('receiptDialog'))$('receiptDialog').close();});$('printReceipt').addEventListener('click',()=>window.print());
renderCatalog();renderBasket();
