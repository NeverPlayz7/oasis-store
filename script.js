/* ===== AUTOPLAY FEATURE ===== */
let autoplayInterval;
const AUTOPLAY_DELAY = 3000; // 3 seconds

function startAutoplay() {
  autoplayInterval = setInterval(() => {
    track.scrollBy({ left: 350, behavior: "smooth" });
  }, AUTOPLAY_DELAY);
}

function stopAutoplay() {
  clearInterval(autoplayInterval);
}

/* Start autoplay on load */
startAutoplay();

/* Pause on hover */
track.addEventListener("mouseenter", stopAutoplay);
track.addEventListener("mouseleave", startAutoplay);

/* Pause while user interacts */
track.addEventListener("mousedown", stopAutoplay);
track.addEventListener("touchstart", stopAutoplay);

/* Resume after interaction */
track.addEventListener("mouseup", startAutoplay);
track.addEventListener("touchend", startAutoplay);
