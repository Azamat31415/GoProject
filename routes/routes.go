package routes

import (
	"GoProject/handlers"
	"fmt"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
	"net/http"
)

func InitializeRoutes(r *chi.Mux, db *gorm.DB) {
	r.Post("/products", handlers.AddProduct(db))
	r.Put("/products/{id}", handlers.EditProduct(db))
	r.Post("/register", func(w http.ResponseWriter, r *http.Request) {
		handlers.Register(db, w, r)
	})
	r.Post("/login", func(w http.ResponseWriter, r *http.Request) {
		handlers.Login(db, w, r)
	})
	r.Post("/logout", func(w http.ResponseWriter, r *http.Request) {
		handlers.Logout(w, r) // Call the logout handler
	})
	r.Post("/protected", func(w http.ResponseWriter, r *http.Request) {
		if err := handlers.Authorize(db, r); err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		fmt.Fprintln(w, "Access granted!")
	})
}
