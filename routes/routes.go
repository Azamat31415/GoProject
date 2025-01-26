package routes

import (
	"GoProject/handlers"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
)

func InitializeRoutes(r *chi.Mux, db *gorm.DB) {
	r.Post("/products", handlers.AddProduct(db))
	r.Put("/products/{id}", handlers.EditProduct(db))
}
