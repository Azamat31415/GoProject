package handlers

import (
	"GoProject/migrations"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"gorm.io/gorm"
	"net/http"
	"time"
)

// Register handles user registration
func Register(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}

	var input migrations.UserRegistration
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	if len(input.Email) < 8 || len(input.Password) < 8 {
		http.Error(w, "Invalid email or password length", http.StatusBadRequest)
		return
	}

	var existingUser migrations.User
	if err := db.Where("email = ?", input.Email).First(&existingUser).Error; err == nil {
		http.Error(w, "User already exists", http.StatusConflict)
		return
	}

	newUser := migrations.User{
		Email:     input.Email,
		Password:  input.Password,
		FirstName: input.FirstName,
		LastName:  input.LastName,
		Address:   input.Address,
		Phone:     input.Phone,
	}

	if err := newUser.HashPassword(); err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	if err := db.Create(&newUser).Error; err != nil {
		http.Error(w, "Failed to save user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintln(w, "User registered successfully!")
}

// Login handles user authentication
func Login(db *gorm.DB, w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid method", http.StatusMethodNotAllowed)
		return
	}

	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	var user migrations.User
	if err := db.Where("email = ?", input.Email).First(&user).Error; err != nil {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	if !user.CheckPassword(input.Password) {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	sessionToken := GenerateToken(32)
	csrfToken := GenerateToken(32)

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    sessionToken,
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: true,
	})
	http.SetCookie(w, &http.Cookie{
		Name:     "csrf_token",
		Value:    csrfToken,
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: false,
	})

	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "Login successful!")
}

// Authorize validates session and CSRF tokens
func Authorize(db *gorm.DB, r *http.Request) error {
	sessionToken, err := r.Cookie("session_token")
	if err != nil || sessionToken.Value == "" {
		return errors.New("unauthorized")
	}

	csrfToken := r.Header.Get("X-CSRF-TOKEN")
	if csrfToken == "" {
		return errors.New("missing CSRF token")
	}

	return nil
}

// GenerateToken creates a random string token
func GenerateToken(length int) string {
	bytes := make([]byte, length)
	if _, err := rand.Read(bytes); err != nil {
		panic(fmt.Sprintf("Failed to generate token: %v", err))
	}
	return base64.URLEncoding.EncodeToString(bytes)
}

// Logout handles user logout
func Logout(w http.ResponseWriter, r *http.Request) {
	// Clear session token
	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour), // Set to the past to expire the cookie
		HttpOnly: true,
	})

	// Clear CSRF token
	http.SetCookie(w, &http.Cookie{
		Name:     "csrf_token",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour), // Set to the past to expire the cookie
		HttpOnly: false,
	})

	// Respond to the client that the logout was successful
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "Logout successful!")
}
