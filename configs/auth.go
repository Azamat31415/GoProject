package config

import (
	"net/http"
	"strings"

	"GoProject/migrations"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

var JwtSecret = []byte("9Q7MvM4M7jpDq6fjk8jMKVuY=n8RygTXGphFcz3L7txy")

func VerifyJWT(w http.ResponseWriter, r *http.Request, db *gorm.DB) (*migrations.User, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Authorization header is required", http.StatusUnauthorized)
		return nil, nil
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return JwtSecret, nil
	})
	if err != nil || !token.Valid {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		http.Error(w, "Invalid token claims", http.StatusUnauthorized)
		return nil, err
	}

	userID := uint(claims["user_id"].(float64))
	var user migrations.User
	if err := db.First(&user, userID).Error; err != nil {
		http.Error(w, "User not found", http.StatusUnauthorized)
		return nil, err
	}

	return &user, nil
}
