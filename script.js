const PRODUCTS = {
  "shirt1":{
    id:"shirt1",
    title:"Until He Comes",
    desc:"Comfortable cotton tee with a bold cross print.",
    price:"$20",
    image:"images/shirt1.jpeg",
    category:"Shirts",
    colors:[
      {name:"Black",hex:"#111827",image:"images/shirt1black.jpeg"},
      {name:"White",hex:"#8d2a2aff",image:"images/shirt1wine.jpeg"},
      {name:"White",hex:"#0b006cff",image:"images/shirt1blue.jpeg"},
      {name:"White",hex:"#024b17ff",image:"images/shirt1.jpeg"}
    ]
   },
  "shirt2":{
    id:"shirt2",
    title:"Holiness",
    desc:"Soft-fit tee featuring a scripture-inspired design.",
    price:"$20",
    image:"images/Shirt2white.jpeg",
    category:"Shirts",
    colors:[
      {name:"white",hex:"#ffffffff",image:"images/Shirt2white.jpeg"},
      // {name:"White",hex:"#ffffff",image:"images/shirt2_white.svg"}
    ]
 },
  "hoodie1":{
    id:"hoodie1",
    title:"Holiness",
    desc:"Warm hoodie with a large cross on the chest.",
    price:"$25",
    image:"images/hoodiewhite.jpeg",
    category:"Hoodies",
    colors:[
      {name:"Black",hex:"#ffffffff",image:"images/hoodiewhite.jpeg"},
     // {name:"Heather Gray",hex:"#9CA3AF",image:"images/hoodie1_gray.svg"}
    ]
  },
//   "hoodie2":{
//     id:"hoodie2",
//     title:"Comfort Hoodie — Verse",
//     desc:"Cozy hoodie with an encouraging verse print.",
//     price:"$40",
//     image:"images/hoodie2.svg",
//     category:"Hoodies",
//     colors:[
//       {name:"Black",hex:"#111827",image:"images/hoodie2_black.svg"},
//       {name:"Heather Gray",hex:"#9CA3AF",image:"images/hoodie1_gray.svg"},
//       {name:"Navy",hex:"#0B3D91",image:"images/hoodie2_navy.svg"}
//     ]
//   }
};

function createCard(p){
  const a = document.createElement('article');
  a.className = 'card';
  a.dataset.category = p.category;
  a.innerHTML = `
    <img src="${p.image}" alt="${p.title}">
    <h3>${p.title}</h3>
    <p class="price">${p.price}</p>
    <a class="btn" href="product.html?id=${p.id}">View</a>
  `;
  return a;
}

function renderProducts(filter = 'All'){
  const grid = document.getElementById('product-grid');
  if(!grid) return;
  grid.innerHTML = '';
  Object.values(PRODUCTS)
    .filter(p => filter === 'All' || p.category === filter)
    .forEach(p => grid.appendChild(createCard(p)));
}

function renderCategories(){
  const bar = document.querySelector('.category-bar');
  if(!bar) return;
  const cats = ['All', ...new Set(Object.values(PRODUCTS).map(p => p.category))];
  // keep existing All button, append others
  bar.innerHTML = '';
  cats.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.className = 'category-btn' + (i===0? ' active':'');
    btn.dataset.cat = cat;
    btn.type = 'button';
    btn.setAttribute('aria-pressed', i===0 ? 'true' : 'false');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.category-btn').forEach(b => b.setAttribute('aria-pressed','false'));
      btn.classList.add('active');
      btn.setAttribute('aria-pressed','true');
      renderProducts(cat);
    });
    bar.appendChild(btn);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // render collection on index page
  if(document.getElementById('product-grid')){
    renderCategories();
    renderProducts('All');
  }

  // Populate product page if an id is provided
  if(document.location.pathname.endsWith('product.html')){
    const params = new URLSearchParams(location.search);
    const id = params.get('id') || 'shirt1';
    const p = PRODUCTS[id];
    if(p){
      document.getElementById('product-title').textContent = p.title;
      document.getElementById('product-desc').textContent = p.desc;
      document.getElementById('product-price').textContent = p.price;
      document.getElementById('product-image').src = p.image;
      renderColorSwatches(p);
      const callLink = document.getElementById('call-link');
      if(callLink) callLink.href = 'tel:+1234567890';
    }
  }
});

function renderColorSwatches(product){
  const container = document.getElementById('color-swatches');
  const img = document.getElementById('product-image');
  if(!container || !product || !product.colors) return;
  container.innerHTML = '';
  product.colors.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'swatch';
    btn.type = 'button';
    btn.title = c.name;
    btn.setAttribute('aria-label', c.name);
    btn.setAttribute('role','listitem');
    if(i===0) btn.setAttribute('aria-pressed','true'); else btn.setAttribute('aria-pressed','false');
    btn.style.backgroundColor = c.hex;
    btn.addEventListener('click', () => {
      container.querySelectorAll('.swatch').forEach(s => s.setAttribute('aria-pressed','false'));
      btn.setAttribute('aria-pressed','true');
      // update image to variant image if provided
      if(c.image && img) {
        img.src = c.image;
        img.alt = `${product.title} — ${c.name}`;
      }
      // visual feedback: add colored ring to image (subtle)
      if(img) img.style.boxShadow = `0 0 0 8px ${c.hex}33`;
    });
    container.appendChild(btn);
    // set default ring for first
    if(i===0 && img) {
      img.style.boxShadow = `0 0 0 8px ${c.hex}33`;
      if(c.image) { img.src = c.image; img.alt = `${product.title} — ${c.name}`; }
    }
  });
}
