const cards = document.querySelectorAll(".card")

cards.forEach((el, idx) => {
    console.dir(el)
    const btnParent = el.childNodes[7]
    const btn = btnParent.childNodes[1]
    const titleParent = el.childNodes[3]
    const title = titleParent.childNodes[3].innerText
    const price = titleParent.childNodes[1].innerText
    const img = el.childNodes[1]
    const imgSrc = img.getAttribute('src');

    btn.addEventListener("click", () =>{
        const area = Array.from(el.querySelectorAll('input[name="apartment"]:checked'))
                                        .map(input => input.nextElementSibling.textContent);
        const location = 'New building';
        const rooms = 'Some';

        if (area.length === 0) {
            alert("Select at least 1 apartment.");
            return;
        }

        const cartStorage = localStorage.getItem("cart") || "[]"
        const cart = JSON.parse(cartStorage)
        const card = { title, location ,price, imgSrc, rooms, area }
        localStorage.setItem("cart", JSON.stringify([...cart, card]))

        addToCart(btn);
    })
})

function addToCart(button) {
    const card = button.closest('.card');
    const productImage = card.querySelector('.card-img-top');
    const cartIcon = document.getElementById("cart-icon");

    const productRect = productImage.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyingImage = productImage.cloneNode(true);
    flyingImage.style.position = 'fixed';
    flyingImage.style.left = `${productRect.left}px`;
    flyingImage.style.top = `${productRect.top}px`;
    flyingImage.style.width = `${productRect.width}px`;
    flyingImage.style.height = `${productRect.height}px`;
    flyingImage.style.zIndex = '1000';
    flyingImage.style.transition = 'all 1s ease-in-out';
    flyingImage.style.borderRadius = '10%';
    document.body.appendChild(flyingImage);

    setTimeout(() => {
        flyingImage.style.left = `${cartRect.left}px`;
        flyingImage.style.top = `${cartRect.top}px`;
        flyingImage.style.width = '30px';
        flyingImage.style.height = '30px';
        flyingImage.style.opacity = '0.5';
    }, 10);

    flyingImage.addEventListener('transitionend', () => {
        flyingImage.remove();
        cartIcon.classList.add('animated');

        setTimeout(() => {
            cartIcon.classList.remove('animated');
            location.reload();
        }, 500); 
    });
}

const cardElements = document.querySelectorAll('.card'); 
const cardCount = cardElements.length; 

const cardCountDisplay = document.getElementById('card-count');
cardCountDisplay.innerText = `Total number of new buildings: ${cardCount}`; 