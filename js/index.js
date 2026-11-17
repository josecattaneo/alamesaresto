document.addEventListener("DOMContentLoaded", iniciarPagina);

function iniciarPagina() {
  configurarMenuMovil();
  configurarFiltrosMenu();
  configurarFechaMinima();
  configurarFormularioReserva();
  configurarVistaReserva();
  configurarAnimacionContacto();
  configurarLeerMasNosotros();
  configurarInclusionLaboral();
  configurarGaleriaEquipo();
  configurarFamilia();
}

function configurarFamilia() {
  const enlace = document.querySelector(".familia-link");
  const texto = document.getElementById("familia-details");
  if (!enlace || !texto) return;
  function mostrarFamilia() {
    texto.hidden = false;
    texto.closest(".nosotros-name").classList.add("is-expanded");
    enlace.setAttribute("aria-expanded", "true");
  }
  enlace.addEventListener("click", mostrarFamilia);
  if (window.location.hash === "#sentirse-en-casa") mostrarFamilia();
  window.addEventListener("hashchange", function () {
    if (window.location.hash === "#sentirse-en-casa") mostrarFamilia();
  });
}

function configurarGaleriaEquipo() {
  const galeria = document.querySelector(".team-gallery");
  if (!galeria) return;
  const fotos = Array.from(galeria.querySelectorAll(".team-slide"));
  const titulo = galeria.querySelector("#nosotros-team-title");
  const informacion = document.getElementById("team-info");
  const cerrar = document.querySelector(".team-info-close");
  let actual = 0;
  let temporizador;
  function mostrar(indice) {
    actual = (indice + fotos.length) % fotos.length;
    fotos.forEach(function (foto, i) {
      foto.classList.toggle("is-current", i === actual);
      foto.setAttribute("aria-hidden", String(i !== actual));
    });
    if (titulo) {
      titulo.textContent = actual === 0 ? "Nuestro Equipo" : "+";
      titulo.classList.toggle("team-info-compact", actual !== 0);
      titulo.setAttribute("aria-label", actual === 0 ? "Nuestro Equipo" : "Más sobre nuestro equipo");
    }
  }
  function detener() { clearInterval(temporizador); }
  function iniciar() {
    detener();
    if (!document.hidden && !galeria.matches(":focus-within")) {
      temporizador = setInterval(function () { mostrar(actual + 1); }, 4500);
    }
  }
  document.addEventListener("visibilitychange", iniciar);
  galeria.addEventListener("focusin", detener);
  galeria.addEventListener("focusout", function () { requestAnimationFrame(iniciar); });
  if (titulo && informacion) {
    function abrirEquipoDesdeEnlace() {
      if (window.location.hash !== "#nuestro-equipo") return;
      informacion.hidden = false;
      titulo.setAttribute("aria-expanded", "true");
    }
    abrirEquipoDesdeEnlace();
    window.addEventListener("hashchange", abrirEquipoDesdeEnlace);
    titulo.addEventListener("click", function () {
      const abierto = titulo.getAttribute("aria-expanded") !== "true";
      informacion.hidden = !abierto;
      titulo.setAttribute("aria-expanded", String(abierto));
    });
    if (cerrar) cerrar.addEventListener("click", function () {
      informacion.hidden = true;
      titulo.setAttribute("aria-expanded", "false");
      mostrar(0);
      titulo.focus({ preventScroll: true });
    });
  }
  iniciar();
}

function configurarInclusionLaboral() {
  const boton = document.querySelector(".inclusion-toggle");
  const detalles = document.getElementById("inclusion-details");
  if (!boton || !detalles) return;
  function abrirInclusion() {
    detalles.hidden = false;
    boton.setAttribute("aria-expanded", "true");
    boton.textContent = "Ver menos";
  }
  document.querySelectorAll(".inclusion-value-link").forEach(function (enlace) {
    enlace.addEventListener("click", abrirInclusion);
  });
  if (window.location.hash === "#inclusion-laboral") abrirInclusion();
  window.addEventListener("hashchange", function () {
    if (window.location.hash === "#inclusion-laboral") abrirInclusion();
  });
  boton.addEventListener("click", function () {
    const expandido = boton.getAttribute("aria-expanded") !== "true";
    detalles.hidden = !expandido;
    boton.setAttribute("aria-expanded", String(expandido));
    boton.textContent = expandido ? "Ver menos" : "Conocé más";
  });
}

function configurarLeerMasNosotros() {
  const boton = document.querySelector(".nosotros-read-more");
  const texto = document.getElementById("nosotros-who-more");
  const puntos = document.getElementById("nosotros-who-ellipsis");
  if (!boton || !texto || !puntos) return;
  boton.addEventListener("click", function () {
    const expandido = boton.getAttribute("aria-expanded") !== "true";
    texto.hidden = !expandido;
    puntos.hidden = expandido;
    boton.setAttribute("aria-expanded", String(expandido));
    boton.textContent = expandido ? "Leé menos" : "Leé más";
  });
}

function configurarAnimacionContacto() {
  const titulo = document.querySelector(".contact-welcome-title");
  if (!titulo) return;
  if (!("IntersectionObserver" in window)) {
    titulo.classList.add("is-visible");
    return;
  }
  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      titulo.classList.toggle("is-visible", entrada.isIntersecting);
    });
  }, { threshold: 0.35 });
  observador.observe(titulo);
}

