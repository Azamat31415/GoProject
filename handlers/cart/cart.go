package cart

import (
	"GoProject/migrations"
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

func AddToCart(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var cartItem migrations.CartItem

		if err := json.NewDecoder(r.Body).Decode(&cartItem); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}
		if cartItem.UserID == 0 || cartItem.ProductID == 0 {
			http.Error(w, "UserID and ProductID are required", http.StatusBadRequest)
			return
		}
		var existingCartItem migrations.CartItem
		err := db.Where("user_id = ? AND product_id = ?", cartItem.UserID, cartItem.ProductID).First(&existingCartItem).Error

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
				UserID:    cartItem.UserID,
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
		// Извлекаем ID товара и новое количество из URL
		cartItemID := chi.URLParam(r, "id")
		quantity := chi.URLParam(r, "quantity")

		// Преобразуем количество в целое число
		newQuantity, err := strconv.Atoi(quantity)
		if err != nil || newQuantity <= 0 {
			http.Error(w, "Invalid quantity", http.StatusBadRequest)
			return
		}

		// Ищем товар в корзине по ID
		var existingCartItem migrations.CartItem
		err = db.Where("id = ?", cartItemID).First(&existingCartItem).Error
		if err != nil {
			http.Error(w, "Item not found in cart", http.StatusNotFound)
			return
		}

		// Обновляем количество товара
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
