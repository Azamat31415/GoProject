package order

import (
	"encoding/json"
	"net/http"
	"strconv"

	"GoProject/migrations"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
)

// GetOrders возвращает все заказы пользователя через query параметр
func GetOrders(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userIDParam := r.URL.Query().Get("user_id")
		if userIDParam == "" {
			http.Error(w, "User ID is required", http.StatusBadRequest)
			return
		}

		userID, err := strconv.Atoi(userIDParam)
		if err != nil {
			http.Error(w, "Invalid User ID", http.StatusBadRequest)
			return
		}

		var orders []migrations.Order
		if err := db.Preload("OrderItems").Where("user_id = ?", userID).Find(&orders).Error; err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(orders)
	}
}

// GetOrderHistory возвращает историю заказов для конкретного пользователя через URL параметр
func GetOrderHistory(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userIDStr := chi.URLParam(r, "user_id")
		userID, err := strconv.Atoi(userIDStr)
		if err != nil {
			http.Error(w, "Invalid user ID", http.StatusBadRequest)
			return
		}

		var orders []migrations.Order
		if err := db.Where("user_id = ?", userID).Preload("OrderItems").Find(&orders).Error; err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(orders)
	}
}
