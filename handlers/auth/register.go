package auth

import (
	"GoProject/migrations"
	"encoding/json"
	"gorm.io/gorm"
	"net/http"
)

func RegisterHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var regData migrations.UserRegistration
		if err := json.NewDecoder(r.Body).Decode(&regData); err != nil {
			http.Error(w, "Invalid data format", http.StatusBadRequest)
			return
		}

		if regData.Email == "" || regData.Password == "" || regData.FirstName == "" {
			http.Error(w, "Fields email, password, and first_name are required", http.StatusBadRequest)
			return
		}

		user := migrations.User{
			Email:     regData.Email,
			Password:  regData.Password,
			FirstName: regData.FirstName,
			LastName:  regData.LastName,
			Address:   regData.Address,
			Phone:     regData.Phone,
		}

		if err := user.HashPassword(); err != nil {
			http.Error(w, "Error hashing password", http.StatusInternalServerError)
			return
		}

		if err := db.Create(&user).Error; err != nil {
			http.Error(w, "Error creating user: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(map[string]string{
			"message": "User successfully registered",
		})
	}
}
