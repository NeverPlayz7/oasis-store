// Add to Cart functionality
document.querySelectorAll('.cart-btn').forEach(button => {
    button.addEventListener('click', () => {
        const productName = button.parentElement.querySelector('h3').innerText;
        alert(`${productName} added to cart!`);
    });
});

// Floating buttons click effect
document.querySelector('.phone').addEventListener('click', () => {
    window.location.href = 'tel:+1234567890'; // Replace with real number
});

document.querySelector('.instagram').addEventListener('click', () => {
    alert('Redirecting to Instagram...');
});
