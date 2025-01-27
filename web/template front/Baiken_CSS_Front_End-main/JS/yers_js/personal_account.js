document.addEventListener('DOMContentLoaded', function() {
    const cartContainer = document.getElementById('ads-container');
    const adsCountElement = document.getElementById('ads-count');
    let ads = JSON.parse(localStorage.getItem('personalAccountAds')) || [];

    function displayAds() {
        adsCountElement.innerText = `Number of Ads: ${ads.length}`;

        cartContainer.innerHTML = ''; 

        if (ads.length === 0) {
            cartContainer.innerHTML = '<p class="personal-account-text">You don\'t have any ads on your site yet</p>';
        } else {
            ads.forEach(ad => {
                createAdCard(ad);
            });
        }
    }

    function createAdCard(ad) {
        const newCard = document.createElement('div');
        newCard.classList.add('col-md-4', 'mb-4');
        newCard.innerHTML = `
            <div class="card h-100 d-flex flex-column">
                <img src="${ad.image || 'default_image.jpg'}" class="card-img-top" alt="Ad image">
                <div class="card-body d-flex flex-grow-1 flex-column">
                    <h5 class="card-title">${ad.location}</h5>
                    <p><strong>Category:</strong> ${ad.property}</p>
                    <p class="card-text"><strong>Price:</strong> $${ad.price}</p>
                    <p><strong>Number of rooms:</strong> ${ad.rooms}</p>
                    <p><strong>Area:</strong> ${ad.area} sq. meters</p>
                </div>
                <div class="mt-auto">
                    <a href="#" class="mb-2 btn btn-danger remove-ad-btn">Remove</a>
                </div>
            </div>
        `;
    
        newCard.querySelector('.remove-ad-btn').addEventListener('click', function(event) {
            event.preventDefault();
            removeAd(ad.location);
            location.reload();
        });
    
        cartContainer.appendChild(newCard);
    }    

    function removeAd(location) {
        ads = ads.filter(ad => ad.location !== location);
        localStorage.setItem('personalAccountAds', JSON.stringify(ads));
    
        let salesAds = JSON.parse(localStorage.getItem('salesAds')) || [];
        salesAds = salesAds.filter(ad => ad.location !== location);
        localStorage.setItem('salesAds', JSON.stringify(salesAds));
        
        let leaseAds = JSON.parse(localStorage.getItem('leaseAds')) || [];
        leaseAds = leaseAds.filter(ad => ad.location !== location);
        localStorage.setItem('leaseAds', JSON.stringify(leaseAds));
    
        let cartLease = JSON.parse(localStorage.getItem('cartLease')) || [];
        cartLease = cartLease.filter(ad => ad.title !== location);
        localStorage.setItem('cartLease', JSON.stringify(cartLease));
    
        let cartSales = JSON.parse(localStorage.getItem('cartSales')) || [];
        cartSales = cartSales.filter(ad => ad.title !== location);
        localStorage.setItem('cartSales', JSON.stringify(cartSales));
    
        displayAds();
    }
    

    displayAds();
});
