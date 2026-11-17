(() => {
  "use strict";
  const products = [
    { id: "charlas", price: 20000, name: "Charlas en familia", category: "preguntas", label: "Preguntas para compartir", image: "../img/juego-charlas.svg", description: "Una pregunta puede abrir una gran historia. Una propuesta de cartas para compartir recuerdos, anécdotas y descubrir algo nuevo de quienes se sientan a tu mesa.", prompt: "¿Qué recuerdo te hace sonreír?", tags: "preguntas recuerdos familia cartas" },
    { id: "frases", price: 20000, name: "Frases que nos unen", category: "frases", label: "Completá, contá, compartí", image: "../img/juego-frases.svg", description: "Frases abiertas que invitan a imaginar, recordar y poner en palabras lo que sentimos. Cada respuesta es una oportunidad para escucharnos y compartir.", prompt: "Me siento en casa cuando…", tags: "frases emociones familia cartas" },
    { id: "ronda", price: 35000, name: "A nuestro ritmo", category: "visuales", label: "Apoyos visuales · sin límite de tiempo", image: "../img/juego-nuestro-ritmo.svg", description: "Una propuesta para compartir con jóvenes neurodivergentes: un tablero de colores y formas, tarjetas con imágenes y consignas breves. Cada participante puede elegir una ficha, asociarla con una imagen y contar, señalar o mostrar su elección. Sin competencia ni límite de tiempo, con la opción de pasar el turno y adaptar las consignas a cada persona.", prompt: "Elegí una imagen que te guste. Podés señalarla, mostrarla o contar algo sobre ella.", tags: "visuales neurodivergentes jovenes tablero colores formas imagenes cooperativo accesible" }
    ,{ id: "historias", price: 35000, name: "Historias compartidas", category: "cooperativos", label: "Una historia que construimos entre todos", image: "../img/juego-historias.svg", description: "Un juego cooperativo con 30 tarjetas ilustradas y un dado. Cada participante suma una parte a una historia utilizando una imagen, una palabra, un dibujo o un gesto. Material: tarjetas ilustradas, dado de madera y bolsita de tela.", prompt: "Sale una tarjeta con una bicicleta, otra con una estrella y otra con un perro. Entre todos inventan una aventura.", tags: "historias cooperativo creatividad tarjetas dado" }
  ];
  const formatPrice = product => product.price != null ? "$" + product.price.toLocaleString("es-AR") : "Precio a confirmar";
  const key = "alamesa-cart-v1";
  const catalog = document.getElementById("store-products");
  if (!catalog) return;
  const cartDialog = document.getElementById("store-cart");
  const detailDialog = document.getElementById("store-product-dialog");
  const feedback = document.querySelector(".store-feedback");
  const cartItems = document.getElementById("store-cart-items");
  const footer = document.querySelector(".store-cart-footer");
  const checkout = document.querySelector(".store-checkout");
  const fulfillment = document.getElementById("store-fulfillment");
  let cart = {};
  let feedbackTimer;
  const clean = value => {
    const result = {};
    if (!value || typeof value !== "object" || Array.isArray(value)) return result;
    products.forEach(product => {
      const quantity = value[product.id];
      if (Number.isInteger(quantity) && quantity > 0) result[product.id] = Math.min(quantity, 20);
    });
    return result;
  };
  try { cart = clean(JSON.parse(localStorage.getItem(key))); } catch (_) { /* El carrito también funciona sin almacenamiento. */ }
  function announce(message) {
    feedback.textContent = message;
    feedback.classList.add("is-visible");
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => feedback.classList.remove("is-visible"), 2800);
  }
  function save() {
    try { localStorage.setItem(key, JSON.stringify(cart)); } catch (_) { /* No bloquea la selección. */ }
    renderCart();
  }
  function add(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;
    if ((cart[id] || 0) >= 20) { announce("Podés consultar hasta 20 unidades por juego en el carrito."); return; }
    cart[id] = (cart[id] || 0) + 1;
    save();
    announce(`${product.name} se agregó al carrito.`);
  }
  function renderProducts() {
    const visible = products;
    catalog.innerHTML = visible.map(product => `<article class="store-product"><button class="store-product-image" type="button" data-detail="${product.id}" aria-label="Ver detalles de ${product.name}"><img src="${product.image}" alt="Ilustración de las cartas de ${product.name}" /></button><div class="store-product-copy"><span class="store-product-label">${product.label}</span><h3>${product.name}</h3><p>${product.description}</p><div class="store-product-price">${formatPrice(product)}</div><div class="store-product-actions"><button type="button" class="store-add" data-add="${product.id}">Agregar al carrito <span aria-hidden="true">+</span></button><button class="store-details" type="button" data-detail="${product.id}">Ver juego</button></div></div></article>`).join("");
    document.querySelector(".store-no-results").hidden = visible.length !== 0;
  }
  function updateCheckout() {
    const selected = products.filter(product => cart[product.id]);
    const text = "Hola, Alamesa. Quisiera consultar precio y disponibilidad de estos juegos:\n\n" + selected.map(product => `• ${product.name} × ${cart[product.id]}`).join("\n") + "\n\n" + fulfillment.value + ".\n¿Me confirman el total y los medios de pago disponibles?";
    checkout.href = "https://wa.me/541151465348?text=" + encodeURIComponent(text);
  }
  function renderCart() {
    const selected = products.filter(product => cart[product.id]);
    const count = selected.reduce((sum, product) => sum + cart[product.id], 0);
    document.querySelectorAll(".store-cart-count").forEach(element => { element.textContent = count; });
    document.querySelector(".store-cart-open").setAttribute("aria-label", `Abrir carrito, ${count} ${count === 1 ? "juego" : "juegos"}`);
    footer.hidden = count === 0;
    if (!count) {
      cartItems.innerHTML = '<div class="store-cart-empty"><span aria-hidden="true">＋</span><h3>Tu próxima sobremesa empieza acá</h3><p>Elegí un juego y agregalo al carrito.</p><button type="button" class="store-add" data-continue>Seguir mirando juegos</button></div>';
      return;
    }
    cartItems.innerHTML = selected.map(product => `<article class="store-cart-item"><img src="${product.image}" alt="" /><div><h3>${product.name}</h3><p>${formatPrice(product)}</p><div class="store-quantity"><button type="button" data-change="${product.id}" data-delta="-1" aria-label="Quitar una unidad de ${product.name}">−</button><span aria-label="Cantidad">${cart[product.id]}</span><button type="button" data-change="${product.id}" data-delta="1" ${cart[product.id] >= 20 ? "disabled" : ""} aria-label="Agregar una unidad de ${product.name}">+</button></div></div><button class="store-remove" type="button" data-remove="${product.id}" aria-label="Eliminar ${product.name} del carrito">×</button></article>`).join("");
    document.querySelector(".store-cart-summary").textContent = `${count} ${count === 1 ? "juego seleccionado" : "juegos seleccionados"} · Total a confirmar`;
    updateCheckout();
  }
  function showDetails(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;
    document.getElementById("store-product-detail").innerHTML = `<img src="${product.image}" alt="Ilustración de las cartas de ${product.name}" /><div class="store-detail-copy"><span class="store-product-label">${product.label}</span><h2 id="store-product-title">${product.name}</h2><p>${product.description}</p><p class="store-product-price">${formatPrice(product)}</p><blockquote>“${product.prompt}”</blockquote><p class="store-detail-note">Propuesta ilustrativa. Consultanos el contenido, precio y disponibilidad.</p><button type="button" class="store-add" data-add="${product.id}">Agregar al carrito +</button></div>`;
    detailDialog.showModal();
  }
  [catalog, detailDialog].forEach(element => element.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add]");
    const detailButton = event.target.closest("[data-detail]");
    if (addButton) add(addButton.dataset.add);
    if (detailButton) showDetails(detailButton.dataset.detail);
  }));
  document.querySelector(".store-cart-open").addEventListener("click", () => { renderCart(); cartDialog.showModal(); });
  [cartDialog, detailDialog].forEach(dialog => {
    dialog.querySelector(".store-dialog-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });
  cartItems.addEventListener("click", event => {
    const change = event.target.closest("[data-change]");
    const remove = event.target.closest("[data-remove]");
    if (event.target.closest("[data-continue]")) cartDialog.close();
    if (change) {
      const id = change.dataset.change;
      cart[id] = Math.min(20, Math.max(0, (cart[id] || 0) + Number(change.dataset.delta)));
      if (!cart[id]) delete cart[id];
      save();
      cartItems.querySelector(`[data-change="${id}"][data-delta="${change.dataset.delta}"]`)?.focus();
    }
    if (remove) { delete cart[remove.dataset.remove]; save(); cartDialog.querySelector(".store-dialog-close").focus(); }
  });
  document.querySelector(".store-clear").addEventListener("click", () => { cart = {}; save(); cartItems.querySelector("[data-continue]").focus(); });
  fulfillment.addEventListener("change", updateCheckout);
  window.addEventListener("storage", event => {
    if (event.key === key || event.key === null) {
      try { cart = clean(JSON.parse(localStorage.getItem(key))); } catch (_) { cart = {}; }
      renderCart();
    }
  });
  renderProducts();
  renderCart();
})();
