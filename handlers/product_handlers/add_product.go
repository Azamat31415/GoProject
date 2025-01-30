package product_handlers

import (
	"GoProject/migrations"
	"encoding/json"
	"fmt"
	"net/http"

	"gorm.io/gorm"
)

// AddProduct handles a query for adding a product
func AddProduct(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not supported", http.StatusMethodNotAllowed)
			return
		}

		var product migrations.Product
		fmt.Println("Received request to add product")

		if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
			http.Error(w, "Invalid input", http.StatusBadRequest)
			return
		}

		if err := db.Create(&product).Error; err != nil {
			http.Error(w, "Failed to create product", http.StatusInternalServerError)
			return
		}

		fmt.Println("Product added:", product)

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(product)
	}
}
