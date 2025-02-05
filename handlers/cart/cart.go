package cart

import (
	config "GoProject/configs"
	"GoProject/migrations"
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

func AddToCart(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user, err := config.VerifyJWT(w, r, db)
		if err != nil || user == nil {
			return // Ошибка уже обработана в VerifyJWT
		}

		var cartItem struct {
			ProductID uint `json:"product_id"`
			Quantity  int  `json:"quantity"`
		}

		if err := json.NewDecoder(r.Body).Decode(&cartItem); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		if cartItem.ProductID == 0 || cartItem.Quantity <= 0 {
			http.Error(w, "ProductID and valid Quantity are required", http.StatusBadRequest)
			return
		}

		var existingCartItem migrations.CartItem
		err = db.Where("user_id = ? AND product_id = ?", user.ID, cartItem.ProductID).First(&existingCartItem).Error

		if err == nil {
			existingCartItem.Quantity += cartItem.Quantity
			if err := db.Save(&existingCartItem).Error; err != nil {
				http.Error(w, "Failed to update cart item", http.StatusInternalServerError)
				return
			}
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(existingCartItem)
			return
		}

		if err == gorm.ErrRecordNotFound {
			newCartItem := migrations.CartItem{
				UserID:    user.ID,
				ProductID: cartItem.ProductID,
				Quantity:  cartItem.Quantity,
			}

			if err := db.Create(&newCartItem).Error; err != nil {
				http.Error(w, "Failed to add item to cart", http.StatusInternalServerError)
				return
			}

			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(newCartItem)
			return
		}

		http.Error(w, "Database error", http.StatusInternalServerError)
	}
}

func UpdateCartItemQuantity(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cartItemID := chi.URLParam(r, "id")
		quantityStr := chi.URLParam(r, "quantity")

		newQuantity, err := strconv.Atoi(quantityStr)
		if err != nil || newQuantity < 0 {
			http.Error(w, "Invalid quantity", http.StatusBadRequest)
			return
		}

		var existingCartItem migrations.CartItem
		err = db.Where("id = ?", cartItemID).First(&existingCartItem).Error
		if err != nil {
			http.Error(w, "Item not found in cart", http.StatusNotFound)
			return
		}

		if newQuantity == 0 {
			if err := db.Delete(&existingCartItem).Error; err != nil {
				http.Error(w, "Failed to remove item from cart", http.StatusInternalServerError)
				return
			}
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(map[string]string{"message": "Item removed from cart"})
			return
		}

		existingCartItem.Quantity = newQuantity
		if err := db.Save(&existingCartItem).Error; err != nil {
			http.Error(w, "Failed to update cart item quantity", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(existingCartItem)
	}
}

func RemoveOneItemFromCart(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cartItemID := chi.URLParam(r, "id")
		var cartItem migrations.CartItem

		if err := db.First(&cartItem, cartItemID).Error; err != nil {
			http.Error(w, "Item not found", http.StatusNotFound)
			return
		}

		if cartItem.Quantity > 1 {
			cartItem.Quantity -= 1
			if err := db.Save(&cartItem).Error; err != nil {
				http.Error(w, "Failed to update cart item quantity", http.StatusInternalServerError)
				return
			}

			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(cartItem)
		} else {
			if err := db.Delete(&cartItem).Error; err != nil {
				http.Error(w, "Failed to remove item from cart", http.StatusInternalServerError)
				return
			}

			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(map[string]string{"message": "Item removed from cart"})
		}
	}
}

func RemoveFromCart(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cartItemID := chi.URLParam(r, "id")
		if cartItemID == "" {
			http.Error(w, "Invalid cart item ID", http.StatusBadRequest)
			return
		}

		var cartItem migrations.CartItem
		if err := db.First(&cartItem, cartItemID).Error; err != nil {
			http.Error(w, "Item not found", http.StatusNotFound)
			return
		}

		if err := db.Delete(&cartItem).Error; err != nil {
			http.Error(w, "Failed to remove item from cart", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Item permanently removed from cart"})
	}
}

func GetCartByUser(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := chi.URLParam(r, "user_id")

		var cartItems []migrations.CartItem
		if err := db.Where("user_id = ?", userID).Find(&cartItems).Error; err != nil {
			http.Error(w, "Failed to retrieve cart items", http.StatusInternalServerError)
			return
		}

		type CartResponse struct {
			ID       uint    `json:"id"`
			Name     string  `json:"name"`
			Price    float64 `json:"price"`
			Quantity int     `json:"quantity"`
		}

		var cartResponse []CartResponse
		for _, item := range cartItems {
			var product migrations.Product
			if err := db.First(&product, item.ProductID).Error; err == nil {
				cartResponse = append(cartResponse, CartResponse{
					ID:       product.ID,
					Name:     product.Name,
					Price:    product.Price,
					Quantity: item.Quantity,
				})
			}
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(cartResponse)
	}
}

func GetCartID(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userID := chi.URLParam(r, "user_id")
		productID := chi.URLParam(r, "product_id")

		if userID == "" || productID == "" {
			http.Error(w, "user_id and product_id are required", http.StatusBadRequest)
			return
		}

		productIDInt, err := strconv.Atoi(productID)
		if err != nil {
			http.Error(w, "Invalid product_id", http.StatusBadRequest)
			return
		}

		var cartItem migrations.CartItem
		if err := db.Where("user_id = ? AND product_id = ?", userID, productIDInt).First(&cartItem).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				http.Error(w, "Cart item not found", http.StatusNotFound)
				return
			}
			http.Error(w, "Database error", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]uint{"cart_id": cartItem.ID})
	}
}
