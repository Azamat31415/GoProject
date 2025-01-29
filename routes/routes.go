package routes

import (
	"GoProject/handlers/auth_handlers"
	"GoProject/handlers/order_handlers"
	"GoProject/handlers/personal_pet_handlers"
	"GoProject/handlers/product_handlers"
	"GoProject/handlers/subscription_handlers"
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

	r.Post("/orders", order_handlers.CreateOrder(db))
	r.Put("/orders/{id}/status", order_handlers.UpdateOrderStatusHandler(db))
	r.Put("/orders/{order_id}/delivery", order_handlers.ChooseDeliveryMethod(db))

	r.Group(func(protected chi.Router) {
		protected.Use(middleware.JWTMiddleware)

		protected.Get("/protected", func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte("This is a protected route"))
		})

		protected.Post("/logout", auth_handlers.LogoutHandler())
	})

	r.Post("/pets", personal_pet_handlers.AddUserPet(db))
	r.Put("/pets/{id}", personal_pet_handlers.EditUserPet(db))
	r.Delete("/pets/{id}", personal_pet_handlers.DeleteUserPet(db))
	r.Get("/pets/{id}", personal_pet_handlers.FetchUserPets(db))
	r.Get("/users/{userID}/pets", personal_pet_handlers.FetchUserPetByID(db))

	r.Post("/subscriptions", subscription_handlers.CreateSubscription(db))
	r.Delete("/subscriptions/{id}", subscription_handlers.DeleteSubscription(db))
	r.Put("/subscriptions/{id}/renew", subscription_handlers.RenewSubscription(db))
}
