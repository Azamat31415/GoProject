package order_handlers

import (
	"GoProject/migrations"
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
	"net/http"
)

type ChooseDeliveryRequest struct {
	DeliveryMethod string  `json:"delivery_method" binding:"required"`
	PickupPointID  *uint   `json:"pickup_point_id,omitempty"`
	Address        *string `json:"address,omitempty"`
}

func ChooseDeliveryMethod(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req ChooseDeliveryRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, fmt.Sprintf("Error parsing JSON: %s", err.Error()), http.StatusBadRequest)
			return
		}

		orderID := chi.URLParam(r, "order_id")
		var order migrations.Order

		if err := db.First(&order, orderID).Error; err != nil {
			http.Error(w, "Order not found", http.StatusNotFound)
			return
		}

		order.DeliveryMethod = req.DeliveryMethod
		if req.DeliveryMethod == "pickup" {
			if req.PickupPointID != nil {
				order.PickupPointID = req.PickupPointID
			} else {
				http.Error(w, "Pickup point ID is required for pickup", http.StatusBadRequest)
				return
			}
		} else if req.DeliveryMethod == "delivery" {
			if req.Address == nil {
				http.Error(w, "Address is required for delivery", http.StatusBadRequest)
				return
			}
			order.Address = req.Address
		}

		if err := db.Save(&order).Error; err != nil {
			http.Error(w, "Failed to update delivery method", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		response := map[string]interface{}{
			"message": "Delivery method updated successfully",
			"order":   order,
		}
		json.NewEncoder(w).Encode(response)
	}
}
