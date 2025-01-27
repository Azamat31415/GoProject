document.addEventListener("DOMContentLoaded", function() {
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartSalesItems = JSON.parse(localStorage.getItem("cartSales") || "[]");
    const cartLeaseItems = JSON.parse(localStorage.getItem("cartLease") || "[]");

    const totalItems = cartItems.length + cartSalesItems.length + cartLeaseItems.length;

    const cartIcon = document.querySelector(".header-right a[href='Cart.html']");

    if (totalItems > 0 && cartIcon) {
        const badge = document.createElement("span");
        badge.style.position = "absolute";
        badge.style.top = "-5px";
        badge.style.right = "-10px";
        badge.style.backgroundColor = "#008B8B";
        badge.style.color = "white";
        badge.style.borderRadius = "50%";
        badge.style.padding = "2px 7px";
        badge.style.fontSize = "12px";
        badge.style.fontWeight = "bold";
        badge.style.zIndex = "10";
        badge.textContent = totalItems;

        cartIcon.style.position = "relative";
        cartIcon.appendChild(badge);
    }
});