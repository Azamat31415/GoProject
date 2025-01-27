package routes

import (
	"GoProject/handlers"
	"GoProject/handlers/auth_handlers"
	"GoProject/internal/middleware"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
	"net/http"
)

func InitializeRoutes(r *chi.Mux, db *gorm.DB) {
	r.Post("/products", handlers.AddProduct(db))
	r.Put("/products/{id}", handlers.EditProduct(db))
	r.Post("/register", auth_handlers.RegisterHandler(db))
	r.Post("/login", auth_handlers.LoginHandler(db))
	r.Group(func(protected chi.Router) {
		protected.Use(middleware.JWTMiddleware)

		protected.Get("/protected", func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte("This is a protected route"))
		})

		protected.Post("/logout", auth_handlers.LogoutHandler())
	})
}
