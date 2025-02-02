package middleware

import (
	"GoProject/handlers/auth_handlers"
	"fmt"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("9Q7MvM4M7jpDq6fjk8jMKVuY=n8RygTXGphFcz3L7txy"
var jwtSecret = []byte("9Q7MvM4M7jpDq6fjk8jMKVuY=n8RygTXGphFcz3L7txy")

func JWTMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		if auth_handlers.IsTokenRevoked(tokenString) {
			http.Error(w, "Token has been revoked", http.StatusUnauthorized)
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if token.Method != jwt.SigningMethodHS256 {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Method.Alg())
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}
