let isEmpty = true;

const cartContainer = document.querySelector(".row.mt-4");

const cartStorage = JSON.parse(localStorage.getItem("cart") || "[]");
const cartStorageSales = JSON.parse(localStorage.getItem("cartSales") || "[]");
const cartStorageLease = JSON.parse(localStorage.getItem("cartLease") || "[]");

function createCartCard({ title, location, price, imgSrc, rooms, area }, removeCallback, isLease) {
    const newCard = document.createElement("div");
    newCard.className = "col-md-4";
    newCard.innerHTML = 
        `<div class="card h-100 d-flex flex-column">
            <img src="${imgSrc || './Assets/photo_2024-08-01_20-08-19.jpg'}" class="card-img-top" alt="Card image">
            <div class="card-body d-flex flex-grow-1 flex-column">
                <h5 class="card-title">${location || "New building"}</h5>
                <p><strong>Location:</strong> ${title}</p>
                <p class="card-text"><strong>Price:</strong> ${price}</p>
                <p><strong>Number of rooms:</strong> ${rooms}</p>
                <p><strong>Area:</strong> ${area}</p>
            </div>
            <div class="mt-auto">
                <a href="#" class="mb-2 btn btn-danger" onclick="${removeCallback}('${title}')">Remove</a>
                ${isLease ? '<a href="#" class="mb-2 btn btn-success">Prepaid</a>' : ''}
            </div>
        </div>`
    ;
    cartContainer.appendChild(newCard);
}

if (cartStorage.length || cartStorageSales.length || cartStorageLease.length) {
    cartStorage.forEach(ad => createCartCard(ad, 'removeFromCart', false));
    cartStorageSales.forEach(ad => createCartCard(ad, 'removeFromCartSales', false));
    cartStorageLease.forEach(ad => createCartCard(ad, 'removeFromCartLease', true));
    isEmpty = false;
}

if (isEmpty) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "text-center text-muted my-5";
    emptyMessage.innerText = "Your cart is empty. Tap search to find some housing.";
    cartContainer.appendChild(emptyMessage);
    
    const searchButton = document.createElement("a");
    searchButton.href = "Sales.html"; 
    searchButton.className = "mt-3 btn btn-primary btn-lg";
    searchButton.innerText = "Search"; 
    cartContainer.appendChild(searchButton); 
} else {
    const totalItems = cartStorage.length + cartStorageSales.length + cartStorageLease.length;
    const itemCountMessage = document.createElement("p");
    itemCountMessage.className = "text-center my-5";
    itemCountMessage.innerText = `You have ${totalItems} item(s) in your cart.`; 
    cartContainer.appendChild(itemCountMessage);

    const clearCartButton = document.createElement("button");
    clearCartButton.id = "clear-cart";
    clearCartButton.className = "btn btn-danger my-3";
    clearCartButton.textContent = "Clear All Items";
    clearCartButton.addEventListener("click", clearAllItems);

    cartContainer.appendChild(clearCartButton);
}

function clearAllItems() {
    localStorage.removeItem("cart"); 
    localStorage.removeItem("cartSales"); 
    localStorage.removeItem("cartLease"); 
    location.reload(); 
}

function removeFromCart(title) {
    const updatedCart = cartStorage.filter(item => item.title !== title);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    location.reload();
}

function removeFromCartSales(title) {
    const updatedCartSales = cartStorageSales.filter(item => item.title !== title);
    localStorage.setItem("cartSales", JSON.stringify(updatedCartSales));
    location.reload();
}

function removeFromCartLease(title) {
    const updatedCartLease = cartStorageLease.filter(item => item.title !== title);
    localStorage.setItem("cartLease", JSON.stringify(updatedCartLease));
    location.reload();
}

