package order

import (
	"GoProject/migrations"
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
	"net/http"
	"time"
)

type UpdateOrderStatusRequest struct {
	Status string `json:"status"`
}

func UpdateOrderStatus(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		orderID := chi.URLParam(r, "id")
		if orderID == "" {
			http.Error(w, "Missing order ID", http.StatusBadRequest)
			return
		}

		var req UpdateOrderStatusRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		validStatuses := map[string]int{
			"pending":    0,
			"processing": 1,
			"shipped":    2,
			"on the way": 3,
			"delivered":  4,
			"canceled":   5,
		}

		currentStatus, validStatus := validStatuses[req.Status]
		if !validStatus {
			http.Error(w, "Invalid status", http.StatusBadRequest)
			return
		}

		var order migrations.Order
		if err := db.First(&order, orderID).Error; err != nil {
			http.Error(w, "Order not found", http.StatusNotFound)
			return
		}

		currentOrderStatusIndex := validStatuses[order.Status]
		if currentOrderStatusIndex >= currentStatus {
			http.Error(w, "Cannot update status to an earlier stage", http.StatusBadRequest)
			return
		}

		order.Status = req.Status
		order.UpdatedAt = time.Now()

		if err := db.Save(&order).Error; err != nil {
			http.Error(w, "Failed to update order status", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(order)
	}
}
