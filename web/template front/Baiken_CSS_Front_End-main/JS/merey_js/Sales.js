document.addEventListener('DOMContentLoaded', function() {
    const ads = JSON.parse(localStorage.getItem('salesAds')) || [];
    const adsContainer = document.getElementById('ads-container');
    const cartIcon = document.getElementById("cart-icon");
    const cartSales = JSON.parse(localStorage.getItem("cartSales") || "[]");
    const rowCount = document.getElementById('row-count');

    function filterAds() {
        const priceFrom = parseFloat(document.getElementById('price-from').value) || 0;
        const priceTo = parseFloat(document.getElementById('price-to').value) || Infinity;
        const areaFrom = parseFloat(document.getElementById('arear-from').value) || 0;
        const areaTo = parseFloat(document.getElementById('area-to').value) || Infinity;
        const rooms = document.getElementById('rooms').value;
        const propertyTypes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.id);

        const filteredAds = ads.filter(ad => {
            const price = parseFloat(ad.price);
            const area = parseFloat(ad.area);
            const matchesPrice = price >= priceFrom && price <= priceTo;
            const matchesArea = area >= areaFrom && area <= areaTo;
            const matchesRooms = rooms === "" || ad.rooms === rooms;
            const matchesType = propertyTypes.length === 0 || propertyTypes.includes(ad.property.toLowerCase());
            return matchesPrice && matchesArea && matchesRooms && matchesType;
        });

        displayAds(filteredAds);
    }

    function displayAds(filteredAds) {
        adsContainer.innerHTML = '';
        filteredAds.forEach(ad => {
            const adCard = document.createElement('div');
            adCard.className = 'card mb-4 shadow-sm';
            adCard.innerHTML = `
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${ad.image || './Assets/photo_2024-08-01_20-08-19.jpg'}" class="img-fluid rounded-start" alt="Card image" style="height: 271px; object-fit: cover;">
                    </div>
                    <div class="col-md-4">
                        <div class="card-body">
                            <h5 class="card-title">${ad.category} - ${ad.property}</h5>
                            <p class="card-text"><strong>Location:</strong> ${ad.location}</p>
                            <p class="card-text"><strong>Price:</strong> $${ad.price}</p>
                            <p class="card-text"><strong>Number of Rooms:</strong> ${ad.rooms}</p>
                            <p class="card-text"><strong>Area:</strong> ${ad.area} sq. meters</p>
                            <br><button class="btn btn-primary add-to-cart-btn">Add to Cart</button>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card-body">
                            <p class="card-text"><strong>Additional:</strong> ${ad.additional}</p>
                        </div>
                    </div>
                </div>
            `;

            const button = adCard.querySelector('.add-to-cart-btn');
            const isInCart = cartSales.some(item => item.title === ad.location && item.location === `${ad.category} - ${ad.property}`);
            
            if (isInCart) {
                updateButtonState(button);
            }

            button.addEventListener('click', () => {
                const cartStorageSales = JSON.parse(localStorage.getItem("cartSales") || "[]");
                const cardSales = { 
                    title: ad.location,
                    location: `${ad.category} - ${ad.property}`, 
                    price: `$${ad.price}`, 
                    rooms: ad.rooms, 
                    area: ad.area, 
                    additional: ad.additional,
                    imgSrc: ad.image 
                };
                
                addToCart(button, ad.image);

                localStorage.setItem("cartSales", JSON.stringify([...cartStorageSales, cardSales]));
            });

            adsContainer.appendChild(adCard);
        });
        
        rowCount.innerText = `Total properties found: ${filteredAds.length}`;
    }

    function addToCart(button, imageSrc) {
        const productImage = button.closest('.card').querySelector('img');
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

        updateButtonState(button);
    }

    function updateButtonState(button) {
        button.innerText = "Already in cart";
        button.classList.remove("btn-primary");
        button.classList.add("btn-secondary");
        button.disabled = true;
    }

    document.querySelector('.filter-form').addEventListener('submit', function(event) {
        event.preventDefault();
        filterAds();
    });

    displayAds(ads);
});