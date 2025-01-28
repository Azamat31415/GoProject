package routes

import (
	"GoProject/handlers/auth_handlers"
	"GoProject/handlers/order_handlers"
	"GoProject/handlers/product_handlers"
	"GoProject/internal/middleware"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
	"net/http"
)

func InitializeRoutes(r *chi.Mux, db *gorm.DB) {
	r.Post("/products", product_handlers.AddProduct(db))
	r.Put("/products/{id}", product_handlers.EditProduct(db))
	r.Delete("/products/{id}", product_handlers.DeleteProduct(db))
	r.Get("/products", product_handlers.FetchAllProducts(db))
	r.Get("/products/{id}", product_handlers.FetchProductByID(db))
	r.Post("/register", auth_handlers.RegisterHandler(db))
	r.Post("/login", auth_handlers.LoginHandler(db))
	r.Put("/orders/{id}/status", order_handlers.UpdateOrderStatusHandler(db))

	r.Group(func(protected chi.Router) {
		protected.Use(middleware.JWTMiddleware)

		protected.Get("/protected", func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte("This is a protected route"))
		})

		protected.Post("/logout", auth_handlers.LogoutHandler())
		protected.Put("/orders/{id}/status", order_handlers.UpdateOrderStatusHandler(db))
	})
}
