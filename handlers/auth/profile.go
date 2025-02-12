package auth

import (
	"GoProject/configs"
	"encoding/json"
	"fmt"
	"gorm.io/gorm"
	"net/http"
)

func ProfileHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user, err := config.VerifyJWT(w, r, db)
		if err != nil || user == nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		fmt.Println("User data:", user.Email, user.FirstName, user.LastName, user.Phone)

		response := map[string]interface{}{
			"email":      user.Email,
			"first_name": user.FirstName,
			"last_name":  user.LastName,
			"phone":      user.Phone,
			"is_admin":   user.Role == "admin",
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(response)
	}
}
