package order

import (
	"GoProject/migrations"
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
	"net/http"
)

var validStatuses = []string{
	"pending", "in_progress", "shipped", "delivered", "cancelled", "returned", "out_for_delivery",
}

func UpdateOrderStatus(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		orderID := chi.URLParam(r, "id")

		var request struct {
			Status string `json:"status"`
		}
		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		isValidStatus := false
		for _, status := range validStatuses {
			if status == request.Status {
				isValidStatus = true
				break
			}
		}

		if !isValidStatus {
			http.Error(w, "Invalid status", http.StatusBadRequest)
			return
		}

		var order migrations.Order
		if err := db.First(&order, orderID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				http.Error(w, "Order not found", http.StatusNotFound)
			} else {
				http.Error(w, "Failed to fetch order", http.StatusInternalServerError)
			}
			return
		}

		order.Status = request.Status
		if err := db.Save(&order).Error; err != nil {
			http.Error(w, "Failed to update order status", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(order)
	}
}
