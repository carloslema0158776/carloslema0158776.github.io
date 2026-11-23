const menuToggle = document.querySelector(".nav-toggle");
const navigation = menuToggle.closest(".nav");

function setMenuExpanded(expanded) {
  menuToggle.setAttribute("aria-expanded", String(expanded));
  menuToggle.setAttribute("aria-label", expanded ? "Cerrar menú" : "Abrir menú");
}

menuToggle.addEventListener("click", () => {
  setMenuExpanded(menuToggle.getAttribute("aria-expanded") === "false");
});

navigation.addEventListener("click", event => {
  if (event.target.closest("a")) setMenuExpanded(false);
});

navigation.addEventListener("keydown", event => {
  if (event.key !== "Escape" || menuToggle.getAttribute("aria-expanded") !== "true") return;
  setMenuExpanded(false);
  menuToggle.focus();
});

navigation.dataset.menuReady = "";

for (const link of document.querySelectorAll("a[href]:not([download])")) {
  const isWebLink = link.protocol === "https:" || link.protocol === "http:";
  if (isWebLink && link.origin !== window.location.origin) {
    link.target = "_blank";
    link.relList.add("noopener");
  }
}

function downloadLocalCertificate(event) {
  event.preventDefault();

  const link = event.currentTarget;
  if (link.getAttribute("aria-busy") === "true") return;

  const payload = document.createElement("script");
  payload.src = link.href.replace(/\.pdf$/i, ".download.js");
  link.setAttribute("aria-busy", "true");

  function finish() {
    payload.remove();
    link.removeAttribute("aria-busy");
  }

  payload.addEventListener("load", () => {
    try {
      const bytes = Uint8Array.from(atob(payload.pdfBase64), character => character.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      const download = document.createElement("a");
      download.href = url;
      download.download = new URL(link.href).pathname.split("/").pop();
      document.body.append(download);
      download.click();
      download.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch {
      window.alert("No se pudo preparar la descarga del certificado.");
    } finally {
      finish();
    }
  });
  payload.addEventListener("error", () => {
    finish();
    window.alert("No se pudo cargar la descarga del certificado.");
  });
  document.head.append(payload);
}

if (window.location.protocol === "file:") {
  for (const link of document.querySelectorAll(".certification-actions a[download]")) {
    link.addEventListener("click", downloadLocalCertificate);
  }
}

const backToTop = document.querySelector(".back-to-top");

function updateBackToTop() {
  backToTop.hidden = window.scrollY < 240;
}

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

const filter = document.querySelector("#filtros");
const options = document.querySelector("#opciones-filtro");
const status = document.querySelector("#resultados");
const projects = [...document.querySelectorAll("#lista-proyectos [data-asignatura]")];
const subjectOrder = ["Bases de datos", "Estructuras de datos", "POO"];
const subjects = [...new Set(projects.map(project => project.dataset.asignatura))]
  .sort((left, right) => {
    const leftIndex = subjectOrder.indexOf(left);
    const rightIndex = subjectOrder.indexOf(right);
    if (leftIndex !== -1 || rightIndex !== -1) {
      return (leftIndex === -1 ? subjectOrder.length : leftIndex)
        - (rightIndex === -1 ? subjectOrder.length : rightIndex);
    }
    return left.localeCompare(right, "es");
  });

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let projectAnimations = [];

function updateProjects(subject, animate = false) {
  projectAnimations.forEach(animation => animation.cancel());
  projectAnimations = [];

  const animateResults = animate && !reducedMotion.matches;
  let visible = 0;

  for (const project of projects) {
    const matches = subject === "" || project.dataset.asignatura === subject;
    project.hidden = !matches;
    if (!matches) continue;

    if (animateResults) {
      const animation = project.animate(
        [{ opacity: .15, transform: "translateY(9px)" }, { opacity: 1, transform: "none" }],
        {
          duration: 320,
          delay: Math.min(visible, 4) * 35,
          easing: "cubic-bezier(.2, .7, .3, 1)",
          fill: "backwards",
        },
      );
      projectAnimations.push(animation);
    }
    visible += 1;
  }

  status.textContent = visible === 1 ? "1 proyecto" : `${visible} proyectos`;
}

if (subjects.length > 1) {
  for (const subject of ["", ...subjects]) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    const caption = document.createElement("span");

    label.className = "filter-option";
    input.type = "radio";
    input.name = "asignatura";
    input.value = subject;
    input.checked = subject === "";
    caption.textContent = subject || "Todas";

    label.append(input, caption);
    options.append(label);
  }

  filter.addEventListener("change", event => updateProjects(event.target.value, true));
  updateProjects("");
  filter.hidden = false;
  status.hidden = false;
}

const trails = document.querySelectorAll(".light-trails path");
let trailFrame = null;

function drawTrail(direction, progress) {
  const startX = 600 + direction * 60;
  const startY = 250;
  const length = 200 + progress * 332;
  const side = Math.sign(direction);
  const outerLane = Math.max(0, Math.abs(direction) - 1);
  const spread = 79 + progress * 271 + outerLane * (8 + progress * 10);
  const halfWidth = 10 + progress * 10;
  const bendX = startX + side * spread * .28;
  const endX = startX + side * spread;
  const firstBendY = startY + length * .24;
  const secondBendY = startY + length * .66;
  const endY = startY + length;

  return [
    `M ${startX - 2} ${startY}`,
    `C ${startX - 2} ${firstBendY}, ${bendX - halfWidth * .6} ${secondBendY}, ${endX - halfWidth} ${endY}`,
    `L ${endX + halfWidth} ${endY}`,
    `C ${bendX + halfWidth * .6} ${secondBendY}, ${startX + 2} ${firstBendY}, ${startX + 2} ${startY} Z`,
  ].join(" ");
}

function updateTrails() {
  trailFrame = null;
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollRange > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollRange)) : 0;

  trails.forEach((trail, index) => {
    trail.setAttribute("d", drawTrail(index - Math.floor(trails.length / 2), reducedMotion.matches ? .5 : progress));
  });
}

function queueTrailUpdate() {
  if (trailFrame === null) trailFrame = window.requestAnimationFrame(updateTrails);
}

function syncTrailMotion() {
  if (reducedMotion.matches) {
    window.removeEventListener("scroll", queueTrailUpdate);
  } else {
    window.addEventListener("scroll", queueTrailUpdate, { passive: true });
  }
  queueTrailUpdate();
}

reducedMotion.addEventListener("change", syncTrailMotion);
window.addEventListener("resize", queueTrailUpdate);
new ResizeObserver(queueTrailUpdate).observe(document.body);
syncTrailMotion();
