package order_handlers

import (
	"GoProject/migrations"
	"encoding/json"
	"gorm.io/gorm"
	"net/http"
)

type CreateOrderRequest struct {
	UserID         uint               `json:"user_id"`
	DeliveryMethod string             `json:"delivery_method"`
	PickupPointID  *uint              `json:"pickup_point_id"`
	Address        *string            `json:"address"`
	TotalPrice     float64            `json:"total_price"`
	OrderItems     []OrderItemRequest `json:"order_items"`
}

type OrderItemRequest struct {
	ProductID uint    `json:"product_id"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
}

func CreateOrder(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request CreateOrderRequest
		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		order := migrations.Order{
			UserID:         request.UserID,
			DeliveryMethod: request.DeliveryMethod,
			PickupPointID:  request.PickupPointID,
			Address:        request.Address,
			Status:         "pending",
			TotalPrice:     request.TotalPrice,
		}

		if err := db.Create(&order).Error; err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		for _, item := range request.OrderItems {
			orderItem := migrations.OrderItem{
				OrderID:   order.ID,
				ProductID: item.ProductID,
				Quantity:  item.Quantity,
				Price:     item.Price,
			}
			if err := db.Create(&orderItem).Error; err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(order)
	}
}
