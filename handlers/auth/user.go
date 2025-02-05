package auth

import (
	"GoProject/migrations"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
)

func GetUserAddress(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Извлекаем id из URL
		id := chi.URLParam(r, "id")
		userID, err := strconv.Atoi(id)
		if err != nil {
			http.Error(w, "Invalid user ID", http.StatusBadRequest)
			return
		}

		var user migrations.User
		// Получаем пользователя по ID
		if err := db.First(&user, userID).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				http.Error(w, "User not found", http.StatusNotFound)
			} else {
				http.Error(w, "Failed to fetch user", http.StatusInternalServerError)
			}
			return
		}

		// Ответ в формате JSON с использованием json.NewEncoder
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)

		// Создаем структуру для ответа
		response := map[string]string{
			"address": user.Address,
		}

		// Кодируем в JSON
		if err := json.NewEncoder(w).Encode(response); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		}
	}
}
