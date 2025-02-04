package cart

import (
	"GoProject/migrations"
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
	"io"
	"net/http"
	"strconv"
)

func AddToCart(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var cartItem migrations.CartItem

		// Читаем тело запроса и логируем
		bodyBytes, _ := io.ReadAll(r.Body)
		fmt.Println("📥 Received JSON:", string(bodyBytes)) // Логируем входные данные

		// Проверяем, что JSON корректный
		if err := json.Unmarshal(bodyBytes, &cartItem); err != nil {
			fmt.Println("❌ JSON Decode Error:", err)
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		fmt.Println("✅ Parsed cartItem:", cartItem)

		if cartItem.UserID == 0 || cartItem.ProductID == 0 {
			fmt.Println("❌ Missing user_id or product_id")
			http.Error(w, "UserID and ProductID are required", http.StatusBadRequest)
			return
		}

		fmt.Println("🛒 Adding item to cart: ", cartItem)

		// Проверяем, существует ли товар уже в корзине
		var existingCartItem migrations.CartItem
		err := db.Where("user_id = ? AND product_id = ?", cartItem.UserID, cartItem.ProductID).First(&existingCartItem).Error

		if err == nil {
			existingCartItem.Quantity += cartItem.Quantity
			if err := db.Save(&existingCartItem).Error; err != nil {
				fmt.Println("❌ Failed to update cart item:", err)
				http.Error(w, "Failed to update cart item", http.StatusInternalServerError)
				return
			}
			fmt.Println("✅ Cart item updated:", existingCartItem)
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
				fmt.Println("❌ Failed to add item to cart:", err)
				http.Error(w, "Failed to add item to cart", http.StatusInternalServerError)
				return
			}

			fmt.Println("✅ New item added to cart:", newCartItem)
			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(newCartItem)
			return
		}

		fmt.Println("❌ Database error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
	}
}

func UpdateCartItemQuantity(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Извлекаем ID товара и новое количество из URL
		cartItemID := chi.URLParam(r, "id")
		quantity := chi.URLParam(r, "quantity")

		newQuantity, err := strconv.Atoi(quantity)
		if err != nil || newQuantity <= 0 {
			http.Error(w, "Invalid quantity", http.StatusBadRequest)
			return
		}

		var existingCartItem migrations.CartItem
		err = db.Where("id = ?", cartItemID).First(&existingCartItem).Error
		if err != nil {
			http.Error(w, "Item not found in cart", http.StatusNotFound)
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

		var products []migrations.Product
		for _, item := range cartItems {
			var product migrations.Product
			if err := db.First(&product, item.ProductID).Error; err == nil {
				products = append(products, product)
			}
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(products)
	}
}
