package auth_handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"sync"
)

var revokedTokens = struct {
	sync.Mutex
	tokens map[string]bool
}{tokens: make(map[string]bool)}

type LogoutResponse struct {
	Message string `json:"message"`
}

func LogoutHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header is required", http.StatusBadRequest)
			return
		}
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		revokedTokens.Lock()
		revokedTokens.tokens[tokenString] = true
		revokedTokens.Unlock()

		response := LogoutResponse{
			Message: "Logout successful",
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(response)
	}
}

func IsTokenRevoked(token string) bool {
	revokedTokens.Lock()
	defer revokedTokens.Unlock()
	return revokedTokens.tokens[token]
}
