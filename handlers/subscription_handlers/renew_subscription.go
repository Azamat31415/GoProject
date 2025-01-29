package subscription_handlers

import (
	"GoProject/migrations"
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
	"net/http"
	"time"
)

func RenewSubscription(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		subscriptionID := chi.URLParam(r, "id")
		if subscriptionID == "" {
			http.Error(w, "Missing subscription ID", http.StatusBadRequest)
			return
		}

		var subscription migrations.Subscription
		if err := db.First(&subscription, subscriptionID).Error; err != nil {
			http.Error(w, "Subscription not found", http.StatusNotFound)
			return
		}

		// Check if subscription is active
		if subscription.Status != "active" {
			http.Error(w, "Cannot renew a non-active subscription", http.StatusBadRequest)
			return
		}

		// Extend the renewal date
		subscription.RenewalDate = subscription.RenewalDate.AddDate(0, 0, subscription.IntervalDays)
		subscription.UpdatedAt = time.Now()

		if err := db.Save(&subscription).Error; err != nil {
			http.Error(w, "Failed to renew subscription", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(subscription)
	}
}