function configurarVistaReserva() {
  const recuadro = document.querySelector(".reserve-card");
  if (!recuadro) return;

  function centrarReserva() {
    if (window.location.hash !== "#reserva") return;
    requestAnimationFrame(function () {
      recuadro.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" });
    });
  }

  window.addEventListener("hashchange", centrarReserva);
  window.addEventListener("load", function () {
    if (document.fonts) {
      document.fonts.ready.then(centrarReserva);
    } else {
      centrarReserva();
    }
  });
}

// Configura el menú de navegación para celulares
function configurarMenuMovil() {
  const botonMenu = document.getElementById("boton-menu");
  const navegacion = document.getElementById("navegacion-principal");

  if (!botonMenu || !navegacion) return;

  function cerrarMenu() {
    navegacion.classList.remove("abierta");
    botonMenu.setAttribute("aria-expanded", "false");
    botonMenu.setAttribute("aria-label", "Abrir menú de navegación");
  }

  document.addEventListener("pointerdown", function (evento) {
    if (!navegacion.contains(evento.target) && !botonMenu.contains(evento.target)) {
      cerrarMenu();
    }
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && navegacion.classList.contains("abierta")) {
      cerrarMenu();
      botonMenu.focus();
    }
  });

  botonMenu.addEventListener("click", function () {
    const estaAbierto = navegacion.classList.toggle("abierta");

    botonMenu.setAttribute("aria-expanded", String(estaAbierto));
    botonMenu.setAttribute(
      "aria-label",
      estaAbierto ? "Cerrar menú de navegación" : "Abrir menú de navegación"
    );
  });

  navegacion.querySelectorAll("a").forEach(function (enlace) {
    enlace.addEventListener("click", cerrarMenu);
  });
}

// Configura los filtros de las categorías del menú
function configurarFiltrosMenu() {
  const botonesFiltro = document.querySelectorAll(".tab");
  const platos = document.querySelectorAll(".menu-item");

  botonesFiltro.forEach(function (boton) {
    boton.addEventListener("click", function () {
      const categoriaElegida = boton.dataset.categoria;

      botonesFiltro.forEach(function (otroBoton) {
        otroBoton.classList.remove("active");
      });

      boton.classList.add("active");

      platos.forEach(function (plato) {
        const coincide =
          categoriaElegida === "todos" ||
          plato.dataset.categoria === categoriaElegida;

        plato.hidden = !coincide;
      });
    });
  });
}

// Impide seleccionar una fecha anterior al día actual
function configurarFechaMinima() {
  const campoFecha = document.getElementById("fecha-reserva");

  if (!campoFecha) return;

  const fechaActual = new Date();
  const anio = fechaActual.getFullYear();
  const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
  const dia = String(fechaActual.getDate()).padStart(2, "0");

  campoFecha.min = `${anio}-${mes}-${dia}`;
  const textoFecha = campoFecha.parentElement.querySelector(".date-placeholder");
  if (textoFecha) {
    campoFecha.addEventListener("change", function () {
      textoFecha.textContent = campoFecha.value
        ? campoFecha.value.split("-").reverse().slice(0, 2).join("/")
        : "Fecha";
    });
  }
}

// Configura el formulario de reservas para enviar la solicitud por WhatsApp
function configurarFormularioReserva() {
  const formulario = document.getElementById("formulario-reserva");
  const mensaje = document.getElementById("mensaje-reserva");

  if (!formulario || !mensaje) return;

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (!formulario.reportValidity()) return;

    const datos = new FormData(formulario);

    const fecha = datos.get("fecha");
    const hora = datos.get("hora");
    const personas = datos.get("personas");
    const nombre = datos.get("nombre").trim();
    const telefono = datos.get("telefono").trim();
    const comentarios = (datos.get("comentarios") || "").trim();

    const fechaLegible = new Date(fecha + "T12:00:00").toLocaleDateString(
      "es-AR",
      {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
      }
    );

    let texto = "Hola, Alamesa. Quisiera solicitar una reserva:%0A";
    texto += "%0A*Nombre:* " + encodeURIComponent(nombre);
    texto += "%0A*Fecha:* " + encodeURIComponent(fechaLegible);
    texto += "%0A*Hora:* " + encodeURIComponent(hora);
    texto += "%0A*Personas:* " + encodeURIComponent(personas);
    texto += "%0A*Teléfono:* " + encodeURIComponent(telefono);

    if (comentarios) {
      texto += "%0A*Comentarios:* " + encodeURIComponent(comentarios);
    }

    mensaje.textContent = "Estamos preparando tu solicitud para WhatsApp. Revisá los datos antes de enviarla.";

    const enlaceWhatsApp =
      "https://wa.me/541151465348?text=" + texto;

    window.open(enlaceWhatsApp, "_blank", "noopener,noreferrer");
  });
}

// Video de Inicio automático, sin controles y en bucle continuo.
document.addEventListener("DOMContentLoaded", function () {
  const video = document.querySelector(".hero-tour");
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.autoplay = true;
  video.loop = true;
  video.controls = false;
  function playVideo() {
    if (!document.hidden) video.play().catch(function () {});
  }
  video.addEventListener("loadeddata", playVideo);
  video.addEventListener("canplay", playVideo);
  window.addEventListener("pageshow", playVideo);
  document.addEventListener("visibilitychange", playVideo);
  playVideo();
});
