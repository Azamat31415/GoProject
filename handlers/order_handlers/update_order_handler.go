package order_handlers

import (
	"GoProject/migrations"
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

type UpdateOrderStatusRequest struct {
	Status string `json:"status"`
}

func UpdateOrderStatusHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		orderIDStr := chi.URLParam(r, "id")
		orderID, err := strconv.Atoi(orderIDStr)
		if err != nil {
			http.Error(w, "Invalid order ID", http.StatusBadRequest)
			return
		}

		var req UpdateOrderStatusRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if req.Status == "" {
			http.Error(w, "Status is required", http.StatusBadRequest)
			return
		}

		var order migrations.Order
		if err := db.First(&order, orderID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				http.Error(w, "Order not found", http.StatusNotFound)
			} else {
				http.Error(w, "Database error", http.StatusInternalServerError)
			}
			return
		}

		order.Status = req.Status
		if err := db.Save(&order).Error; err != nil {
			http.Error(w, "Failed to update order status", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Order status updated successfully"))
	}
}
