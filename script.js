const grainCanvas = document.querySelector("#grain-canvas");
const grainCtx = grainCanvas.getContext("2d");
const glow = document.querySelector(".cursor-glow");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function sizeCanvases() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  grainCanvas.width = Math.floor(window.innerWidth * ratio);
  grainCanvas.height = Math.floor(window.innerHeight * ratio);
  grainCanvas.style.width = `${window.innerWidth}px`;
  grainCanvas.style.height = `${window.innerHeight}px`;
  grainCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawGrain() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const imageData = grainCtx.createImageData(width, height);
  const buffer = imageData.data;

  for (let i = 0; i < buffer.length; i += 4) {
    const value = 120 + Math.random() * 80;
    buffer[i] = value;
    buffer[i + 1] = 10;
    buffer[i + 2] = 24;
    buffer[i + 3] = Math.random() * 18;
  }

  grainCtx.putImageData(imageData, 0, 0);
}

sizeCanvases();
drawGrain();

window.addEventListener("resize", () => {
  sizeCanvases();
  drawGrain();
});

if (!prefersReducedMotion) {
  setInterval(drawGrain, 1400);
}

window.addEventListener("pointermove", (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll("[data-reveal]").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 45, 360)}ms`;
  revealObserver.observe(element);
});

document.querySelectorAll(".role-board article, .skills-matrix article, .project-row, .proof-grid article, .education-stack article, .post-grid a").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -5;
    card.style.transform = `translateY(-5px) rotateX(${y}deg) rotateY(${x}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});
