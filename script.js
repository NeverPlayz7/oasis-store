const track = document.querySelector(".carousel-track");
const leftBtn = document.querySelector(".arrow.left");
const rightBtn = document.querySelector(".arrow.right");

let isDown = false;
let startX;
let scrollLeft;

/* Arrow scroll */
rightBtn.onclick = () => track.scrollBy({ left: 350, behavior: "smooth" });
leftBtn.onclick  = () => track.scrollBy({ left: -350, behavior: "smooth" });

/* Drag (Desktop) */
track.addEventListener("mousedown", e => {
  isDown = true;
  startX = e.pageX;
  scrollLeft = track.scrollLeft;
});
track.addEventListener("mouseleave", () => isDown = false);
track.addEventListener("mouseup", () => isDown = false);
track.addEventListener("mousemove", e => {
  if(!isDown) return;
  track.scrollLeft = scrollLeft - (e.pageX - startX);
});

/* Touch Swipe (Mobile) */
track.addEventListener("touchstart", e => {
  startX = e.touches[0].pageX;
  scrollLeft = track.scrollLeft;
});
track.addEventListener("touchmove", e => {
  track.scrollLeft = scrollLeft - (e.touches[0].pageX - startX);
});

/* Infinite Loop */
track.addEventListener("scroll", () => {
  if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 5) {
    track.scrollLeft = 0;
  }
  if (track.scrollLeft <= 0) {
    track.scrollLeft = track.scrollWidth;
  }
});
