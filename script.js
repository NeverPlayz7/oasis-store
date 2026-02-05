// Slider Infinite Loop + Arrow + Swipe
const slider = document.querySelector('.product-slider');
const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');

let isDragging = false;
let startX;
let scrollLeft;

// Clone first and last products for infinite loop
const slides = slider.children;
slider.appendChild(slides[0].cloneNode(true));
slider.insertBefore(slides[slides.length-2].cloneNode(true), slides[0]);

// Current index
let index = 1;
const slideWidth = slides[0].offsetWidth + 30; // card width + gap
slider.style.transform = `translateX(-${slideWidth * index}px)`;

// Arrow click
function moveToSlide(direction){
    index += direction;
    slider.style.transition = 'transform 0.5s ease';
    slider.style.transform = `translateX(-${slideWidth * index}px)`;
}

rightBtn.addEventListener('click', ()=> moveToSlide(1));
leftBtn.addEventListener('click', ()=> moveToSlide(-1));

// Loop check
slider.addEventListener('transitionend', () => {
    if(slides[index].id === 'lastClone'){
        slider.style.transition = 'none';
        index = slides.length - 2;
        slider.style.transform = `translateX(-${slideWidth * index}px)`;
    }
    if(slides[index].id === 'firstClone'){
        slider.style.transition = 'none';
        index = 1;
        slider.style.transform = `translateX(-${slideWidth * index}px)`;
    }
});

// Mouse drag
slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.offsetLeft;
});
slider.addEventListener('mouseup', ()=> isDragging = false);
slider.addEventListener('mouseleave', ()=> isDragging = false);
slider.addEventListener('mousemove', (e) => {
    if(!isDragging) return;
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft = scrollLeft - walk;
});

// Touch swipe
slider.addEventListener('touchstart', e => startX = e.touches[0].pageX - slider.offsetLeft);
slider.addEventListener('touchmove', e => {
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;
    slider.scrollLeft -= walk;
});
