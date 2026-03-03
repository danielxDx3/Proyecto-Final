/* =========================
   Utilidades
========================= */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function setError(errorId, message) {
  const el = document.getElementById(errorId);
  if (!el) return;
  el.textContent = message;
  el.style.display = message ? "block" : "none";
}

function isValidEmail(email) {
  // Regex simple y aceptable para validación básica
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(email);
}

/* =========================
   Año automático en footer
========================= */
(function setFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* =========================
   Filtro de productos por categoría
   productos.html?cat=ficcion
========================= */
(function filterProductsByCategory() {
  // Solo aplica si estamos en productos.html (o si existe el grid)
  const productsGrid = document.getElementById("productsGrid");
  if (!productsGrid) return;

  const params = new URLSearchParams(window.location.search);
  const cat = (params.get("cat") || "").toLowerCase();

  const filterText = document.getElementById("filterText");
  const products = document.querySelectorAll(".product");

  if (!cat) {
    if (filterText) filterText.textContent = "Mostrando todos los productos.";
    products.forEach((p) => (p.style.display = "block"));
    return;
  }

  // Mostrar texto del filtro
  const label =
    cat === "ficcion" ? "Ficción" :
    cat === "educacion" ? "Educación" :
    cat === "infantil" ? "Infantil" :
    cat;

  if (filterText) filterText.textContent = `Filtrado por categoría: ${label}.`;

  // Filtrar según data-cat
  let anyVisible = false;
  products.forEach((p) => {
    const productCat = (p.getAttribute("data-cat") || "").toLowerCase();
    const show = productCat === cat;
    p.style.display = show ? "block" : "none";
    if (show) anyVisible = true;
  });

  // Mensaje si no hay resultados
  if (!anyVisible && filterText) {
    filterText.textContent = `No hay productos para la categoría: ${label}.`;
  }
})();

/* =========================
   Validación del formulario (contacto.html)
   Reglas:
   - Campos no vacíos
   - Email formato válido
   - Nombre mínimo 3 caracteres
   - Descripción mínimo 10 caracteres
   - Mensajes de error dinámicos
   - Evitar envío si existen errores
========================= */
(function contactFormValidation() {
  const form = document.getElementById("contactForm");
  if (!form) return; // Solo aplica si existe el formulario

  const successMsg = document.getElementById("successMsg");

  function clearSuccess() {
    if (successMsg) successMsg.textContent = "";
  }

  function validateNombre() {
    const nombre = getValue("nombre");
    if (!nombre) {
      setError("errorNombre", "El nombre es obligatorio.");
      return false;
    }
    if (nombre.length < 3) {
      setError("errorNombre", "El nombre debe tener mínimo 3 caracteres.");
      return false;
    }
    setError("errorNombre", "");
    return true;
  }

  function validateCiudad() {
    const ciudad = getValue("ciudad");
    if (!ciudad) {
      setError("errorCiudad", "La ciudad es obligatoria.");
      return false;
    }
    setError("errorCiudad", "");
    return true;
  }

  function validateEmail() {
    const email = getValue("email");
    if (!email) {
      setError("errorEmail", "El email es obligatorio.");
      return false;
    }
    if (!isValidEmail(email)) {
      setError("errorEmail", "Ingresa un email con formato válido (ej: nombre@correo.com).");
      return false;
    }
    setError("errorEmail", "");
    return true;
  }

  function validateAsunto() {
    const asunto = getValue("asunto");
    if (!asunto) {
      setError("errorAsunto", "El asunto es obligatorio.");
      return false;
    }
    setError("errorAsunto", "");
    return true;
  }

  function validateDescripcion() {
    const descripcion = getValue("descripcion");
    if (!descripcion) {
      setError("errorDescripcion", "La descripción es obligatoria.");
      return false;
    }
    if (descripcion.length < 10) {
      setError("errorDescripcion", "La descripción debe tener mínimo 10 caracteres.");
      return false;
    }
    setError("errorDescripcion", "");
    return true;
  }

  function validateAll() {
    const okNombre = validateNombre();
    const okCiudad = validateCiudad();
    const okEmail = validateEmail();
    const okAsunto = validateAsunto();
    const okDescripcion = validateDescripcion();
    return okNombre && okCiudad && okEmail && okAsunto && okDescripcion;
  }

  // Errores dinámicos (al escribir / salir del input)
  const nombreEl = document.getElementById("nombre");
  const ciudadEl = document.getElementById("ciudad");
  const emailEl = document.getElementById("email");
  const asuntoEl = document.getElementById("asunto");
  const descEl = document.getElementById("descripcion");

  if (nombreEl) nombreEl.addEventListener("input", () => { clearSuccess(); validateNombre(); });
  if (ciudadEl) ciudadEl.addEventListener("input", () => { clearSuccess(); validateCiudad(); });
  if (emailEl) emailEl.addEventListener("input", () => { clearSuccess(); validateEmail(); });
  if (asuntoEl) asuntoEl.addEventListener("input", () => { clearSuccess(); validateAsunto(); });
  if (descEl) descEl.addEventListener("input", () => { clearSuccess(); validateDescripcion(); });

  // Submit: evitar envío si hay errores
  form.addEventListener("submit", (e) => {
    clearSuccess();
    const ok = validateAll();

    if (!ok) {
      e.preventDefault();
      if (successMsg) successMsg.textContent = "";
      return;
    }

    // Como es simulación, evitamos enviar a servidor
    e.preventDefault();

    if (successMsg) {
      successMsg.textContent = "✅ Mensaje enviado correctamente (simulación).";
    }

    form.reset();

    // Limpiar errores visibles
    setError("errorNombre", "");
    setError("errorCiudad", "");
    setError("errorEmail", "");
    setError("errorAsunto", "");
    setError("errorDescripcion", "");
  });

  // Reset: limpiar mensajes
  form.addEventListener("reset", () => {
    clearSuccess();
    setError("errorNombre", "");
    setError("errorCiudad", "");
    setError("errorEmail", "");
    setError("errorAsunto", "");
    setError("errorDescripcion", "");
  });
})();

