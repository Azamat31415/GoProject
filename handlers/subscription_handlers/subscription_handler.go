package subscription_handlers

import (
	"GoProject/migrations"
	"gorm.io/gorm"
	"net/http"
	"time"

	"encoding/json"
	"github.com/go-chi/chi/v5"
)

type CreateSubscriptionRequest struct {
	UserID       uint   `json:"user_id"`
	IntervalDays int    `json:"interval_days"`
	Type         string `json:"type"`
	Status       string `json:"status"`
}

func CreateSubscription(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req CreateSubscriptionRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		subscription := migrations.Subscription{
			UserID:       req.UserID,
			StartDate:    time.Now(),
			RenewalDate:  time.Now().AddDate(0, 0, req.IntervalDays),
			IntervalDays: req.IntervalDays,
			Type:         req.Type,
			Status:       req.Status,
		}

		if err := db.Create(&subscription).Error; err != nil {
			http.Error(w, "Failed to create subscription", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(subscription)
	}
}

func DeleteSubscription(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		subscriptionID := chi.URLParam(r, "id")
		if subscriptionID == "" {
			http.Error(w, "Missing subscription ID", http.StatusBadRequest)
			return
		}

		if err := db.Delete(&migrations.Subscription{}, subscriptionID).Error; err != nil {
			http.Error(w, "Failed to delete subscription", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}