function showPrepaidModal({ title, location, price, rooms, area, imgSrc }) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "1000";

    const modal = document.createElement("div");
    modal.style.width = "400px";
    modal.style.padding = "20px";
    modal.style.backgroundColor = "white";
    modal.style.borderRadius = "8px";
    modal.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";

    modal.innerHTML = `
        <h3>${title}</h3>
        <p><strong>Price:</strong> ${price}</p>

        <form id="paymentForm">
            <label>Card number:</label>
            <input type="text" class="form-control mb-2" id="cardNumber" placeholder="XXXX XXXX XXXX XXXX" maxlength="19">
            <small id="cardNumberError" class="text-danger"></small><br>

            <label>Validity period:</label>
            <input type="text" class="form-control mb-2" id="validityPeriod" placeholder="MM/YY" maxlength="5">
            <small id="validityPeriodError" class="text-danger"></small><br>

            <label>CVV:</label>
            <input type="password" class="form-control mb-2" id="cvv" placeholder="•••" maxlength="3">
            <small id="cvvError" class="text-danger"></small><br>

            <label>Full name of the owner:</label>
            <input type="text" class="form-control mb-2" id="ownerName" placeholder="NAME SURNAME">
            <small id="ownerNameError" class="text-danger"></small><br>

            <label>Email:</label>
            <input type="email" class="form-control mb-2" id="email" placeholder="example@gmail.com">
            <small id="emailError" class="text-danger"></small><br>

            <label>Phone number:</label>
            <input type="tel" class="form-control mb-2" id="phone" placeholder="+7-777-777-7777">
            <small id="phoneError" class="text-danger"></small>
        </form>

        <button type="button" id="submitOrder" class="btn btn-primary mt-2">Make an advance payment</button><br>
        <button id="closeModal" class="btn btn-secondary mt-3">Close</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    document.getElementById("closeModal").onclick = () => {
        document.body.removeChild(overlay);
    };

    document.getElementById("submitOrder").onclick = () => {
        if (validatePaymentForm()) {
            alert("The prepayment has been made!");
            document.body.removeChild(overlay);
            removeFromCartLease(title);
        }
    };
}

// Валидация полей
function validatePaymentForm() {
    let isValid = true;

    const cardNumber = document.getElementById("cardNumber").value.trim();
    const validityPeriod = document.getElementById("validityPeriod").value.trim();
    const cvv = document.getElementById("cvv").value.trim();
    const ownerName = document.getElementById("ownerName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    // Валидация номера карты
    if (!/^\d{16}$/.test(cardNumber.replace(/\s+/g, ''))) {
        document.getElementById("cardNumberError").textContent = "Invalid card number";
        isValid = false;
    } else {
        document.getElementById("cardNumberError").textContent = "";
    }

    // Валидация срока действия
    if (!/^\d{2}\/\d{2}$/.test(validityPeriod)) {
        document.getElementById("validityPeriodError").textContent = "The format must be MM/YY";
        isValid = false;
    } else {
        document.getElementById("validityPeriodError").textContent = "";
    }

    // Валидация CVV
    if (!/^\d{3}$/.test(cvv)) {
        document.getElementById("cvvError").textContent = "CVV must contain 3 digits";
        isValid = false;
    } else {
        document.getElementById("cvvError").textContent = "";
    }

    // Валидация имени владельца
    if (!/^[A-Za-z\s]+$/.test(ownerName)) {
        document.getElementById("ownerNameError").textContent = "The name must contain only letters";
        isValid = false;
    } else {
        document.getElementById("ownerNameError").textContent = "";
    }

    // Валидация Email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        document.getElementById("emailError").textContent = "Invalid email format";
        isValid = false;
    } else {
        document.getElementById("emailError").textContent = "";
    }

    // Валидация номера телефона
    if (!/^\+7-\d{3}-\d{3}-\d{4}$/.test(phone)) {
        document.getElementById("phoneError").textContent = "The format must be +7-777-777-7777";
        isValid = false;
    } else {
        document.getElementById("phoneError").textContent = "";
    }

    return isValid;
}

function createCartCard({ title, location, price, imgSrc, rooms, area, additional }, removeCallback, isLease) {
    const newCard = document.createElement("div");
    newCard.className = "col-md-4";
    newCard.innerHTML = `
        <div class="card h-100 d-flex flex-column">
            <img src="${imgSrc || './Assets/photo_2024-08-01_20-08-19.jpg'}" class="card-img-top" alt="Card image">
            <div class="card-body d-flex flex-grow-1 flex-column">
                <h5 class="card-title">${location}</h5>
                <p><strong>Category:</strong> ${title}</p>
                <p class="card-text"><strong>Price:</strong> ${price}</p>
                <p><strong>Number of rooms:</strong> ${rooms}</p>
                <p><strong>Area:</strong> ${area}</p>
            </div>
            <div class="mt-auto">
                <a href="#" class="mb-2 btn btn-danger" onclick="${removeCallback}('${title}')">Remove</a>
                ${isLease ? `<a href="#" class="mb-2 btn btn-success" onclick="showPrepaidModal({ title: '${title}', location: '${location}', price: '${price}', rooms: '${rooms}', area: '${area}', imgSrc: '${imgSrc}' })">Prepaid</a>` : ''}
            </div>
        </div>
    `;
    cartContainer.appendChild(newCard);
}